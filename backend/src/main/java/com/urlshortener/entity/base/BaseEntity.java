package com.urlshortener.entity.base;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import java.time.LocalDateTime;

import lombok.experimental.SuperBuilder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Getter
@Setter
public abstract class BaseEntity {
    
    @Id
    protected String id;
    
    @CreatedDate
    protected LocalDateTime createdAt;
    
    @LastModifiedDate
    protected LocalDateTime updatedAt;
}
