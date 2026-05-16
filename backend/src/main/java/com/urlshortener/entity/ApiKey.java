package com.urlshortener.entity;

import com.urlshortener.entity.base.BaseEntity;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "api_keys")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ApiKey extends BaseEntity {

    @NotBlank
    @Indexed(unique = true)
    private String keyHash;

    @DBRef(lazy = true)
    @Indexed
    private User user;

    private String name;

    private LocalDateTime expiresAt;

    private Boolean isActive = true;

    private LocalDateTime lastUsedAt;
}
