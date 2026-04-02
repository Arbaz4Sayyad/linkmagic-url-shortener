package com.urlshortener.controller;

import com.urlshortener.service.AnalyticsService;
import com.urlshortener.service.InsightsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final InsightsService insightsService;

    @GetMapping("/{shortCode}")
    public ResponseEntity<Map<String, Object>> getAnalytics(@PathVariable String shortCode) {
        log.info("Fetching detailed analytics for: {}", shortCode);
        return ResponseEntity.ok(analyticsService.getAnalytics(shortCode));
    }

    @GetMapping("/{shortCode}/insights")
    public ResponseEntity<Map<String, Object>> getInsights(@PathVariable String shortCode) {
        log.info("Fetching AI insights for: {}", shortCode);
        List<String> insightsList = insightsService.getInsights(shortCode);
        
        Map<String, Object> response = new HashMap<>();
        response.put("insights", insightsList);
        
        return ResponseEntity.ok(response);
    }
}
