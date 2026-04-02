package com.urlshortener.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class ErrorResponse {
    
    private String status;
    private String message;
    private String error;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
    private String path;
    
    public ErrorResponse(String status, String message, String error, String path) {
        this.status = status;
        this.message = message;
        this.error = error;
        this.timestamp = LocalDateTime.now();
        this.path = path;
    }
}
