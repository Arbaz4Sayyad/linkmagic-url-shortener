package com.urlshortener.filter;

import com.urlshortener.config.RateLimitConfig;
import com.urlshortener.service.CacheService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Component
@Order(1)
@RequiredArgsConstructor
@Slf4j
public class RateLimitFilter extends OncePerRequestFilter {

    private final CacheService cacheService;
    private final RateLimitConfig rateLimitConfig;
    
    private static final String RATE_LIMIT_PREFIX = "rate_limit:";
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        String clientIp = getClientIpAddress(request);
        String requestUri = request.getRequestURI();
        
        // Skip rate limiting if disabled
        if (!rateLimitConfig.isEnabled()) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // Skip rate limiting for health checks and actuator endpoints
        if (isExemptEndpoint(requestUri)) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // Check rate limits
        if (isRateLimited(clientIp)) {
            log.warn("Rate limit exceeded for IP: {} - URI: {}", clientIp, requestUri);
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write(createRateLimitResponse());
            return;
        }
        
        filterChain.doFilter(request, response);
    }
    
    private boolean isRateLimited(String clientIp) {
        String minuteKey = RATE_LIMIT_PREFIX + clientIp + ":minute";
        String hourKey = RATE_LIMIT_PREFIX + clientIp + ":hour";
        
        // Check minute limit
        Long minuteCount = cacheService.getCachedClickCount(minuteKey).orElse(0L);
        if (minuteCount >= rateLimitConfig.getMaxRequestsPerMinute()) {
            log.debug("Minute rate limit exceeded for IP: {} - Count: {}", clientIp, minuteCount);
            return true;
        }
        
        // Check hour limit
        Long hourCount = cacheService.getCachedClickCount(hourKey).orElse(0L);
        if (hourCount >= rateLimitConfig.getMaxRequestsPerHour()) {
            log.debug("Hour rate limit exceeded for IP: {} - Count: {}", clientIp, hourCount);
            return true;
        }
        
        // Increment counters
        cacheService.incrementClickCount(minuteKey);
        cacheService.incrementClickCount(hourKey);
        
        // Set TTL for counters
        cacheService.setClickCount(minuteKey, minuteCount + 1);
        cacheService.setClickCount(hourKey, hourCount + 1);
        
        return false;
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
    
    private boolean isExemptEndpoint(String requestUri) {
        return requestUri.contains("/health") || 
               requestUri.contains("/actuator") ||
               requestUri.contains("/cache/health");
    }
    
    private String createRateLimitResponse() {
        return String.format("""
            {
                "status": 429,
                "message": "Too Many Requests",
                "error": "Rate limit exceeded",
                "timestamp": "%s",
                "retryAfter": 60
            }
            """, LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
    }
}
