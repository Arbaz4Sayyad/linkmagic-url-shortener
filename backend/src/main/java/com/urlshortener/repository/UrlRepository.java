package com.urlshortener.repository;

import com.urlshortener.entity.Url;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UrlRepository extends JpaRepository<Url, Long> {

    Optional<Url> findByShortCode(String shortCode);
    
    Optional<Url> findByCustomSlug(String customSlug);

    Optional<Url> findByShortCodeAndIsActiveTrue(String shortCode);
    
    Optional<Url> findByCustomSlugAndIsActiveTrue(String customSlug);

    Optional<Url> findByOriginalUrlAndIsActiveTrue(String originalUrl);

    List<Url> findByUserIdOrderByCreatedAtDesc(Long userId);

    long countByIsActiveTrue();

    List<Url> findByIsActiveTrueAndExpiryDateBefore(LocalDateTime now);

    @Modifying
    @Query("UPDATE Url u SET u.clickCount = u.clickCount + 1, u.lastAccessedAt = :now WHERE u.id = :id")
    void incrementClickCount(@Param("id") Long id, @Param("now") LocalDateTime now);

    @Modifying
    @Query("UPDATE Url u SET u.isActive = :active WHERE u.id IN :ids")
    void deactivateUrlsByIds(@Param("ids") List<Long> ids, @Param("active") boolean active);
}
