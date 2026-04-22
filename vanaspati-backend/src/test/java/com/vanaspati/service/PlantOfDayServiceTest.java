package com.vanaspati.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import com.vanaspati.dto.response.PlantSummaryDTO;
import com.vanaspati.mapper.PlantMapper;
import com.vanaspati.model.Plant;
import com.vanaspati.repository.PlantRepository;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PlantOfDayServiceTest {

    @Mock
    private PlantRepository plantRepository;

    @Mock
    private PlantMapper plantMapper;

    @InjectMocks
    private PlantOfDayService plantOfDayService;

    @Test
    void getHerbOfDay_whenNoPlants_throwsException() {
        when(plantRepository.findAll()).thenReturn(List.of());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> plantOfDayService.getHerbOfDay());
        assertEquals("No plants available", ex.getMessage());
    }

    @Test
    void getHerbOfDay_returnsMappedPlantSummary() {
        Plant plant = Plant.builder().id(4L).commonName("Neem").scientificName("Azadirachta indica").build();
        PlantSummaryDTO summary = new PlantSummaryDTO();
        summary.setId(4L);
        summary.setCommonName("Neem");

        when(plantRepository.findAll()).thenReturn(List.of(plant));
        when(plantMapper.toSummaryDto(plant)).thenReturn(summary);

        PlantSummaryDTO result = plantOfDayService.getHerbOfDay();

        assertEquals(4L, result.getId());
        assertEquals("Neem", result.getCommonName());
    }
}
