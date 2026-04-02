package com.urlshortener.exception;

public class UrlExpiredException extends UrlShortenerException {
    
    public UrlExpiredException(String shortCode) {
        super("URL has expired for short code: " + shortCode);
    }
    
    public UrlExpiredException(String message, Throwable cause) {
        super(message, cause);
    }
}
