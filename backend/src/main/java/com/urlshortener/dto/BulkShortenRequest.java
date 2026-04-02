package com.urlshortener.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class BulkShortenRequest {

    @Valid
    @NotEmpty(message = "Requests list cannot be empty")
    @Size(max = 50, message = "Maximum 50 URLs can be shortened at once")
    private List<UrlRequest> requests;
}
