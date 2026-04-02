package com.urlshortener.util;

import com.urlshortener.exception.InvalidUrlException;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.URISyntaxException;

@Component
public class UrlValidator {
    
    private static final String[] ALLOWED_SCHEMES = {"http", "https"};
    
    public void validateUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            throw new InvalidUrlException("URL cannot be null or empty");
        }
        
        try {
            URI uri = new URI(url.trim());
            
            // Check scheme
            String scheme = uri.getScheme();
            if (scheme == null) {
                throw new InvalidUrlException(url);
            }
            
            boolean validScheme = false;
            for (String allowedScheme : ALLOWED_SCHEMES) {
                if (allowedScheme.equalsIgnoreCase(scheme)) {
                    validScheme = true;
                    break;
                }
            }
            
            if (!validScheme) {
                throw new InvalidUrlException("Only HTTP and HTTPS URLs are allowed: " + url);
            }
            
            // Check host
            if (uri.getHost() == null || uri.getHost().trim().isEmpty()) {
                throw new InvalidUrlException("Invalid host in URL: " + url);
            }

            
        } catch (URISyntaxException e) {
            throw new InvalidUrlException("Invalid URL syntax: " + url);
        }
    }
    
    public boolean isValidUrl(String url) {
        try {
            validateUrl(url);
            return true;
        } catch (InvalidUrlException e) {
            return false;
        }
    }
}
