package com.urlshortener.repository;

import com.urlshortener.entity.Url;
import com.urlshortener.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataMongoTest
class UrlRepositoryTest {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private UrlRepository urlRepository;

    private User testUser;
    private Url testUrl;

    @BeforeEach
    void setUp() {
        mongoTemplate.dropCollection(Url.class);
        mongoTemplate.dropCollection(User.class);

        testUser = User.builder()
                .username("testuser")
                .email("test@example.com")
                .password("password")
                .build();
        mongoTemplate.save(testUser);

        testUrl = Url.builder()
                .shortCode("abc12")
                .originalUrl("https://example.com")
                .isActive(true)
                .clickCount(0L)
                .user(testUser)
                .build();
        mongoTemplate.save(testUrl);
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
        mongoTemplate.save(testUrl);

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
                .expiryDate(LocalDateTime.now().minusDays(1))
                .clickCount(0L)
                .build();
        mongoTemplate.save(expiredUrl);

        List<Url> expired = urlRepository.findByIsActiveTrueAndExpiryDateBefore(LocalDateTime.now());
        assertThat(expired).hasSize(1);
        assertThat(expired.get(0).getShortCode()).isEqualTo("exp12");
    }

    @Test
    void incrementClickCount_ShouldUpdateClicks() {
        urlRepository.incrementClickCount(testUrl.getId(), LocalDateTime.now());

        Url updated = urlRepository.findById(testUrl.getId()).orElseThrow();
        assertThat(updated.getClickCount()).isEqualTo(1L);
    }
}
