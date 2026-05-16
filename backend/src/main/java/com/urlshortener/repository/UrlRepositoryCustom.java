package com.urlshortener.repository;

import java.time.LocalDateTime;
import java.util.List;

public interface UrlRepositoryCustom {
    void incrementClickCount(String id, LocalDateTime now);
    void deactivateUrlsByIds(List<String> ids, boolean active);
}
