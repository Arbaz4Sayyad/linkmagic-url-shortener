package com.urlshortener.security;

import com.urlshortener.entity.User;
import com.urlshortener.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    @Value("${urlshortener.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String provider = "google"; 

        if (oAuth2User.getAttributes().containsKey("login")) {
            // Github handles info differently. If email is private, it returns null.
            email = oAuth2User.getAttribute("email");
            if (email == null || email.isEmpty()) {
                // Fallback to username@github.com if email is private
                email = oAuth2User.getAttribute("login") + "@github.com";
            }
            name = oAuth2User.getAttribute("name") != null ? oAuth2User.getAttribute("name") : oAuth2User.getAttribute("login");
            provider = "github";
        }

        log.info("OAuth2 login completed for: {} | provider: {} | redirecting to: {}", email, provider, frontendUrl);

        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
        } else {
            user = User.builder()
                    .username(email.split("@")[0].toLowerCase() + "_" + UUID.randomUUID().toString().substring(0, 4))
                    .email(email)
                    .provider(provider)
                    .build();
            userRepository.save(user);
        }

        UserDetailsImpl userPrincipal = UserDetailsImpl.build(user);
        String token = jwtUtils.generateTokenFromUsername(userPrincipal.getUsername());

        String targetUrl = UriComponentsBuilder.fromUriString(frontendUrl + "/oauth2/redirect")
                .queryParam("token", token)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
