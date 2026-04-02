package com.urlshortener.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class CacheService {
    
    private final RedisTemplate<String, Object> redisTemplate;
    
    private static final String URL_CACHE_PREFIX = "url:";
    private static final String CLICK_COUNT_PREFIX = "clicks:";
    private static final Duration DEFAULT_TTL = Duration.ofHours(1);
    
    public void cacheUrl(String shortCode, String originalUrl) {
        String key = URL_CACHE_PREFIX + shortCode;
        try {
            redisTemplate.opsForValue().set(key, originalUrl, DEFAULT_TTL);
            log.debug("Cached URL for short code: {}", shortCode);
        } catch (Exception e) {
            log.error("Failed to cache URL for short code: {}", shortCode, e);
        }
    }
    
    public Optional<String> getCachedUrl(String shortCode) {
        String key = URL_CACHE_PREFIX + shortCode;
        try {
            String cachedUrl = (String) redisTemplate.opsForValue().get(key);
            if (cachedUrl != null) {
                log.debug("Cache hit for short code: {}", shortCode);
                return Optional.of(cachedUrl);
            }
            log.debug("Cache miss for short code: {}", shortCode);
            return Optional.empty();
        } catch (Exception e) {
            log.error("Failed to get cached URL for short code: {}", shortCode, e);
            return Optional.empty();
        }
    }
    
    public void invalidateUrlCache(String shortCode) {
        String key = URL_CACHE_PREFIX + shortCode;
        try {
            Boolean deleted = redisTemplate.delete(key);
            if (Boolean.TRUE.equals(deleted)) {
                log.debug("Invalidated cache for short code: {}", shortCode);
            }
        } catch (Exception e) {
            log.error("Failed to invalidate cache for short code: {}", shortCode, e);
        }
    }
    
    public void incrementClickCount(String shortCode) {
        String key = CLICK_COUNT_PREFIX + shortCode;
        try {
            redisTemplate.opsForValue().increment(key);
            redisTemplate.expire(key, DEFAULT_TTL);
            log.debug("Incremented cached click count for short code: {}", shortCode);
        } catch (Exception e) {
            log.error("Failed to increment cached click count for short code: {}", shortCode, e);
        }
    }
    
    public Optional<Long> getCachedClickCount(String shortCode) {
        String key = CLICK_COUNT_PREFIX + shortCode;
        try {
            Object value = redisTemplate.opsForValue().get(key);
            if (value != null) {
                Long count = Long.valueOf(value.toString());
                log.debug("Retrieved cached click count for short code: {} -> {}", shortCode, count);
                return Optional.of(count);
            }
            return Optional.empty();
        } catch (Exception e) {
            log.error("Failed to get cached click count for short code: {}", shortCode, e);
            return Optional.empty();
        }
    }
    
    public void setClickCount(String shortCode, Long count) {
        String key = CLICK_COUNT_PREFIX + shortCode;
        try {
            redisTemplate.opsForValue().set(key, count, DEFAULT_TTL);
            log.debug("Set cached click count for short code: {} -> {}", shortCode, count);
        } catch (Exception e) {
            log.error("Failed to set cached click count for short code: {}", shortCode, e);
        }
    }
    
    public void clearAllCache() {
        try {
            redisTemplate.getConnectionFactory().getConnection().flushDb();
            log.info("Cleared all cache");
        } catch (Exception e) {
            log.error("Failed to clear cache", e);
        }
    }
    
    public boolean isCacheAvailable() {
        try {
            redisTemplate.opsForValue().set("health_check", "ok", Duration.ofSeconds(10));
            String result = (String) redisTemplate.opsForValue().get("health_check");
            redisTemplate.delete("health_check");
            return "ok".equals(result);
        } catch (Exception e) {
            log.error("Cache health check failed", e);
            return false;
        }
    }
}
