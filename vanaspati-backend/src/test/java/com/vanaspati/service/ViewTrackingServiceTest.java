package com.vanaspati.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.vanaspati.model.Plant;
import com.vanaspati.model.PlantViewHistory;
import com.vanaspati.model.User;
import com.vanaspati.repository.PlantRepository;
import com.vanaspati.repository.PlantViewHistoryRepository;
import com.vanaspati.repository.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ViewTrackingServiceTest {

    @Mock
    private PlantRepository plantRepository;

    @Mock
    private PlantViewHistoryRepository plantViewHistoryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ViewTrackingService viewTrackingService;

    @Test
    void trackView_whenPlantMissing_throwsNotFound() {
        when(plantRepository.findById(77L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> viewTrackingService.trackView(77L, null));
        assertEquals("Plant not found: 77", ex.getMessage());
    }

    @Test
    void trackView_withKnownUser_updatesCountAndSavesHistory() {
        Plant plant = Plant.builder().id(5L).commonName("Tulsi").viewCount(2).build();
        User user = User.builder().id(9L).name("Asha").email("asha@example.com").passwordHash("x").build();

        when(plantRepository.findById(5L)).thenReturn(Optional.of(plant));
        when(userRepository.findById(9L)).thenReturn(Optional.of(user));

        viewTrackingService.trackView(5L, 9L);

        assertEquals(3, plant.getViewCount());
        ArgumentCaptor<PlantViewHistory> historyCaptor = ArgumentCaptor.forClass(PlantViewHistory.class);
        verify(plantViewHistoryRepository).save(historyCaptor.capture());
        assertEquals(plant, historyCaptor.getValue().getPlant());
        assertEquals(user, historyCaptor.getValue().getUser());
    }

    @Test
    void trackView_withUnknownOptionalUser_savesAnonymousHistory() {
        Plant plant = Plant.builder().id(6L).commonName("Neem").viewCount(null).build();

        when(plantRepository.findById(6L)).thenReturn(Optional.of(plant));
        when(userRepository.findById(123L)).thenReturn(Optional.empty());

        viewTrackingService.trackView(6L, 123L);

        assertEquals(1, plant.getViewCount());
        ArgumentCaptor<PlantViewHistory> historyCaptor = ArgumentCaptor.forClass(PlantViewHistory.class);
        verify(plantViewHistoryRepository).save(historyCaptor.capture());
        assertNull(historyCaptor.getValue().getUser());
    }
}
