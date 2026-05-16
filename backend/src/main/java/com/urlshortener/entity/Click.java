package com.urlshortener.entity;

import com.urlshortener.entity.base.BaseEntity;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "clicks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Click extends BaseEntity {

    @DBRef(lazy = true)
    @Indexed
    private Url url;

    private String ipAddress;

    @Indexed
    private String country;

    private String city;

    @Indexed
    private String deviceType;

    private String browser;

    private String operatingSystem;

    private String referrer;
}
