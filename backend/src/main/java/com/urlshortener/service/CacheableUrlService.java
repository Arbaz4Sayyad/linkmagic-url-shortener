package com.urlshortener.service;

import com.urlshortener.entity.Url;
import com.urlshortener.repository.UrlRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CacheableUrlService {
    
    private final UrlRepository urlRepository;
    
    @Cacheable(value = "urls", key = "#shortCode", unless = "#result == null || !#result.active")
    public Optional<Url> getCachedUrl(String shortCode) {
        log.debug("Cache miss for short code: {}, querying database", shortCode);
        return urlRepository.findByShortCodeAndIsActiveTrue(shortCode);
    }
    
    @CachePut(value = "urls", key = "#url.shortCode")
    public Url cacheUrl(Url url) {
        log.debug("Caching URL with short code: {}", url.getShortCode());
        return url;
    }
    
    @CacheEvict(value = "urls", key = "#shortCode")
    public void evictUrlCache(String shortCode) {
        log.debug("Evicting cache for short code: {}", shortCode);
    }
    
    @CacheEvict(value = "urls", allEntries = true)
    public void evictAllCache() {
        log.info("Evicting all URL cache entries");
    }
}
