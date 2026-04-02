package com.urlshortener.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.urlshortener.config.RateLimitConfig;
import com.urlshortener.dto.UrlRequest;
import com.urlshortener.entity.Url;
import com.urlshortener.security.AuthEntryPointJwt;
import com.urlshortener.security.JwtUtils;
import com.urlshortener.security.UserDetailsServiceImpl;
import com.urlshortener.service.ApiKeyService;
import com.urlshortener.service.CacheService;
import com.urlshortener.service.UrlService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UrlController.class)
@AutoConfigureMockMvc(addFilters = false) // Disable security filters for simplicity
class UrlControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UrlService urlService;

    @MockBean
    private CacheService cacheService; // Required by RateLimitFilter

    @MockBean
    private RateLimitConfig rateLimitConfig; // Required by RateLimitFilter

    @MockBean
    private JwtUtils jwtUtils;

    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @MockBean
    private AuthEntryPointJwt authEntryPointJwt;

    @MockBean
    private ApiKeyService apiKeyService;

    @Autowired
    private ObjectMapper objectMapper;

    private Url testUrl;

    @BeforeEach
    void setUp() {
        testUrl = Url.builder()
                .id(1L)
                .shortCode("abc12")
                .originalUrl("https://google.com")
                .isActive(true)
                .clickCount(0L)
                .build();
    }

    @Test
    @WithMockUser
    void createShortUrl_ShouldReturnCreated() throws Exception {
        UrlRequest request = new UrlRequest();
        request.setOriginalUrl("https://google.com");

        when(urlService.createShortUrl(anyString(), any(), any(), any())).thenReturn(testUrl);

        mockMvc.perform(post("/api/v1/shorten")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.shortCode").value("abc12"))
                .andExpect(jsonPath("$.originalUrl").value("https://google.com"));
    }

    @Test
    void redirectToOriginalUrl_ShouldRedirect() throws Exception {
        when(urlService.getOriginalUrl("abc12")).thenReturn(Optional.of(testUrl));

        mockMvc.perform(get("/api/v1/abc12"))
                .andExpect(status().isFound())
                .andExpect(redirectedUrl("https://google.com"));
    }

    @Test
    void redirectToOriginalUrl_ShouldReturnNotFound() throws Exception {
        when(urlService.getOriginalUrl("unknown")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/unknown"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getUrlInfo_ShouldReturnInfo() throws Exception {
        when(urlService.getUrlByShortCode("abc12")).thenReturn(Optional.of(testUrl));

        mockMvc.perform(get("/api/v1/info/abc12"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.shortCode").value("abc12"));
    }

    @Test
    void healthCheck_ShouldReturnOk() throws Exception {
        when(urlService.getActiveUrlCount()).thenReturn(5L);

        mockMvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.activeUrls").value(5));
    }
}
