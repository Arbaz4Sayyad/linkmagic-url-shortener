package com.urlshortener.entity;

import com.urlshortener.entity.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table(name = "clicks", indexes = {
    @Index(name = "idx_click_url_id", columnList = "url_id"),
    @Index(name = "idx_click_timestamp", columnList = "created_at"),
    @Index(name = "idx_click_country", columnList = "country"),
    @Index(name = "idx_click_device_type", columnList = "device_type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Click extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "url_id", nullable = false)
    private Url url;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "device_type", length = 50)
    private String deviceType;

    @Column(name = "browser", length = 100)
    private String browser;

    @Column(name = "operating_system", length = 100)
    private String operatingSystem;

    @Column(name = "referrer", length = 2048)
    private String referrer;
}
