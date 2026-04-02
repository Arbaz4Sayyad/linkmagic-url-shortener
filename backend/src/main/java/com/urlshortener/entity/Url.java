package com.urlshortener.entity;

import com.urlshortener.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table(name = "urls", indexes = {
    @Index(name = "idx_short_code", columnList = "short_code", unique = true),
    @Index(name = "idx_custom_slug", columnList = "custom_slug", unique = true),
    @Index(name = "idx_expiry_date", columnList = "expiry_date"),
    @Index(name = "idx_created_at", columnList = "created_at"),
    @Index(name = "idx_user_id", columnList = "user_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Url extends BaseEntity {
    
    @Column(name = "original_url", nullable = false, length = 2048)
    private String originalUrl;
    
    @Column(name = "short_code", nullable = false, length = 10, unique = true)
    private String shortCode;

    @Column(name = "custom_slug", length = 50, unique = true)
    private String customSlug;
    
    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;
    
    @Column(name = "click_count", nullable = false)
    @Builder.Default
    private Long clickCount = 0L;

    @Column(name = "last_accessed_at")
    private LocalDateTime lastAccessedAt;
    
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "url", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Click> clicks = new java.util.ArrayList<>();
}
