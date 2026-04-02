package com.urlshortener.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.concurrent.atomic.AtomicLong;

@Component
@Slf4j
public class ShortCodeGenerator {
    
    private static final String BASE62_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int DEFAULT_LENGTH = 6;
    private static final SecureRandom random = new SecureRandom();
    private final AtomicLong counter = new AtomicLong(1000);
    
    public String generateRandomShortCode(int length) {
        if (length <= 0) {
            throw new IllegalArgumentException("Length must be positive");
        }
        
        StringBuilder shortCode = new StringBuilder(length);
        
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(BASE62_CHARS.length());
            shortCode.append(BASE62_CHARS.charAt(index));
        }
        
        log.debug("Generated random short code: {}", shortCode);
        return shortCode.toString();
    }
    
    public String generateRandomShortCode() {
        return generateRandomShortCode(DEFAULT_LENGTH);
    }
    
    public String generateSequentialShortCode() {
        long id = counter.getAndIncrement();
        return encodeToBase62(id);
    }
    
    public String encodeToBase62(long number) {
        if (number < 0) {
            throw new IllegalArgumentException("Number must be non-negative");
        }
        
        StringBuilder encoded = new StringBuilder();
        
        while (number > 0) {
            encoded.append(BASE62_CHARS.charAt((int) (number % 62)));
            number /= 62;
        }
        
        // Pad with leading 'a' if too short
        while (encoded.length() < DEFAULT_LENGTH) {
            encoded.append('a');
        }
        
        return encoded.reverse().toString();
    }
    
    public long decodeFromBase62(String shortCode) {
        long decoded = 0;
        
        for (int i = 0; i < shortCode.length(); i++) {
            char c = shortCode.charAt(i);
            int value = BASE62_CHARS.indexOf(c);
            
            if (value == -1) {
                throw new IllegalArgumentException("Invalid character in short code: " + c);
            }
            
            decoded = decoded * 62 + value;
        }
        
        return decoded;
    }
    
    public boolean isValidShortCode(String shortCode) {
        if (shortCode == null || shortCode.length() != DEFAULT_LENGTH) {
            return false;
        }
        
        return shortCode.chars().allMatch(c -> BASE62_CHARS.indexOf(c) >= 0);
    }
}
