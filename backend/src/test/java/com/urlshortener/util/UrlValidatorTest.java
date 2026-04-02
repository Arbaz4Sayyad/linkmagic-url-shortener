package com.urlshortener.util;

import com.urlshortener.exception.InvalidUrlException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

public class UrlValidatorTest {

    private UrlValidator urlValidator;

    @BeforeEach
    void setUp() {
        urlValidator = new UrlValidator();
    }

    @Test
    void shouldValidateValidHttpUrl() {
        // Given
        String url = "http://example.com";

        // When & Then
        assertThatCode(() -> urlValidator.validateUrl(url))
                .doesNotThrowAnyException();
    }

    @Test
    void shouldValidateValidHttpsUrl() {
        // Given
        String url = "https://www.example.com/path?query=value";

        // When & Then
        assertThatCode(() -> urlValidator.validateUrl(url))
                .doesNotThrowAnyException();
    }

    @Test
    void shouldValidateUrlWithPort() {
        // Given
        String url = "https://localhost:8080/api/test";

        // When & Then
        assertThatCode(() -> urlValidator.validateUrl(url))
                .doesNotThrowAnyException();
    }

    @Test
    void shouldThrowExceptionForNullUrl() {
        // When & Then
        assertThatThrownBy(() -> urlValidator.validateUrl(null))
                .isInstanceOf(InvalidUrlException.class)
                .hasMessageContaining("cannot be null or empty");
    }

    @Test
    void shouldThrowExceptionForEmptyUrl() {
        // Given
        String url = "";

        // When & Then
        assertThatThrownBy(() -> urlValidator.validateUrl(url))
                .isInstanceOf(InvalidUrlException.class)
                .hasMessageContaining("cannot be null or empty");
    }

    @Test
    void shouldThrowExceptionForWhitespaceOnlyUrl() {
        // Given
        String url = "   ";

        // When & Then
        assertThatThrownBy(() -> urlValidator.validateUrl(url))
                .isInstanceOf(InvalidUrlException.class)
                .hasMessageContaining("cannot be null or empty");
    }

    @Test
    void shouldThrowExceptionForUrlWithoutScheme() {
        // Given
        String url = "www.example.com";

        // When & Then
        assertThatThrownBy(() -> urlValidator.validateUrl(url))
                .isInstanceOf(InvalidUrlException.class)
                .hasMessageContaining(url);
    }

    @Test
    void shouldThrowExceptionForFtpUrl() {
        // Given
        String url = "ftp://example.com";

        // When & Then
        assertThatThrownBy(() -> urlValidator.validateUrl(url))
                .isInstanceOf(InvalidUrlException.class)
                .hasMessageContaining("Only HTTP and HTTPS URLs are allowed");
    }

    @Test
    void shouldThrowExceptionForFileUrl() {
        // Given
        String url = "file:///path/to/file";

        // When & Then
        assertThatThrownBy(() -> urlValidator.validateUrl(url))
                .isInstanceOf(InvalidUrlException.class)
                .hasMessageContaining("Only HTTP and HTTPS URLs are allowed");
    }

    @Test
    void shouldThrowExceptionForUrlWithoutHost() {
        // Given
        String url = "http://";

        // When & Then
        assertThatThrownBy(() -> urlValidator.validateUrl(url))
                .isInstanceOf(InvalidUrlException.class)
                .hasMessageContaining("Invalid URL syntax");
    }

    @Test
    void shouldThrowExceptionForInvalidUrlSyntax() {
        // Given
        String url = "http://:invalid";

        // When & Then
        assertThatThrownBy(() -> urlValidator.validateUrl(url))
                .isInstanceOf(InvalidUrlException.class)
                .hasMessageContaining("Invalid host");
    }

    @Test
    void shouldValidateUrlWithTrailingWhitespace() {
        // Given
        String url = "https://example.com   ";

        // When & Then
        assertThatCode(() -> urlValidator.validateUrl(url))
                .doesNotThrowAnyException();
    }

    @Test
    void shouldValidateUrlWithLeadingWhitespace() {
        // Given
        String url = "   https://example.com";

        // When & Then
        assertThatCode(() -> urlValidator.validateUrl(url))
                .doesNotThrowAnyException();
    }

    @Test
    void shouldValidateUrlWithIPv4Address() {
        // Given
        String url = "http://192.168.1.1";

        // When & Then
        assertThatCode(() -> urlValidator.validateUrl(url))
                .doesNotThrowAnyException();
    }

    @Test
    void shouldValidateUrlWithIPv6Address() {
        // Given
        String url = "https://[2001:db8::1]";

        // When & Then
        assertThatCode(() -> urlValidator.validateUrl(url))
                .doesNotThrowAnyException();
    }

    @Test
    void shouldValidateUrlWithSubdomain() {
        // Given
        String url = "https://api.example.com/v1/users";

        // When & Then
        assertThatCode(() -> urlValidator.validateUrl(url))
                .doesNotThrowAnyException();
    }

    @Test
    void shouldValidateUrlWithFragment() {
        // Given
        String url = "https://example.com/page#section";

        // When & Then
        assertThatCode(() -> urlValidator.validateUrl(url))
                .doesNotThrowAnyException();
    }

    @Test
    void shouldValidateUrlWithAuthentication() {
        // Given
        String url = "https://user:pass@example.com";

        // When & Then
        assertThatCode(() -> urlValidator.validateUrl(url))
                .doesNotThrowAnyException();
    }

    @Test
    void shouldReturnTrueForValidUrl() {
        // Given
        String url = "https://example.com";

        // When
        boolean result = urlValidator.isValidUrl(url);

        // Then
        assertThat(result).isTrue();
    }

    @Test
    void shouldReturnFalseForInvalidUrl() {
        // Given
        String url = "invalid-url";

        // When
        boolean result = urlValidator.isValidUrl(url);

        // Then
        assertThat(result).isFalse();
    }

    @Test
    void shouldReturnFalseForNullUrl() {
        // When
        boolean result = urlValidator.isValidUrl(null);

        // Then
        assertThat(result).isFalse();
    }

    @Test
    void shouldValidateComplexUrl() {
        // Given
        String url = "https://api.example.com:8443/v1/users?id=123&name=test#profile";

        // When & Then
        assertThatCode(() -> urlValidator.validateUrl(url))
                .doesNotThrowAnyException();
    }

    @Test
    void shouldThrowExceptionForUrlWithOnlyScheme() {
        // Given
        String url = "https://";

        // When & Then
        assertThatThrownBy(() -> urlValidator.validateUrl(url))
                .isInstanceOf(InvalidUrlException.class)
                .hasMessageContaining("Invalid URL syntax");
    }
}
