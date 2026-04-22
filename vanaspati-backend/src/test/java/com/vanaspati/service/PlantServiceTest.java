package com.vanaspati.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.vanaspati.dto.request.PlantUpsertRequest;
import com.vanaspati.dto.response.BulkImportResultDTO;
import com.vanaspati.dto.response.PlantDetailDTO;
import com.vanaspati.exception.DuplicateResourceException;
import com.vanaspati.mapper.PlantMapper;
import com.vanaspati.model.Plant;
import com.vanaspati.repository.PlantRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PlantServiceTest {

    @Mock
    private PlantRepository plantRepository;

    @Mock
    private PlantMapper plantMapper;

    @InjectMocks
    private PlantService plantService;

    @Test
    void createPlant_whenScientificNameExists_throwsDuplicate() {
        PlantUpsertRequest request = new PlantUpsertRequest();
        request.setCommonName("Tulsi");
        request.setScientificName("Ocimum tenuiflorum");

        when(plantRepository.existsByScientificNameIgnoreCase("Ocimum tenuiflorum")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> plantService.createPlant(request));
        verify(plantRepository, never()).save(any(Plant.class));
    }

    @Test
    void bulkImportPlants_mixesCreateUpdateAndFail() {
        PlantUpsertRequest createRequest = new PlantUpsertRequest();
        createRequest.setCommonName("Tulsi");
        createRequest.setScientificName("Ocimum tenuiflorum");

        PlantUpsertRequest updateRequest = new PlantUpsertRequest();
        updateRequest.setCommonName("Neem");
        updateRequest.setScientificName("Azadirachta indica");

        PlantUpsertRequest invalidRequest = new PlantUpsertRequest();
        invalidRequest.setCommonName(" ");
        invalidRequest.setScientificName("Invalid scientific");

        Plant existing = Plant.builder().id(5L).commonName("Neem").scientificName("Azadirachta indica").build();

        when(plantRepository.findByScientificNameIgnoreCase("Ocimum tenuiflorum")).thenReturn(Optional.empty());
        when(plantRepository.findByScientificNameIgnoreCase("Azadirachta indica")).thenReturn(Optional.of(existing));
        when(plantRepository.save(any(Plant.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BulkImportResultDTO result = plantService.bulkImportPlants(List.of(createRequest, updateRequest, invalidRequest));

        assertEquals(3, result.getTotal());
        assertEquals(1, result.getCreated());
        assertEquals(1, result.getUpdated());
        assertEquals(1, result.getFailed());
        assertEquals(1, result.getErrors().size());
    }

    @Test
    void trackView_incrementsViewCount() {
        Plant plant = Plant.builder().id(9L).commonName("Amla").viewCount(4).build();
        when(plantRepository.findById(9L)).thenReturn(Optional.of(plant));

        plantService.trackView(9L);

        assertEquals(5, plant.getViewCount());
    }

    @Test
    void getHerbOfDay_whenNoPlants_throws() {
        when(plantRepository.findAll()).thenReturn(List.of());

        assertThrows(IllegalArgumentException.class, () -> plantService.getHerbOfDay());
    }

    @Test
    void createPlant_successMapsAndReturnsDto() {
        PlantUpsertRequest request = new PlantUpsertRequest();
        request.setCommonName("Brahmi");
        request.setScientificName("Bacopa monnieri");

        PlantDetailDTO dto = new PlantDetailDTO();
        dto.setCommonName("Brahmi");

        when(plantRepository.existsByScientificNameIgnoreCase(anyString())).thenReturn(false);
        when(plantRepository.save(any(Plant.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(plantMapper.toDetailDto(any(Plant.class))).thenReturn(dto);

        PlantDetailDTO result = plantService.createPlant(request);

        assertEquals("Brahmi", result.getCommonName());
    }
}
