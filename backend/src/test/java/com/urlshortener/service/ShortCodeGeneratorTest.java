package com.urlshortener.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

public class ShortCodeGeneratorTest {

    private ShortCodeGenerator shortCodeGenerator;

    @BeforeEach
    void setUp() {
        shortCodeGenerator = new ShortCodeGenerator();
    }

    @Test
    void shouldGenerateRandomShortCodeOfDefaultLength() {
        // When
        String shortCode = shortCodeGenerator.generateRandomShortCode();

        // Then
        assertThat(shortCode).hasSize(6);
        assertThat(shortCode).matches("[a-zA-Z0-9]+");
    }

    @Test
    void shouldGenerateRandomShortCodeOfSpecifiedLength() {
        // When
        String shortCode = shortCodeGenerator.generateRandomShortCode(8);

        // Then
        assertThat(shortCode).hasSize(8);
        assertThat(shortCode).matches("[a-zA-Z0-9]+");
    }

    @Test
    void shouldGenerateSequentialShortCode() {
        // When
        String shortCode1 = shortCodeGenerator.generateSequentialShortCode();
        String shortCode2 = shortCodeGenerator.generateSequentialShortCode();

        // Then
        assertThat(shortCode1).isNotEqualTo(shortCode2);
        assertThat(shortCode1).matches("[a-zA-Z0-9]+");
        assertThat(shortCode2).matches("[a-zA-Z0-9]+");
    }

    @Test
    void shouldEncodeToBase62() {
        // Given
        long number = 12345L;

        // When
        String encoded = shortCodeGenerator.encodeToBase62(number);

        // Then
        assertThat(encoded).isNotNull();
        assertThat(encoded).matches("[a-zA-Z0-9]+");
    }

    @Test
    void shouldDecodeFromBase62() {
        // Given
        String shortCode = "abc123";

        // When
        long decoded = shortCodeGenerator.decodeFromBase62(shortCode);

        // Then
        assertThat(decoded).isPositive();
    }

    @Test
    void shouldEncodeAndDecodeConsistently() {
        // Given
        long originalNumber = 987654321L;

        // When
        String encoded = shortCodeGenerator.encodeToBase62(originalNumber);
        long decoded = shortCodeGenerator.decodeFromBase62(encoded);

        // Then
        assertThat(decoded).isEqualTo(originalNumber);
    }

    @Test
    void shouldValidateShortCode() {
        // Given
        String validCode = "abc123";
        String invalidCode = "abc@123";
        String wrongLength = "123";
        String nullCode = null;

        // When & Then
        assertThat(shortCodeGenerator.isValidShortCode(validCode)).isTrue();
        assertThat(shortCodeGenerator.isValidShortCode(invalidCode)).isFalse();
        assertThat(shortCodeGenerator.isValidShortCode(wrongLength)).isFalse();
        assertThat(shortCodeGenerator.isValidShortCode(nullCode)).isFalse();
    }

    @Test
    void shouldThrowExceptionForNegativeNumber() {
        // When & Then
        assertThatThrownBy(() -> shortCodeGenerator.encodeToBase62(-1L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("non-negative");
    }

    @Test
    void shouldThrowExceptionForInvalidCharacterInDecode() {
        // When & Then
        assertThatThrownBy(() -> shortCodeGenerator.decodeFromBase62("abc@123"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid character");
    }

    @Test
    void shouldGenerateDifferentCodesOnMultipleCalls() {
        // When
        String code1 = shortCodeGenerator.generateRandomShortCode();
        String code2 = shortCodeGenerator.generateRandomShortCode();
        String code3 = shortCodeGenerator.generateRandomShortCode();

        // Then
        assertThat(code1).isNotEqualTo(code2);
        assertThat(code2).isNotEqualTo(code3);
        assertThat(code1).isNotEqualTo(code3);
    }

    @Test
    void shouldHandleZeroInEncoding() {
        // Given
        long zero = 0L;

        // When
        String encoded = shortCodeGenerator.encodeToBase62(zero);

        // Then
        assertThat(encoded).isNotNull();
        assertThat(encoded).hasSize(6); // Should be padded
    }

    @Test
    void shouldHandleLargeNumbers() {
        // Given
        long largeNumber = Long.MAX_VALUE;

        // When
        String encoded = shortCodeGenerator.encodeToBase62(largeNumber);
        long decoded = shortCodeGenerator.decodeFromBase62(encoded);

        // Then
        assertThat(decoded).isEqualTo(largeNumber);
    }

    @Test
    void shouldThrowExceptionForZeroLength() {
        // When & Then
        assertThatThrownBy(() -> shortCodeGenerator.generateRandomShortCode(0))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("positive");
    }

    @Test
    void shouldThrowExceptionForNegativeLength() {
        // When & Then
        assertThatThrownBy(() -> shortCodeGenerator.generateRandomShortCode(-5))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("positive");
    }
}
