package com.urlshortener.repository;

import com.urlshortener.entity.Url;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class UrlRepositoryImpl implements UrlRepositoryCustom {

    private final MongoTemplate mongoTemplate;

    @Override
    public void incrementClickCount(String id, LocalDateTime now) {
        Query query = new Query(Criteria.where("id").is(id));
        Update update = new Update()
                .inc("clickCount", 1)
                .set("lastAccessedAt", now);
        mongoTemplate.updateFirst(query, update, Url.class);
    }

    @Override
    public void deactivateUrlsByIds(List<String> ids, boolean active) {
        Query query = new Query(Criteria.where("id").in(ids));
        Update update = new Update().set("isActive", active);
        mongoTemplate.updateMulti(query, update, Url.class);
    }
}
