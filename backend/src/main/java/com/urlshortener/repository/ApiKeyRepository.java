package com.urlshortener.repository;

import com.urlshortener.entity.ApiKey;
import com.urlshortener.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApiKeyRepository extends MongoRepository<ApiKey, String> {

    Optional<ApiKey> findByKeyHash(String keyHash);

    List<ApiKey> findByUser(User user);
    
    List<ApiKey> findByUserId(String userId);
}
