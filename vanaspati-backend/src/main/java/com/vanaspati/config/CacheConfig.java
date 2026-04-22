package com.vanaspati.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import java.time.Duration;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager("herb-of-day");
        cacheManager.setCaffeine(
            Caffeine.newBuilder()
                .expireAfterWrite(Duration.ofHours(24))
                .maximumSize(100)
        );
        return cacheManager;
    }
}
