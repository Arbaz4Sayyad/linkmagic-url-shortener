package com.urlshortener.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulkShortenResponse {

    private List<Result> results;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Result {
        private String originalUrl;
        private String shortUrl;
        private String status; // "SUCCESS" or "FAILED"
        private String error;
    }
}
