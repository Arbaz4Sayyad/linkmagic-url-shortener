package com.urlshortener.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")
public class HealthController {

    @Autowired
    private DataSource dataSource;

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("application", "URL Shortener Service");
        response.put("version", "1.0.0");
        
        // Database connectivity check
        try (Connection connection = dataSource.getConnection()) {
            response.put("database", "UP");
        } catch (Exception e) {
            response.put("database", "DOWN");
            response.put("database_error", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }
}
