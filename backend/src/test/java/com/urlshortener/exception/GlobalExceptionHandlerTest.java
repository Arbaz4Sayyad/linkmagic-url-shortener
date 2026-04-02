package com.urlshortener.exception;

import com.urlshortener.dto.ErrorResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.context.request.WebRequest;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler exceptionHandler;
    private WebRequest webRequest;

    @BeforeEach
    void setUp() {
        exceptionHandler = new GlobalExceptionHandler();
        webRequest = mock(WebRequest.class);
        when(webRequest.getDescription(false)).thenReturn("GET /api/v1/test");
    }

    @Test
    void shouldHandleUrlNotFoundException() {
        // Given
        UrlNotFoundException exception = new UrlNotFoundException("abc123");

        // When
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleUrlNotFoundException(exception, webRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo("404");
        assertThat(response.getBody().getMessage()).contains("abc123");
        assertThat(response.getBody().getError()).isEqualTo("URL Not Found");
    }

    @Test
    void shouldHandleUrlExpiredException() {
        // Given
        UrlExpiredException exception = new UrlExpiredException("abc123");

        // When
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleUrlExpiredException(exception, webRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.GONE);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo("410");
        assertThat(response.getBody().getMessage()).contains("abc123");
        assertThat(response.getBody().getError()).isEqualTo("URL Expired");
    }

    @Test
    void shouldHandleInvalidUrlException() {
        // Given
        InvalidUrlException exception = new InvalidUrlException("invalid-url");

        // When
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleInvalidUrlException(exception, webRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo("400");
        assertThat(response.getBody().getMessage()).contains("invalid-url");
        assertThat(response.getBody().getError()).isEqualTo("Invalid URL");
    }

    @Test
    void shouldHandleUrlShortenerException() {
        // Given
        UrlShortenerException exception = new UrlShortenerException("Custom error message");

        // When
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleUrlShortenerException(exception, webRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo("400");
        assertThat(response.getBody().getMessage()).isEqualTo("Custom error message");
        assertThat(response.getBody().getError()).isEqualTo("URL Shortener Error");
    }

    @Test
    void shouldHandleMethodArgumentNotValidException() {
        // Given
        MethodArgumentNotValidException exception = mock(MethodArgumentNotValidException.class);
        List<FieldError> fieldErrors = new ArrayList<>();
        fieldErrors.add(new FieldError("testObject", "originalUrl", "must not be blank"));
        fieldErrors.add(new FieldError("testObject", "expiryDate", "must be in the future"));
        
        BindingResult bindingResult = mock(BindingResult.class);
        when(bindingResult.getAllErrors()).thenReturn((List) fieldErrors);
        when(exception.getBindingResult()).thenReturn(bindingResult);

        // When
        ResponseEntity<Map<String, Object>> response = exceptionHandler.handleValidationExceptions(exception);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo(400);
        assertThat(response.getBody().get("message")).isEqualTo("Validation failed");
        
        @SuppressWarnings("unchecked")
        Map<String, String> errors = (Map<String, String>) response.getBody().get("errors");
        assertThat(errors).hasSize(2);
        assertThat(errors.get("originalUrl")).isEqualTo("must not be blank");
        assertThat(errors.get("expiryDate")).isEqualTo("must be in the future");
    }

    @Test
    void shouldHandleBindException() {
        // Given
        BindException exception = mock(BindException.class);
        List<FieldError> fieldErrors = new ArrayList<>();
        fieldErrors.add(new FieldError("testObject", "shortCode", "invalid format"));
        
        BindingResult bindingResult = mock(BindingResult.class);
        when(bindingResult.getAllErrors()).thenReturn((List) fieldErrors);
        when(exception.getBindingResult()).thenReturn(bindingResult);

        // When
        ResponseEntity<Map<String, Object>> response = exceptionHandler.handleBindException(exception);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().get("status")).isEqualTo(400);
        assertThat(response.getBody().get("message")).isEqualTo("Validation failed");
        
        @SuppressWarnings("unchecked")
        Map<String, String> errors = (Map<String, String>) response.getBody().get("errors");
        assertThat(errors).hasSize(1);
        assertThat(errors.get("shortCode")).isEqualTo("invalid format");
    }

    @Test
    void shouldHandleIllegalArgumentException() {
        // Given
        IllegalArgumentException exception = new IllegalArgumentException("Invalid argument provided");

        // When
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleIllegalArgumentException(exception, webRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo("400");
        assertThat(response.getBody().getMessage()).isEqualTo("Invalid argument provided");
        assertThat(response.getBody().getError()).isEqualTo("Invalid Argument");
    }

    @Test
    void shouldHandleGenericException() {
        // Given
        RuntimeException exception = new RuntimeException("Unexpected error");

        // When
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleGlobalException(exception, webRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo("500");
        assertThat(response.getBody().getMessage()).isEqualTo("An unexpected error occurred");
        assertThat(response.getBody().getError()).isEqualTo("Internal Server Error");
    }

    @Test
    void shouldHandleExceptionWithCause() {
        // Given
        Exception cause = new Exception("Root cause");
        UrlShortenerException exception = new UrlShortenerException("Wrapped error", cause);

        // When
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleUrlShortenerException(exception, webRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getMessage()).isEqualTo("Wrapped error");
    }

    @Test
    void shouldHandleEmptyValidationErrors() {
        // Given
        MethodArgumentNotValidException exception = mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);
        when(bindingResult.getAllErrors()).thenReturn(new ArrayList<>());
        when(exception.getBindingResult()).thenReturn(bindingResult);

        // When
        ResponseEntity<Map<String, Object>> response = exceptionHandler.handleValidationExceptions(exception);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        
        @SuppressWarnings("unchecked")
        Map<String, String> errors = (Map<String, String>) response.getBody().get("errors");
        assertThat(errors).isEmpty();
    }

    @Test
    void shouldIncludeTimestampInErrorResponse() {
        // Given
        UrlNotFoundException exception = new UrlNotFoundException("abc123");

        // When
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleUrlNotFoundException(exception, webRequest);

        // Then
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getTimestamp()).isNotNull();
    }

    @Test
    void shouldIncludePathInErrorResponse() {
        // Given
        UrlNotFoundException exception = new UrlNotFoundException("abc123");

        // When
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleUrlNotFoundException(exception, webRequest);

        // Then
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getPath()).isEqualTo("GET /api/v1/test");
    }
}
