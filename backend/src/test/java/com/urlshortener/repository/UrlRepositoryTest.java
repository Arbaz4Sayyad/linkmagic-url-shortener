package com.urlshortener.repository;

import com.urlshortener.entity.Url;
import com.urlshortener.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class UrlRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UrlRepository urlRepository;

    private User testUser;
    private Url testUrl;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("password")
                .build();
        entityManager.persist(testUser);

        testUrl = Url.builder()
                .shortCode("abc12")
                .originalUrl("https://example.com")
                .isActive(true)
                .clickCount(0L)
                .user(testUser)
                .build();
        entityManager.persist(testUrl);
        entityManager.flush();
    }

    @Test
    void findByShortCode_ShouldReturnUrl() {
        Optional<Url> found = urlRepository.findByShortCode("abc12");
        assertThat(found).isPresent();
        assertThat(found.get().getOriginalUrl()).isEqualTo("https://example.com");
    }

    @Test
    void findByCustomSlug_ShouldReturnUrl() {
        testUrl.setCustomSlug("custom-slug");
        entityManager.persist(testUrl);
        entityManager.flush();

        Optional<Url> found = urlRepository.findByCustomSlug("custom-slug");
        assertThat(found).isPresent();
    }

    @Test
    void findByUserId_ShouldReturnUrls() {
        List<Url> urls = urlRepository.findByUserIdOrderByCreatedAtDesc(testUser.getId());
        assertThat(urls).hasSize(1);
        assertThat(urls.get(0).getShortCode()).isEqualTo("abc12");
    }

    @Test
    void countActiveUrls_ShouldReturnCount() {
        long count = urlRepository.countByIsActiveTrue();
        assertThat(count).isEqualTo(1L);
    }

    @Test
    void findExpiredUrls_ShouldReturnExpired() {
        Url expiredUrl = Url.builder()
                .shortCode("exp12")
                .originalUrl("https://expired.com")
                .isActive(true)
                .expiryDate(LocalDateTime.now().plusDays(1))
                .clickCount(0L)
                .build();
        entityManager.persist(expiredUrl);
        entityManager.flush();

        List<Url> expired = urlRepository.findByIsActiveTrueAndExpiryDateBefore(LocalDateTime.now().plusDays(2));
        assertThat(expired).hasSize(1);
        assertThat(expired.get(0).getShortCode()).isEqualTo("exp12");
    }

    @Test
    void incrementClickCount_ShouldUpdateClicks() {
        urlRepository.incrementClickCount(testUrl.getId(), LocalDateTime.now());
        entityManager.clear();

        Url updated = urlRepository.findById(testUrl.getId()).orElseThrow();
        assertThat(updated.getClickCount()).isEqualTo(1L);
    }
}
