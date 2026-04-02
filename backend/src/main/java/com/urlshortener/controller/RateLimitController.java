package com.urlshortener.controller;

import com.urlshortener.config.RateLimitConfig;
import com.urlshortener.service.CacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@Slf4j
public class RateLimitController {

    private final RateLimitConfig rateLimitConfig;
    private final CacheService cacheService;

    @GetMapping("/rate-limit/status")
    public ResponseEntity<Map<String, Object>> getRateLimitStatus() {
        Map<String, Object> status = new HashMap<>();
        
        status.put("enabled", rateLimitConfig.isEnabled());
        status.put("maxRequestsPerMinute", rateLimitConfig.getMaxRequestsPerMinute());
        status.put("maxRequestsPerHour", rateLimitConfig.getMaxRequestsPerHour());
        status.put("maxRequestsPerDay", rateLimitConfig.getMaxRequestsPerDay());
        status.put("cacheAvailable", cacheService.isCacheAvailable());
        
        return ResponseEntity.ok(status);
    }

    @PostMapping("/rate-limit/clear")
    public ResponseEntity<Map<String, String>> clearRateLimitCounters(@RequestParam(required = false) String ip) {
        Map<String, String> response = new HashMap<>();
        
        if (ip != null && !ip.trim().isEmpty()) {
            // Clear specific IP counters
            String minuteKey = "rate_limit:" + ip + ":minute";
            String hourKey = "rate_limit:" + ip + ":hour";
            
            cacheService.invalidateUrlCache(minuteKey);
            cacheService.invalidateUrlCache(hourKey);
            
            response.put("message", "Rate limit counters cleared for IP: " + ip);
            log.info("Rate limit counters cleared for IP: {}", ip);
        } else {
            // Clear all rate limit counters
            cacheService.clearAllCache();
            response.put("message", "All rate limit counters cleared");
            log.info("All rate limit counters cleared");
        }
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/rate-limit/config")
    public ResponseEntity<Map<String, Object>> updateRateLimitConfig(
            @RequestParam(required = false) Boolean enabled,
            @RequestParam(required = false) Integer maxRequestsPerMinute,
            @RequestParam(required = false) Integer maxRequestsPerHour,
            @RequestParam(required = false) Integer maxRequestsPerDay) {
        
        Map<String, Object> response = new HashMap<>();
        
        if (enabled != null) {
            rateLimitConfig.setEnabled(enabled);
            response.put("enabled", enabled);
        }
        
        if (maxRequestsPerMinute != null && maxRequestsPerMinute > 0) {
            rateLimitConfig.setMaxRequestsPerMinute(maxRequestsPerMinute);
            response.put("maxRequestsPerMinute", maxRequestsPerMinute);
        }
        
        if (maxRequestsPerHour != null && maxRequestsPerHour > 0) {
            rateLimitConfig.setMaxRequestsPerHour(maxRequestsPerHour);
            response.put("maxRequestsPerHour", maxRequestsPerHour);
        }
        
        if (maxRequestsPerDay != null && maxRequestsPerDay > 0) {
            rateLimitConfig.setMaxRequestsPerDay(maxRequestsPerDay);
            response.put("maxRequestsPerDay", maxRequestsPerDay);
        }
        
        response.put("message", "Rate limit configuration updated");
        log.info("Rate limit configuration updated: {}", response);
        
        return ResponseEntity.ok(response);
    }
}
