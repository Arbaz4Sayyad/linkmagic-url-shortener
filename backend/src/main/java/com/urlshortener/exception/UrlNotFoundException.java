package com.urlshortener.exception;

public class UrlNotFoundException extends UrlShortenerException {
    
    public UrlNotFoundException(String shortCode) {
        super("URL not found for short code: " + shortCode);
    }
    
    public UrlNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
