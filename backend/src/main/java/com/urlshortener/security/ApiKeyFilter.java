package com.urlshortener.security;

import com.urlshortener.entity.User;
import com.urlshortener.service.ApiKeyService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class ApiKeyFilter extends OncePerRequestFilter {

    private final ApiKeyService apiKeyService;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        try {
            String apiKey = parseApiKey(request);
            if (apiKey != null) {
                // Ignore API key if we already have a JWT authenticated context
                if (SecurityContextHolder.getContext().getAuthentication() == null) {
                    Optional<User> userOpt = apiKeyService.validateApiKey(apiKey);
                    
                    if (userOpt.isPresent()) {
                        User user = userOpt.get();
                        UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsService.loadUserByUsername(user.getUsername());
                        
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        log.debug("Authenticated user {} via API key", user.getUsername());
                    } else {
                        log.warn("Invalid or expired API key provided");
                    }
                }
            }
        } catch (Exception e) {
            log.error("Cannot set user authentication via API key: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String parseApiKey(HttpServletRequest request) {
        String headerAuth = request.getHeader("X-API-KEY");

        if (StringUtils.hasText(headerAuth)) {
            return headerAuth;
        }

        return null;
    }
}
