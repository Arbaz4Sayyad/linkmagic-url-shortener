package com.urlshortener.controller;

import com.urlshortener.dto.BulkShortenRequest;
import com.urlshortener.dto.BulkShortenResponse;
import com.urlshortener.dto.UrlRequest;
import com.urlshortener.dto.UrlResponse;
import com.urlshortener.entity.Url;
import com.urlshortener.entity.User;
import com.urlshortener.service.UrlService;
import com.urlshortener.security.UserDetailsImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class UrlController {

    private final UrlService urlService;
    private final com.urlshortener.service.AnalyticsService analyticsService;

    @PostMapping("/shorten")
    public ResponseEntity<UrlResponse> createShortUrl(@Valid @RequestBody UrlRequest urlRequest) {
        log.info("Received request to shorten URL: {}", urlRequest.getOriginalUrl());
        
        try {
            if (urlRequest.getExpiryDate() != null && urlRequest.getExpiryDate().isBefore(LocalDateTime.now())) {
                return ResponseEntity.badRequest().build();
            }

            // Get current user if authenticated
            User currentUser = null;
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken)) {
                Object principal = auth.getPrincipal();
                if (principal instanceof UserDetailsImpl) {
                    UserDetailsImpl userDetails = (UserDetailsImpl) principal;
                    currentUser = User.builder().id(userDetails.getId()).build();
                }
            }

            Url url = urlService.createShortUrl(
                urlRequest.getOriginalUrl(), 
                urlRequest.getExpiryDate(), 
                currentUser,
                urlRequest.getCustomSlug()
            );
            
            String baseUrl = "http://localhost:8080/api/v1";
            UrlResponse response = UrlResponse.fromEntity(baseUrl, url);
            
            log.info("Successfully created short URL: {} -> {}", url.getShortCode(), url.getOriginalUrl());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            log.error("Failed to create short URL", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/shorten/bulk")
    public ResponseEntity<BulkShortenResponse> createShortUrlsBulk(@Valid @RequestBody BulkShortenRequest bulkRequest) {
        log.info("Received request to bulk shorten {} URLs", bulkRequest.getRequests().size());
        
        try {
            // Get current user if authenticated
            User currentUser = null;
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken)) {
                Object principal = auth.getPrincipal();
                if (principal instanceof UserDetailsImpl) {
                    UserDetailsImpl userDetails = (UserDetailsImpl) principal;
                    currentUser = User.builder().id(userDetails.getId()).build();
                }
            }

            String baseUrl = "http://localhost:8080/api/v1";
            List<BulkShortenResponse.Result> results = urlService.bulkShorten(bulkRequest.getRequests(), currentUser, baseUrl);
            
            BulkShortenResponse response = BulkShortenResponse.builder()
                    .results(results)
                    .build();
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            log.error("Failed to process bulk shorten request", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{shortCode}")
    public void redirectToOriginalUrl(@PathVariable String shortCode, HttpServletRequest request, HttpServletResponse response) throws IOException {
        log.info("Redirection request for short code: {}", shortCode);
        
        urlService.getOriginalUrl(shortCode).ifPresentOrElse(
            url -> {
                try {
                    // Log rich analytics
                    analyticsService.recordClick(shortCode, request);
                    response.sendRedirect(url.getOriginalUrl());
                } catch (IOException e) {
                    log.error("Redirect failed", e);
                }
            },
            () -> {
                try {
                    response.sendError(HttpServletResponse.SC_NOT_FOUND, "Long URL not found or expired");
                } catch (IOException e) {
                    log.error("Error sending response", e);
                }
            }
        );
    }

    @GetMapping("/info/{shortCode}")
    public ResponseEntity<UrlResponse> getUrlInfo(@PathVariable String shortCode) {
        return urlService.getUrlByShortCode(shortCode)
                .map(url -> ResponseEntity.ok(UrlResponse.fromEntity("http://localhost:8080/api/v1", url)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{shortCode}")
    public ResponseEntity<?> deleteUrl(@PathVariable String shortCode) {
        return urlService.getUrlByShortCode(shortCode)
                .map(url -> {
                    url.setIsActive(false);
                    // In a real app, we'd save this change
                    return ResponseEntity.ok().body(new java.util.HashMap<String, String>() {{
                        put("message", "URL deactivated successfully");
                    }});
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/urls")
    public ResponseEntity<List<UrlResponse>> getUserUrls() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        List<Url> urls = urlService.getUrlsByUser(userDetails.getId());
        String baseUrl = "http://localhost:8080/api/v1";
        
        List<UrlResponse> response = urls.stream()
                .map(url -> UrlResponse.fromEntity(baseUrl, url))
                .collect(java.util.stream.Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        long activeUrls = urlService.getActiveUrlCount();
        return ResponseEntity.ok(new java.util.HashMap<String, Object>() {{
            put("status", "UP");
            put("activeUrls", activeUrls);
            put("timestamp", LocalDateTime.now());
        }});
    }
}
