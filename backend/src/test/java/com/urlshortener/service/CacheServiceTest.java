package com.urlshortener.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.time.Duration;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class CacheServiceTest {

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    @InjectMocks
    private CacheService cacheService;

    private String testShortCode;
    private String testUrl;

    @BeforeEach
    void setUp() {
        testShortCode = "abc123";
        testUrl = "https://example.com";
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    }

    @Test
    void shouldCacheUrlSuccessfully() {
        // When
        cacheService.cacheUrl(testShortCode, testUrl);

        // Then
        verify(valueOperations).set(eq("url:" + testShortCode), eq(testUrl), eq(Duration.ofHours(1)));
    }

    @Test
    void shouldGetCachedUrlWhenExists() {
        // Given
        when(valueOperations.get("url:" + testShortCode)).thenReturn(testUrl);

        // When
        Optional<String> result = cacheService.getCachedUrl(testShortCode);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get()).isEqualTo(testUrl);
        verify(valueOperations).get("url:" + testShortCode);
    }

    @Test
    void shouldReturnEmptyWhenUrlNotCached() {
        // Given
        when(valueOperations.get("url:" + testShortCode)).thenReturn(null);

        // When
        Optional<String> result = cacheService.getCachedUrl(testShortCode);

        // Then
        assertThat(result).isEmpty();
        verify(valueOperations).get("url:" + testShortCode);
    }

    @Test
    void shouldReturnEmptyWhenCacheExceptionOccurs() {
        // Given
        when(valueOperations.get("url:" + testShortCode)).thenThrow(new RuntimeException("Redis error"));

        // When
        Optional<String> result = cacheService.getCachedUrl(testShortCode);

        // Then
        assertThat(result).isEmpty();
    }

    @Test
    void shouldInvalidateUrlCache() {
        // Given
        when(redisTemplate.delete("url:" + testShortCode)).thenReturn(true);

        // When
        cacheService.invalidateUrlCache(testShortCode);

        // Then
        verify(redisTemplate).delete("url:" + testShortCode);
    }

    @Test
    void shouldIncrementClickCount() {
        // When
        cacheService.incrementClickCount(testShortCode);

        // Then
        verify(valueOperations).increment("clicks:" + testShortCode);
        verify(redisTemplate).expire(eq("clicks:" + testShortCode), eq(Duration.ofHours(1)));
    }

    @Test
    void shouldGetCachedClickCount() {
        // Given
        Long clickCount = 42L;
        when(valueOperations.get("clicks:" + testShortCode)).thenReturn(clickCount.toString());

        // When
        Optional<Long> result = cacheService.getCachedClickCount(testShortCode);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get()).isEqualTo(clickCount);
    }

    @Test
    void shouldReturnEmptyWhenClickCountNotCached() {
        // Given
        when(valueOperations.get("clicks:" + testShortCode)).thenReturn(null);

        // When
        Optional<Long> result = cacheService.getCachedClickCount(testShortCode);

        // Then
        assertThat(result).isEmpty();
    }

    @Test
    void shouldSetClickCount() {
        // Given
        Long clickCount = 100L;

        // When
        cacheService.setClickCount(testShortCode, clickCount);

        // Then
        verify(valueOperations).set(eq("clicks:" + testShortCode), eq(clickCount), eq(Duration.ofHours(1)));
    }

    @Test
    void shouldClearAllCache() {
        // Given
        when(redisTemplate.getConnectionFactory()).thenReturn(mock());
        when(redisTemplate.getConnectionFactory().getConnection()).thenReturn(mock());

        // When
        cacheService.clearAllCache();

        // Then
        verify(redisTemplate.getConnectionFactory().getConnection()).flushDb();
    }

    @Test
    void shouldReturnTrueWhenCacheIsAvailable() {
        // Given
        doNothing().when(valueOperations).set(eq("health_check"), eq("ok"), any(Duration.class));
        when(valueOperations.get("health_check")).thenReturn("ok");
        when(redisTemplate.delete("health_check")).thenReturn(true);

        // When
        boolean result = cacheService.isCacheAvailable();

        // Then
        assertThat(result).isTrue();
        verify(redisTemplate).delete("health_check");
    }

    @Test
    void shouldReturnFalseWhenCacheIsNotAvailable() {
        // Given
        doThrow(new RuntimeException("Redis down")).when(valueOperations).set(eq("health_check"), eq("ok"), any(Duration.class));

        // When
        boolean result = cacheService.isCacheAvailable();

        // Then
        assertThat(result).isFalse();
    }

    @Test
    void shouldHandleNullValueInGetCachedClickCount() {
        // Given
        when(valueOperations.get("clicks:" + testShortCode)).thenReturn(null);

        // When
        Optional<Long> result = cacheService.getCachedClickCount(testShortCode);

        // Then
        assertThat(result).isEmpty();
    }

    @Test
    void shouldHandleInvalidValueInGetCachedClickCount() {
        // Given
        when(valueOperations.get("clicks:" + testShortCode)).thenReturn("invalid_number");

        // When
        Optional<Long> result = cacheService.getCachedClickCount(testShortCode);

        // Then
        assertThat(result).isEmpty();
    }

    @Test
    void shouldHandleExceptionInCacheUrl() {
        // Given
        doThrow(new RuntimeException("Redis error")).when(valueOperations)
                .set(anyString(), anyString(), any(Duration.class));

        // When
        cacheService.cacheUrl(testShortCode, testUrl);

        // Then - Should not throw exception, just log it
        verify(valueOperations).set(eq("url:" + testShortCode), eq(testUrl), eq(Duration.ofHours(1)));
    }

    @Test
    void shouldHandleExceptionInInvalidateUrlCache() {
        // Given
        when(redisTemplate.delete("url:" + testShortCode)).thenThrow(new RuntimeException("Redis error"));

        // When
        cacheService.invalidateUrlCache(testShortCode);

        // Then - Should not throw exception, just log it
        verify(redisTemplate).delete("url:" + testShortCode);
    }
}
