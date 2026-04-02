package com.urlshortener.controller;

import com.urlshortener.dto.ApiKeyRequest;
import com.urlshortener.dto.ApiKeyResponse;
import com.urlshortener.security.UserDetailsImpl;
import com.urlshortener.service.ApiKeyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users/apikeys")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ApiKeyController {

    private final ApiKeyService apiKeyService;

    @PostMapping
    public ResponseEntity<Map<String, String>> generateApiKey(@Valid @RequestBody ApiKeyRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        
        String plainKey = apiKeyService.generateApiKey(userDetails.getId(), request.getName());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(Collections.singletonMap("apiKey", plainKey));
    }

    @GetMapping
    public ResponseEntity<List<ApiKeyResponse>> getApiKeys() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        
        return ResponseEntity.ok(apiKeyService.getUserApiKeys(userDetails.getId()));
    }

    @DeleteMapping("/{keyId}")
    public ResponseEntity<?> revokeApiKey(@PathVariable Long keyId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) auth.getPrincipal();
        
        try {
            apiKeyService.revokeApiKey(userDetails.getId(), keyId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Collections.singletonMap("error", e.getMessage()));
        }
    }
}
