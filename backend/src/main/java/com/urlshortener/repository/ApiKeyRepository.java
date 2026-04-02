package com.urlshortener.repository;

import com.urlshortener.entity.ApiKey;
import com.urlshortener.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApiKeyRepository extends JpaRepository<ApiKey, Long> {

    Optional<ApiKey> findByKeyHash(String keyHash);

    List<ApiKey> findByUser(User user);
    
    List<ApiKey> findByUserId(Long userId);
}
