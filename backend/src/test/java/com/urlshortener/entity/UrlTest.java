package com.urlshortener.entity;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class UrlTest {

    @Test
    void shouldCreateUrlWithBuilder() {
        // Given
        LocalDateTime now = LocalDateTime.now();

        // When
        Url url = Url.builder()
                .id(1L)
                .originalUrl("https://example.com")
                .shortCode("abc123")
                .createdAt(now)
                .expiryDate(now.plusDays(7))
                .clickCount(0L)
                .isActive(true)
                .build();

        // Then
        assertThat(url.getId()).isEqualTo(1L);
        assertThat(url.getOriginalUrl()).isEqualTo("https://example.com");
        assertThat(url.getShortCode()).isEqualTo("abc123");
        assertThat(url.getCreatedAt()).isEqualTo(now);
        assertThat(url.getExpiryDate()).isEqualTo(now.plusDays(7));
        assertThat(url.getClickCount()).isEqualTo(0L);
        assertThat(url.getIsActive()).isTrue();
    }

    @Test
    void shouldSupportLombokGettersAndSetters() {
        // Given
        Url url = new Url();

        // When
        url.setId(2L);
        url.setOriginalUrl("https://test.com");
        url.setShortCode("test123");
        url.setClickCount(10L);
        url.setIsActive(false);

        // Then
        assertThat(url.getId()).isEqualTo(2L);
        assertThat(url.getOriginalUrl()).isEqualTo("https://test.com");
        assertThat(url.getShortCode()).isEqualTo("test123");
        assertThat(url.getClickCount()).isEqualTo(10L);
        assertThat(url.getIsActive()).isFalse();
    }

    @Test
    void shouldHandleNullableFields() {
        // Given
        Url url = Url.builder()
                .id(1L)
                .originalUrl("https://example.com")
                .shortCode("abc123")
                .expiryDate(null)
                .lastAccessedAt(null)
                .build();

        // Then
        assertThat(url.getExpiryDate()).isNull();
        assertThat(url.getLastAccessedAt()).isNull();
    }

    @Test
    void shouldValidateUrlConstraints() {
        Url url = Url.builder()
                .originalUrl("https://example.com")
                .shortCode("abc123")
                .build();

        // Verify that required fields can be set
        assertThat(url.getOriginalUrl()).isNotNull();
        assertThat(url.getShortCode()).isNotNull();
        // default values
        assertThat(url.getIsActive()).isTrue();
        assertThat(url.getClickCount()).isEqualTo(0L);
    }
}
