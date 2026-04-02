package com.urlshortener.controller;

import com.urlshortener.service.CacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/cache")
@RequiredArgsConstructor
@Slf4j
public class CacheController {

    private final CacheService cacheService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> cacheHealth() {
        Map<String, Object> response = new HashMap<>();
        boolean isAvailable = cacheService.isCacheAvailable();
        
        response.put("status", isAvailable ? "UP" : "DOWN");
        response.put("type", "Redis");
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Map<String, String>> clearCache() {
        cacheService.clearAllCache();
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Cache cleared successfully");
        
        log.info("Cache cleared via API call");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/invalidate/{shortCode}")
    public ResponseEntity<Map<String, String>> invalidateUrlCache(@PathVariable String shortCode) {
        cacheService.invalidateUrlCache(shortCode);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Cache invalidated for short code: " + shortCode);
        
        log.info("Cache invalidated for short code: {}", shortCode);
        return ResponseEntity.ok(response);
    }
}
