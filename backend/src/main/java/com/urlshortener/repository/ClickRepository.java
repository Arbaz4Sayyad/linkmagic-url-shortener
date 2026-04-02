package com.urlshortener.repository;

import com.urlshortener.entity.Click;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface ClickRepository extends JpaRepository<Click, Long> {

    List<Click> findByUrlShortCode(String shortCode);

    @Query("SELECT HOUR(c.createdAt) as hour, COUNT(c) as count FROM Click c WHERE c.url.shortCode = :shortCode GROUP BY HOUR(c.createdAt) ORDER BY count DESC")
    List<Object[]> findPeakHours(@Param("shortCode") String shortCode);

    @Query("SELECT c.country as country, COUNT(c) as count FROM Click c WHERE c.url.shortCode = :shortCode GROUP BY c.country ORDER BY count DESC")
    List<Object[]> findTopCountries(@Param("shortCode") String shortCode);

    @Query("SELECT c.deviceType as device, COUNT(c) as count FROM Click c WHERE c.url.shortCode = :shortCode GROUP BY c.deviceType")
    List<Object[]> findDeviceDistribution(@Param("shortCode") String shortCode);

    @Query("SELECT c.referrer as referrer, COUNT(c) as count FROM Click c WHERE c.url.shortCode = :shortCode GROUP BY c.referrer ORDER BY count DESC")
    List<Object[]> findReferrerSources(@Param("shortCode") String shortCode);

    @Query("SELECT DATE(c.createdAt) as date, COUNT(c) as count FROM Click c WHERE c.url.shortCode = :shortCode AND c.createdAt >= :startDate GROUP BY DATE(c.createdAt) ORDER BY date ASC")
    List<Object[]> findClickTrend(@Param("shortCode") String shortCode, @Param("startDate") LocalDateTime startDate);

    long countByUrlShortCodeAndCreatedAtAfter(String shortCode, LocalDateTime startDate);
}
