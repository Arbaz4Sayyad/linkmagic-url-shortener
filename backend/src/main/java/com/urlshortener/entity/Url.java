package com.urlshortener.entity;

import com.urlshortener.entity.base.BaseEntity;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "urls")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Url extends BaseEntity {
    
    private String originalUrl;
    
    @Indexed(unique = true)
    private String shortCode;

    @Indexed(unique = true, sparse = true)
    private String customSlug;
    
    @Indexed
    private LocalDateTime expiryDate;
    
    @Builder.Default
    private Long clickCount = 0L;

    private LocalDateTime lastAccessedAt;
    
    @Builder.Default
    private Boolean isActive = true;

    @DBRef(lazy = true)
    @Indexed
    private User user;
}
