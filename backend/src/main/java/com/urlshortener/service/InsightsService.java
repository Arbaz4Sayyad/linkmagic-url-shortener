package com.urlshortener.service;

import com.urlshortener.repository.ClickRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InsightsService {

    private final ClickRepository clickRepository;

    public List<String> getInsights(String shortCode) {
        List<String> insights = new ArrayList<>();
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneWeekAgo = now.minusDays(7);
        LocalDateTime twoWeeksAgo = now.minusDays(14);

        long currentWeekClicks = clickRepository.countByUrlShortCodeAndCreatedAtAfter(shortCode, oneWeekAgo);
        long lastWeekClicks = clickRepository.countByUrlShortCodeAndCreatedAtAfter(shortCode, twoWeeksAgo) - currentWeekClicks;

        // Peak Hour Insight
        List<Object[]> peakHours = clickRepository.findPeakHours(shortCode);
        if (!peakHours.isEmpty()) {
            int hour = (int) peakHours.get(0)[0];
            String amPm = hour >= 12 ? "PM" : "AM";
            int displayHour = hour > 12 ? hour - 12 : (hour == 0 ? 12 : hour);
            insights.add(String.format("Your link performs best at %d %s local time. ⏰", displayHour, amPm));
        }

        // Top Country Insight
        List<Object[]> countries = clickRepository.findTopCountries(shortCode);
        if (!countries.isEmpty()) {
            String country = (String) countries.get(0)[0];
            insights.add(String.format("Most of your audience is accessing from %s. 🌍", country));
        }

        // Device Distribution Insight
        List<Object[]> devices = clickRepository.findDeviceDistribution(shortCode);
        if (!devices.isEmpty()) {
            String topDevice = (String) devices.get(0)[0];
            insights.add(String.format("Users are primarily visiting via %s devices. 📱", topDevice.toLowerCase()));
        }

        // Growth Insight
        if (lastWeekClicks > 0) {
            double growth = ((double)(currentWeekClicks - lastWeekClicks) / lastWeekClicks) * 100;
            if (growth > 0) {
                insights.add(String.format("Engagement increased by %.1f%% this week compared to last! 🚀", growth));
            } else if (growth < 0) {
                insights.add(String.format("Traffic is down by %.1f%%. Try sharing your link on new platforms. 📉", Math.abs(growth)));
            }
        } else if (currentWeekClicks > 0) {
            insights.add("Your link is gaining fresh momentum this week! ✨");
        }

        if (insights.isEmpty()) {
            insights.add("Start sharing your link to unlock AI-powered insights! 🧙‍♂️");
        }

        return insights;
    }
}
