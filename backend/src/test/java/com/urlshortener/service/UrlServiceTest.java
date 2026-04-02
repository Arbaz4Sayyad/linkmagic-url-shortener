package com.urlshortener.service;

import com.urlshortener.entity.Url;
import com.urlshortener.repository.UrlRepository;
import com.urlshortener.util.UrlValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UrlServiceTest {

    @Mock
    private UrlRepository urlRepository;

    @Mock
    private ShortCodeGenerator shortCodeGenerator;

    @Mock
    private CacheService cacheService;

    @Mock
    private UrlValidator urlValidator;

    @InjectMocks
    private UrlService urlService;

    private String testUrl;
    private String testShortCode;
    private LocalDateTime testExpiryDate;

    @BeforeEach
    void setUp() {
        testUrl = "https://example.com";
        testShortCode = "abc123";
        testExpiryDate = LocalDateTime.now().plusDays(7);
    }

    @Test
    void shouldCreateShortUrlSuccessfully() {
        // Given
        when(shortCodeGenerator.generateRandomShortCode()).thenReturn(testShortCode);
        when(urlRepository.findByShortCode(testShortCode)).thenReturn(Optional.empty());
        when(urlRepository.findByCustomSlug(testShortCode)).thenReturn(Optional.empty());
        when(urlRepository.findByOriginalUrlAndIsActiveTrue(testUrl)).thenReturn(Optional.empty());
        when(urlRepository.save(any(Url.class))).thenReturn(createTestUrl());

        // When
        Url result = urlService.createShortUrl(testUrl, testExpiryDate, null, null);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getOriginalUrl()).isEqualTo(testUrl);
        assertThat(result.getShortCode()).isEqualTo(testShortCode);
        verify(urlValidator).validateUrl(testUrl);
        verify(cacheService).cacheUrl(testShortCode, testUrl);
    }

    @Test
    void shouldCreateUrlWithCustomSlugSuccessfully() {
        // Given
        String customSlug = "my-custom-link";
        when(urlRepository.findByCustomSlug(customSlug)).thenReturn(Optional.empty());
        when(urlRepository.findByShortCode(customSlug)).thenReturn(Optional.empty());
        
        Url customUrl = createTestUrl();
        customUrl.setShortCode(customSlug);
        customUrl.setCustomSlug(customSlug);
        when(urlRepository.save(any(Url.class))).thenReturn(customUrl);

        // When
        Url result = urlService.createShortUrl(testUrl, testExpiryDate, null, customSlug);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getShortCode()).isEqualTo(customSlug);
        assertThat(result.getCustomSlug()).isEqualTo(customSlug);
        verify(urlValidator).validateUrl(testUrl);
        verify(cacheService).cacheUrl(customSlug, testUrl);
    }

    @Test
    void shouldReturnExistingUrlIfAlreadyExistsAndValid() {
        // Given
        Url existingUrl = createTestUrl();
        when(urlRepository.findByOriginalUrlAndIsActiveTrue(testUrl)).thenReturn(Optional.of(existingUrl));

        // When
        Url result = urlService.createShortUrl(testUrl, testExpiryDate, null, null);

        // Then
        assertThat(result).isEqualTo(existingUrl);
        verify(urlRepository, never()).save(any(Url.class));
    }

    @Test
    void shouldRetryOnShortCodeCollision() {
        // Given
        when(shortCodeGenerator.generateRandomShortCode())
                .thenReturn("collision1")
                .thenReturn(testShortCode);
        when(urlRepository.findByShortCode("collision1")).thenReturn(Optional.of(new Url()));
        when(urlRepository.findByShortCode(testShortCode)).thenReturn(Optional.empty());
        when(urlRepository.findByCustomSlug(anyString())).thenReturn(Optional.empty());
        when(urlRepository.findByOriginalUrlAndIsActiveTrue(testUrl)).thenReturn(Optional.empty());
        when(urlRepository.save(any(Url.class))).thenReturn(createTestUrl());

        // When
        Url result = urlService.createShortUrl(testUrl, testExpiryDate, null, null);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getShortCode()).isEqualTo(testShortCode);
        verify(shortCodeGenerator, times(2)).generateRandomShortCode();
    }

    @Test
    void shouldGetOriginalUrlFromDatabaseWhenCacheMiss() {
        // Given
        Url url = createTestUrl();
        when(cacheService.getCachedUrl(testShortCode)).thenReturn(Optional.empty());
        when(urlRepository.findByShortCodeAndIsActiveTrue(testShortCode)).thenReturn(Optional.of(url));

        // When
        Optional<Url> result = urlService.getOriginalUrl(testShortCode);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getOriginalUrl()).isEqualTo(testUrl);
        verify(cacheService).cacheUrl(testShortCode, testUrl);
    }

    @Test
    void shouldIncrementClickCountSuccessfully() {
        // Given
        Url url = createTestUrl();
        when(urlRepository.findByShortCodeAndIsActiveTrue(testShortCode)).thenReturn(Optional.of(url));
        when(urlRepository.findById(url.getId())).thenReturn(Optional.of(url));

        // When
        Url result = urlService.incrementClickCount(testShortCode);

        // Then
        assertThat(result).isNotNull();
        verify(urlRepository).incrementClickCount(eq(url.getId()), any(LocalDateTime.class));
        verify(cacheService).setClickCount(testShortCode, url.getClickCount());
    }

    private Url createTestUrl() {
        return Url.builder()
                .id(1L)
                .originalUrl(testUrl)
                .shortCode(testShortCode)
                .expiryDate(testExpiryDate)
                .clickCount(0L)
                .isActive(true)
                .build();
    }
}
