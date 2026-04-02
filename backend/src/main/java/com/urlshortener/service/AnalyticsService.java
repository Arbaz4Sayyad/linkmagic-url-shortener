package com.urlshortener.service;

import com.urlshortener.entity.Click;
import com.urlshortener.entity.Url;
import com.urlshortener.repository.ClickRepository;
import com.urlshortener.repository.UrlRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.basjes.parse.useragent.UserAgent;
import nl.basjes.parse.useragent.UserAgentAnalyzer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {

    private final ClickRepository clickRepository;
    private final UrlRepository urlRepository;
    private final UserAgentAnalyzer uaa;
    private final RestTemplate restTemplate = new RestTemplate();

    @Transactional
    public void recordClick(String shortCode, HttpServletRequest request) {
        log.info("Recording detailed click for short code: {}", shortCode);
        
        Optional<Url> urlOpt = urlRepository.findByShortCode(shortCode)
                .or(() -> urlRepository.findByCustomSlug(shortCode));
        
        if (urlOpt.isEmpty()) return;
        Url url = urlOpt.get();

        String ip = getClientIp(request);
        String userAgentStr = request.getHeader("User-Agent");
        String referrer = request.getHeader("Referer");

        UserAgent agent = uaa.parse(userAgentStr);
        String deviceType = agent.getValue(UserAgent.DEVICE_CLASS);
        String browser = agent.getValue(UserAgent.AGENT_NAME);
        String os = agent.getValue(UserAgent.OPERATING_SYSTEM_NAME);

        // Simple geolocation (Mocked or basic API call)
        String country = "Unknown";
        String city = "Unknown";
        try {
            // Note: In production, use a reliable GeoIP database like MaxMind
            if (!ip.equals("127.0.0.1") && !ip.equals("0:0:0:0:0:0:0:1")) {
                Map<String, String> geo = restTemplate.getForObject("http://ip-api.com/json/" + ip, Map.class);
                if (geo != null && "success".equals(geo.get("status"))) {
                    country = geo.get("country");
                    city = geo.get("city");
                }
            }
        } catch (Exception e) {
            log.warn("Failed to resolve geolocation for IP: {}", ip);
        }

        Click click = Click.builder()
                .url(url)
                .ipAddress(ip)
                .country(country)
                .city(city)
                .deviceType(deviceType)
                .browser(browser)
                .operatingSystem(os)
                .referrer(referrer != null ? referrer : "Direct")
                .build();

        clickRepository.save(click);
        
        // Also update the legacy click_count on Url entity for backwards compatibility
        url.setClickCount(url.getClickCount() + 1);
        url.setLastAccessedAt(LocalDateTime.now());
        urlRepository.save(url);
    }

    public Map<String, Object> getAnalytics(String shortCode) {
        Map<String, Object> analytics = new HashMap<>();
        
        List<Object[]> peakHours = clickRepository.findPeakHours(shortCode);
        List<Object[]> countries = clickRepository.findTopCountries(shortCode);
        List<Object[]> devices = clickRepository.findDeviceDistribution(shortCode);
        List<Object[]> referrers = clickRepository.findReferrerSources(shortCode);
        List<Object[]> trend = clickRepository.findClickTrend(shortCode, LocalDateTime.now().minusDays(7));

        analytics.put("totalClicks", urlRepository.findByShortCode(shortCode).map(Url::getClickCount).orElse(0L));
        analytics.put("peakHour", peakHours.isEmpty() ? null : peakHours.get(0)[0]);
        analytics.put("topCountry", countries.isEmpty() ? "N/A" : countries.get(0)[0]);
        analytics.put("deviceDistribution", formatDistribution(devices));
        analytics.put("referrers", formatDistribution(referrers));
        analytics.put("trendData", formatTrend(trend));

        return analytics;
    }

    private List<Map<String, Object>> formatDistribution(List<Object[]> data) {
        return data.stream().map(obj -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", obj[0]);
            map.put("value", obj[1]);
            return map;
        }).collect(Collectors.toList());
    }

    private List<Map<String, Object>> formatTrend(List<Object[]> data) {
        return data.stream().map(obj -> {
            Map<String, Object> map = new HashMap<>();
            map.put("date", obj[0].toString());
            map.put("clicks", obj[1]);
            return map;
        }).collect(Collectors.toList());
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
