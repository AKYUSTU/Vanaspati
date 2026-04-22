package com.vanaspati.service;

import com.vanaspati.dto.response.PlantSummaryDTO;
import com.vanaspati.mapper.PlantMapper;
import com.vanaspati.model.Plant;
import com.vanaspati.repository.PlantRepository;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PlantOfDayService {

    private final PlantRepository plantRepository;
    private final PlantMapper plantMapper;

    @Cacheable(value = "herb-of-day", key = "'daily'")
    public PlantSummaryDTO getHerbOfDay() {
        List<Plant> plants = plantRepository.findAll();
        if (plants.isEmpty()) {
            throw new IllegalArgumentException("No plants available");
        }
        long epochDay = LocalDate.now().toEpochDay();
        java.util.Random random = new java.util.Random(epochDay);
        int randomIndex = random.nextInt(plants.size());
        return plantMapper.toSummaryDto(plants.get(randomIndex));
    }

    @Scheduled(cron = "0 0 0 * * *")
    @CacheEvict(value = "herb-of-day", allEntries = true)
    public void evictDailyHerbCache() {
    }
}
