package com.urlshortener.repository;

import com.urlshortener.entity.Click;
import com.urlshortener.entity.Url;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ClickRepository extends MongoRepository<Click, String>, ClickRepositoryCustom {

    List<Click> findByUrl(Url url);

    long countByUrlAndCreatedAtAfter(Url url, LocalDateTime startDate);
}
