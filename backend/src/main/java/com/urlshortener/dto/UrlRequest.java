package com.urlshortener.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UrlRequest {
    
    @NotBlank(message = "Original URL is required")
    @Size(max = 2048, message = "URL must be less than 2048 characters")
    private String originalUrl;
    
    @Size(max = 50, message = "Custom slug must be less than 50 characters")
    private String customSlug;
    
    private LocalDateTime expiryDate;
}
