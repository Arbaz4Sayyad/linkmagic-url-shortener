package com.urlshortener.service;

import com.urlshortener.dto.ApiKeyResponse;
import com.urlshortener.entity.ApiKey;
import com.urlshortener.entity.User;
import com.urlshortener.repository.ApiKeyRepository;
import com.urlshortener.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;
    private final UserRepository userRepository;

    private String hashKey(String plainKey) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(plainKey.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Could not hash API key", e);
        }
    }

    @Transactional
    public String generateApiKey(Long userId, String name) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate a plain API key: lm_ + UUID
        String plainKey = "lm_" + UUID.randomUUID().toString().replace("-", "");
        String keyHash = hashKey(plainKey);

        ApiKey apiKey = ApiKey.builder()
                .user(user)
                .name(name)
                .keyHash(keyHash)
                .isActive(true)
                .build();

        apiKeyRepository.save(apiKey);
        
        // We only show the plain key once!
        return plainKey;
    }

    @Transactional(readOnly = true)
    public List<ApiKeyResponse> getUserApiKeys(Long userId) {
        return apiKeyRepository.findByUserId(userId).stream()
                .map(key -> new ApiKeyResponse(
                        key.getId(),
                        key.getName(),
                        key.getCreatedAt(),
                        key.getExpiresAt(),
                        key.getIsActive(),
                        key.getLastUsedAt()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void revokeApiKey(Long userId, Long keyId) {
        ApiKey apiKey = apiKeyRepository.findById(keyId)
                .orElseThrow(() -> new RuntimeException("API Key not found"));

        if (!apiKey.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        apiKey.setIsActive(false);
        apiKeyRepository.save(apiKey);
    }

    @Transactional
    public Optional<User> validateApiKey(String plainKey) {
        String hash = hashKey(plainKey);
        Optional<ApiKey> apiKeyOpt = apiKeyRepository.findByKeyHash(hash);
        
        if (apiKeyOpt.isPresent()) {
            ApiKey apiKey = apiKeyOpt.get();
            if (apiKey.getIsActive() && (apiKey.getExpiresAt() == null || apiKey.getExpiresAt().isAfter(LocalDateTime.now()))) {
                apiKey.setLastUsedAt(LocalDateTime.now());
                apiKeyRepository.save(apiKey);
                return Optional.of(apiKey.getUser());
            }
        }
        return Optional.empty();
    }
}
