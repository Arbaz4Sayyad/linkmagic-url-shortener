package com.urlshortener.repository;

import com.urlshortener.entity.Click;
import com.urlshortener.entity.Url;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Repository
@RequiredArgsConstructor
public class ClickRepositoryImpl implements ClickRepositoryCustom {

    private final MongoTemplate mongoTemplate;

    @Override
    public List<Object[]> findPeakHours(Url url) {
        if (url == null || url.getId() == null) return new ArrayList<>();

        Aggregation agg = newAggregation(
                match(Criteria.where("url.$id").is(new ObjectId(url.getId()))),
                project().and("createdAt").extractHour().as("hour"),
                group("hour").count().as("count"),
                sort(Sort.Direction.DESC, "count"),
                project("count").and("_id").as("hour")
        );

        return mongoTemplate.aggregate(agg, Click.class, ClickAggregationResult.class)
                .getMappedResults()
                .stream()
                .filter(r -> r.getHour() != null)
                .map(r -> new Object[]{r.getHour(), r.getCount()})
                .collect(Collectors.toList());
    }

    @Override
    public List<Object[]> findTopCountries(Url url) {
        if (url == null || url.getId() == null) return new ArrayList<>();

        Aggregation agg = newAggregation(
                match(Criteria.where("url.$id").is(new ObjectId(url.getId()))),
                group("country").count().as("count"),
                sort(Sort.Direction.DESC, "count"),
                project("count").and("_id").as("country")
        );

        return mongoTemplate.aggregate(agg, Click.class, ClickAggregationResult.class)
                .getMappedResults()
                .stream()
                .filter(r -> r.getCountry() != null)
                .map(r -> new Object[]{r.getCountry(), r.getCount()})
                .collect(Collectors.toList());
    }

    @Override
    public List<Object[]> findDeviceDistribution(Url url) {
        if (url == null) return new ArrayList<>();

        Aggregation agg = newAggregation(
                match(Criteria.where("url.$id").is(new ObjectId(url.getId()))),
                group("deviceType").count().as("count"),
                project("count").and("_id").as("device")
        );

        return mongoTemplate.aggregate(agg, Click.class, ClickAggregationResult.class)
                .getMappedResults()
                .stream()
                .map(r -> new Object[]{r.getDevice(), r.getCount()})
                .collect(Collectors.toList());
    }

    @Override
    public List<Object[]> findReferrerSources(Url url) {
        if (url == null) return new ArrayList<>();

        Aggregation agg = newAggregation(
                match(Criteria.where("url.$id").is(new ObjectId(url.getId()))),
                group("referrer").count().as("count"),
                sort(Sort.Direction.DESC, "count"),
                project("count").and("_id").as("referrer")
        );

        return mongoTemplate.aggregate(agg, Click.class, ClickAggregationResult.class)
                .getMappedResults()
                .stream()
                .map(r -> new Object[]{r.getReferrer(), r.getCount()})
                .collect(Collectors.toList());
    }

    @Override
    public List<Object[]> findClickTrend(Url url, LocalDateTime startDate) {
        if (url == null || url.getId() == null) return new ArrayList<>();

        Aggregation agg = newAggregation(
                match(Criteria.where("url.$id").is(new ObjectId(url.getId())).and("createdAt").gte(startDate)),
                project().and("createdAt").dateAsFormattedString("%Y-%m-%d").as("formattedDate"),
                group("formattedDate").count().as("count"),
                sort(Sort.Direction.ASC, "_id"),
                project("count").and("_id").as("date")
        );

        return mongoTemplate.aggregate(agg, Click.class, ClickAggregationResult.class)
                .getMappedResults()
                .stream()
                .filter(r -> r.getDate() != null)
                .map(r -> new Object[]{r.getDate(), r.getCount()})
                .collect(Collectors.toList());
    }

    // Inner class for aggregation results
    @lombok.Data
    private static class ClickAggregationResult {
        private Integer hour;
        private String country;
        private String device;
        private String referrer;
        private String date;
        private Long count;
    }
}
