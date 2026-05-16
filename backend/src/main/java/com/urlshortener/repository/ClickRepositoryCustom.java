package com.urlshortener.repository;

import java.time.LocalDateTime;
import java.util.List;

public interface ClickRepositoryCustom {
    List<Object[]> findPeakHours(com.urlshortener.entity.Url url);
    List<Object[]> findTopCountries(com.urlshortener.entity.Url url);
    List<Object[]> findDeviceDistribution(com.urlshortener.entity.Url url);
    List<Object[]> findReferrerSources(com.urlshortener.entity.Url url);
    List<Object[]> findClickTrend(com.urlshortener.entity.Url url, java.time.LocalDateTime startDate);
}
