package com.urlshortener.filter;

import com.urlshortener.config.RateLimitConfig;
import com.urlshortener.service.CacheService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class RateLimitFilterTest {

    @Mock
    private CacheService cacheService;

    @Mock
    private RateLimitConfig rateLimitConfig;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @Mock
    private PrintWriter writer;

    @InjectMocks
    private RateLimitFilter rateLimitFilter;

    @BeforeEach
    void setUp() throws IOException {
        when(rateLimitConfig.isEnabled()).thenReturn(true);
        when(rateLimitConfig.getMaxRequestsPerMinute()).thenReturn(100);
        when(rateLimitConfig.getMaxRequestsPerHour()).thenReturn(1000);
        when(response.getWriter()).thenReturn(writer);
    }

    @Test
    void shouldAllowRequestWhenUnderRateLimit() throws ServletException, IOException {
        // Given
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");
        when(request.getRequestURI()).thenReturn("/api/v1/api/shorten");
        when(cacheService.getCachedClickCount(anyString())).thenReturn(Optional.of(0L));

        // When
        rateLimitFilter.doFilterInternal(request, response, filterChain);

        // Then
        verify(filterChain).doFilter(request, response);
        verify(response, never()).setStatus(429);
    }

    @Test
    void shouldBlockRequestWhenOverRateLimit() throws ServletException, IOException {
        // Given
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");
        when(request.getRequestURI()).thenReturn("/api/v1/api/shorten");
        when(cacheService.getCachedClickCount(anyString())).thenReturn(Optional.of(150L)); // Over limit

        // When
        rateLimitFilter.doFilterInternal(request, response, filterChain);

        // Then
        verify(response).setStatus(429);
        verify(filterChain, never()).doFilter(request, response);
    }

    @Test
    void shouldSkipRateLimitingForHealthEndpoints() throws ServletException, IOException {
        // Given
        when(request.getRequestURI()).thenReturn("/api/v1/health");
        when(rateLimitConfig.isEnabled()).thenReturn(true);

        // When
        rateLimitFilter.doFilterInternal(request, response, filterChain);

        // Then
        verify(filterChain).doFilter(request, response);
        verify(cacheService, never()).getCachedClickCount(anyString());
    }

    @Test
    void shouldSkipRateLimitingWhenDisabled() throws ServletException, IOException {
        // Given
        when(rateLimitConfig.isEnabled()).thenReturn(false);
        when(request.getRequestURI()).thenReturn("/api/v1/api/shorten");

        // When
        rateLimitFilter.doFilterInternal(request, response, filterChain);

        // Then
        verify(filterChain).doFilter(request, response);
        verify(cacheService, never()).getCachedClickCount(anyString());
    }

    @Test
    void shouldHandleXForwardedForHeader() throws ServletException, IOException {
        // Given
        when(request.getHeader("X-Forwarded-For")).thenReturn("192.168.1.100");
        when(request.getRequestURI()).thenReturn("/api/v1/api/shorten");
        when(cacheService.getCachedClickCount(anyString())).thenReturn(Optional.of(0L));

        // When
        rateLimitFilter.doFilterInternal(request, response, filterChain);

        // Then
        verify(filterChain).doFilter(request, response);
        verify(cacheService).getCachedClickCount("rate_limit:192.168.1.100:minute");
    }

    @Test
    void shouldIncrementCounters() throws ServletException, IOException {
        // Given
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");
        when(request.getRequestURI()).thenReturn("/api/v1/api/shorten");
        when(cacheService.getCachedClickCount(anyString())).thenReturn(Optional.of(0L));

        // When
        rateLimitFilter.doFilterInternal(request, response, filterChain);

        // Then
        verify(cacheService, times(2)).incrementClickCount(anyString());
        verify(cacheService, times(2)).setClickCount(anyString(), anyLong());
    }
}
