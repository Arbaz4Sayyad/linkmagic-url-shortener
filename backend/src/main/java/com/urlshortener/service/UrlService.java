package com.urlshortener.service;

import com.urlshortener.entity.Url;
import com.urlshortener.entity.User;
import com.urlshortener.exception.UrlExpiredException;
import com.urlshortener.exception.UrlNotFoundException;
import com.urlshortener.exception.UrlShortenerException;
import com.urlshortener.repository.UrlRepository;
import com.urlshortener.util.UrlValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import com.urlshortener.dto.BulkShortenResponse;
import com.urlshortener.dto.UrlRequest;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UrlService {

    private final UrlRepository urlRepository;
    private final ShortCodeGenerator shortCodeGenerator;
    private final CacheService cacheService;
    private final UrlValidator urlValidator;
    private static final int MAX_RETRIES = 10;

    public Url createShortUrl(String originalUrl, LocalDateTime expiryDate, User user) {
        return createShortUrl(originalUrl, expiryDate, user, null);
    }

    public Url createShortUrl(String originalUrl, LocalDateTime expiryDate, User user, String customSlug) {
        log.info("Creating short URL for: {} (Custom Slug: {})", originalUrl, customSlug);
        
        // Validate URL format
        urlValidator.validateUrl(originalUrl);
        
        // Check if custom slug is already taken
        if (customSlug != null && !customSlug.isEmpty()) {
            if (urlRepository.findByCustomSlug(customSlug).isPresent() || 
                urlRepository.findByShortCode(customSlug).isPresent()) {
                throw new UrlShortenerException("Custom slug already exists");
            }
        }

        String shortCode;
        if (customSlug != null && !customSlug.isEmpty()) {
            shortCode = customSlug;
        } else {
            // Check if URL already exists for ANONYMOUS user (to avoid duplicate random links)
            if (user == null) {
                Optional<Url> existingUrl = urlRepository.findByOriginalUrlAndIsActiveTrue(originalUrl);
                if (existingUrl.isPresent() && isUrlValid(existingUrl.get()) && existingUrl.get().getUser() == null) {
                    log.info("Returning existing anonymous short URL for: {}", originalUrl);
                    return existingUrl.get();
                }
            }

            int retryCount = 0;
            do {
                shortCode = shortCodeGenerator.generateRandomShortCode();
                if (retryCount >= MAX_RETRIES) {
                    log.error("Failed to generate unique short code after {} attempts", MAX_RETRIES);
                    throw new UrlShortenerException("Unable to generate unique short code");
                }
                retryCount++;
            } while (urlRepository.findByShortCode(shortCode).isPresent() || 
                     urlRepository.findByCustomSlug(shortCode).isPresent());
        }

        Url newUrl = Url.builder()
                .originalUrl(originalUrl)
                .shortCode(shortCode)
                .customSlug(customSlug)
                .expiryDate(expiryDate)
                .clickCount(0L)
                .isActive(true)
                .user(user)
                .build();

        Url savedUrl = urlRepository.save(newUrl);
        
        // Cache the new URL
        cacheService.cacheUrl(savedUrl.getShortCode(), savedUrl.getOriginalUrl());
        
        log.info("Successfully created short URL: {} -> {}", shortCode, originalUrl);
        return savedUrl;
    }

    public List<BulkShortenResponse.Result> bulkShorten(List<UrlRequest> requests, User user, String baseUrl) {
        log.info("Processing bulk shorten request for {} URLs asynchronously", requests.size());
        
        List<CompletableFuture<BulkShortenResponse.Result>> futures = requests.stream()
            .map(request -> CompletableFuture.supplyAsync(() -> {
                BulkShortenResponse.Result result = new BulkShortenResponse.Result();
                result.setOriginalUrl(request.getOriginalUrl());
                
                try {
                    Url url = createShortUrl(request.getOriginalUrl(), request.getExpiryDate(), user, request.getCustomSlug());
                    result.setShortUrl(baseUrl != null ? baseUrl + "/" + url.getShortCode() : url.getShortCode());
                    result.setStatus("SUCCESS");
                } catch (Exception e) {
                    log.error("Failed to shorten URL in bulk async context: {}", request.getOriginalUrl(), e);
                    result.setStatus("FAILED");
                    result.setError(e.getMessage());
                }
                return result;
            }))
            .toList();
            
        return futures.stream()
            .map(CompletableFuture::join)
            .toList();
    }

    @Transactional(readOnly = true)
    public Optional<Url> getOriginalUrl(String shortCode) {
        log.debug("Looking up original URL for short code/slug: {}", shortCode);
        
        // First check cache
        Optional<String> cachedUrl = cacheService.getCachedUrl(shortCode);
        if (cachedUrl.isPresent()) {
            log.debug("Cache hit for short code: {}", shortCode);
            Url cachedUrlObj = Url.builder()
                    .shortCode(shortCode)
                    .originalUrl(cachedUrl.get())
                    .isActive(true)
                    .build();
            return Optional.of(cachedUrlObj);
        }
        
        log.debug("Cache miss for short code: {}, checking database", shortCode);
        // Try short_code then custom_slug
        Optional<Url> urlOpt = urlRepository.findByShortCodeAndIsActiveTrue(shortCode)
                .or(() -> urlRepository.findByCustomSlugAndIsActiveTrue(shortCode));
        
        if (urlOpt.isEmpty()) {
            log.warn("Short code/slug not found or inactive: {}", shortCode);
            return Optional.empty();
        }

        Url url = urlOpt.get();
        
        if (!isUrlValid(url)) {
            log.warn("URL expired or invalid for short code: {}", shortCode);
            url.setIsActive(false);
            urlRepository.save(url);
            cacheService.invalidateUrlCache(shortCode);
            return Optional.empty();
        }

        // Cache the valid URL
        cacheService.cacheUrl(shortCode, url.getOriginalUrl());
        return Optional.of(url);
    }

    public Url incrementClickCount(String shortCode) {
        log.debug("Incrementing click count for short code/slug: {}", shortCode);
        
        Optional<Url> urlOpt = urlRepository.findByShortCodeAndIsActiveTrue(shortCode)
                .or(() -> urlRepository.findByCustomSlugAndIsActiveTrue(shortCode));

        if (urlOpt.isEmpty()) {
            throw new UrlNotFoundException(shortCode);
        }

        Url url = urlOpt.get();
        
        if (!isUrlValid(url)) {
            url.setIsActive(false);
            urlRepository.save(url);
            cacheService.invalidateUrlCache(shortCode);
            throw new UrlExpiredException(shortCode);
        }

        urlRepository.incrementClickCount(url.getId(), LocalDateTime.now());
        
        // Refresh and update cache
        url = urlRepository.findById(url.getId()).orElseThrow();
        cacheService.setClickCount(shortCode, url.getClickCount());
        
        return url;
    }

    public List<Url> getUrlsByUser(Long userId) {
        return urlRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    private boolean isUrlValid(Url url) {
        if (!url.getIsActive()) return false;
        if (url.getExpiryDate() != null && url.getExpiryDate().isBefore(LocalDateTime.now())) return false;
        return true;
    }

    @Transactional(readOnly = true)
    public Optional<Url> getUrlByShortCode(String shortCode) {
        return urlRepository.findByShortCode(shortCode)
                .or(() -> urlRepository.findByCustomSlug(shortCode));
    }

    @Transactional(readOnly = true)
    public long getActiveUrlCount() {
        return urlRepository.countByIsActiveTrue();
    }

    @Transactional
    public void cleanupExpiredUrls() {
        log.info("Starting cleanup of expired URLs");
        List<Url> expiredUrls = urlRepository.findByIsActiveTrueAndExpiryDateBefore(LocalDateTime.now());
        if (!expiredUrls.isEmpty()) {
            List<Long> expiredIds = expiredUrls.stream().map(Url::getId).toList();
            expiredUrls.forEach(url -> cacheService.invalidateUrlCache(url.getShortCode()));
            urlRepository.deactivateUrlsByIds(expiredIds, false);
            log.info("Deactivated {} expired URLs", expiredIds.size());
        }
    }
}
