package com.urlshortener.repository;

import com.urlshortener.entity.Url;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UrlRepository extends MongoRepository<Url, String>, UrlRepositoryCustom {

    Optional<Url> findByShortCode(String shortCode);
    
    Optional<Url> findByCustomSlug(String customSlug);

    Optional<Url> findByShortCodeAndIsActiveTrue(String shortCode);
    
    Optional<Url> findByCustomSlugAndIsActiveTrue(String customSlug);

    Optional<Url> findByOriginalUrlAndIsActiveTrue(String originalUrl);

    List<Url> findByUserIdOrderByCreatedAtDesc(String userId);

    long countByIsActiveTrue();

    List<Url> findByIsActiveTrueAndExpiryDateBefore(LocalDateTime now);
}
