package com.vanaspati.service;

import com.vanaspati.model.Plant;
import com.vanaspati.model.PlantViewHistory;
import com.vanaspati.model.User;
import com.vanaspati.repository.PlantRepository;
import com.vanaspati.repository.PlantViewHistoryRepository;
import com.vanaspati.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ViewTrackingService {

    private final PlantRepository plantRepository;
    private final PlantViewHistoryRepository plantViewHistoryRepository;
    private final UserRepository userRepository;

    @Async
    @Transactional
    public void trackView(Long plantId, Long userId) {
        Plant plant = plantRepository.findById(plantId)
            .orElseThrow(() -> new IllegalArgumentException("Plant not found: " + plantId));
        plant.setViewCount((plant.getViewCount() == null ? 0 : plant.getViewCount()) + 1);

        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }

        PlantViewHistory history = PlantViewHistory.builder()
            .plant(plant)
            .user(user)
            .build();
        plantViewHistoryRepository.save(history);
    }
}
