package com.urlshortener.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ApiKeyRequest {
    @NotBlank
    @Size(min = 1, max = 50)
    private String name;
}
