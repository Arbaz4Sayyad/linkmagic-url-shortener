package com.urlshortener.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "rate-limit")
public class RateLimitConfig {
    
    private int maxRequestsPerMinute = 100;
    private int maxRequestsPerHour = 1000;
    private int maxRequestsPerDay = 10000;
    private boolean enabled = true;
    
    public int getMaxRequestsPerMinute() {
        return maxRequestsPerMinute;
    }
    
    public void setMaxRequestsPerMinute(int maxRequestsPerMinute) {
        this.maxRequestsPerMinute = maxRequestsPerMinute;
    }
    
    public int getMaxRequestsPerHour() {
        return maxRequestsPerHour;
    }
    
    public void setMaxRequestsPerHour(int maxRequestsPerHour) {
        this.maxRequestsPerHour = maxRequestsPerHour;
    }
    
    public int getMaxRequestsPerDay() {
        return maxRequestsPerDay;
    }
    
    public void setMaxRequestsPerDay(int maxRequestsPerDay) {
        this.maxRequestsPerDay = maxRequestsPerDay;
    }
    
    public boolean isEnabled() {
        return enabled;
    }
    
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
