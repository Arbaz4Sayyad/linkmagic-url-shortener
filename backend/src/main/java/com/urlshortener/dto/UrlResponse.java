package com.urlshortener.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class UrlResponse {
    
    private Long id;
    private String originalUrl;
    private String shortCode;
    private String shortUrl;
    private LocalDateTime createdAt;
    private LocalDateTime expiryDate;
    private Long clickCount;
    private Boolean isActive;
    
    public static UrlResponse fromEntity(String baseUrl, com.urlshortener.entity.Url url) {
        return UrlResponse.builder()
                .id(url.getId())
                .originalUrl(url.getOriginalUrl())
                .shortCode(url.getShortCode())
                .shortUrl(baseUrl + "/" + url.getShortCode())
                .createdAt(url.getCreatedAt())
                .expiryDate(url.getExpiryDate())
                .clickCount(url.getClickCount())
                .isActive(url.getIsActive())
                .build();
    }
}
