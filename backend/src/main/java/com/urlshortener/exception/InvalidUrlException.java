package com.urlshortener.exception;

public class InvalidUrlException extends UrlShortenerException {
    
    public InvalidUrlException(String url) {
        super("Invalid URL format: " + url);
    }
    
    public InvalidUrlException(String message, Throwable cause) {
        super(message, cause);
    }
}
