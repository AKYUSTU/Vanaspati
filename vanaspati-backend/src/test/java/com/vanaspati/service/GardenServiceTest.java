package com.vanaspati.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.vanaspati.dto.request.GardenZoneUpsertRequest;
import com.vanaspati.dto.response.GardenZoneDTO;
import com.vanaspati.dto.response.GardenZonePlantsDTO;
import com.vanaspati.dto.response.PlantSummaryDTO;
import com.vanaspati.exception.DuplicateResourceException;
import com.vanaspati.exception.ResourceNotFoundException;
import com.vanaspati.mapper.PlantMapper;
import com.vanaspati.model.AyushSystem;
import com.vanaspati.model.GardenZone;
import com.vanaspati.model.Plant;
import com.vanaspati.model.PlantGardenZone;
import com.vanaspati.model.User;
import com.vanaspati.model.enums.AyushSystemName;
import com.vanaspati.model.enums.PlantType;
import com.vanaspati.repository.GardenZoneRepository;
import com.vanaspati.repository.PlantGardenZoneRepository;
import com.vanaspati.repository.PlantRepository;
import com.vanaspati.repository.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class GardenServiceTest {

    @Mock
    private GardenZoneRepository gardenZoneRepository;

    @Mock
    private PlantGardenZoneRepository plantGardenZoneRepository;

    @Mock
    private PlantRepository plantRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PlantMapper plantMapper;

    @InjectMocks
    private GardenService gardenService;

    private User user;
    private GardenZone ownedZone;
    private Plant plant;

    @BeforeEach
    void setUp() {
        user = User.builder().id(7L).email("user@example.com").name("User").build();
        ownedZone = GardenZone.builder()
            .id(3L)
            .zoneName("My Herb Corner")
            .zoneKey("my-herb-corner-u7-123")
            .description("Custom zone")
            .colorHex("#4A8C5C")
            .iconEmoji("ZG")
            .user(user)
            .ayushSystem(AyushSystem.builder().name(AyushSystemName.AYURVEDA).build())
            .build();
        plant = Plant.builder()
            .id(9L)
            .commonName("Moringa")
            .scientificName("Moringa oleifera")
            .plantType(PlantType.TREE)
            .mainImageUrl("/moringa.jpg")
            .nativeLat(BigDecimal.valueOf(12.97))
            .nativeLng(BigDecimal.valueOf(77.59))
            .build();
    }

    @Test
    void createZone_createsUserOwnedZone() {
        GardenZoneUpsertRequest request = GardenZoneUpsertRequest.builder()
            .zoneName("My Herb Corner")
            .description("Custom zone")
            .colorHex("#4A8C5C")
            .iconEmoji("ZG")
            .build();

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(gardenZoneRepository.save(any(GardenZone.class))).thenAnswer(invocation -> {
            GardenZone zone = invocation.getArgument(0);
            zone.setId(11L);
            return zone;
        });
        when(plantGardenZoneRepository.countByZone_Id(11L)).thenReturn(0);

        GardenZoneDTO result = gardenService.createZone("user@example.com", request);

        assertEquals(11L, result.getId());
        assertEquals("My Herb Corner", result.getZoneName());
        assertTrue(result.isUserOwned());
        assertNotNull(result.getZoneKey());
        assertTrue(result.getZoneKey().startsWith("my-herb-corner-u7-"));
    }

    @Test
    void assignPlantToZone_duplicateAssignmentThrowsConflict() {
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(gardenZoneRepository.findByIdAndUser_Id(3L, 7L)).thenReturn(Optional.of(ownedZone));
        when(plantRepository.findById(9L)).thenReturn(Optional.of(plant));
        when(plantGardenZoneRepository.existsByPlant_IdAndZone_Id(9L, 3L)).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> gardenService.assignPlantToZone(3L, 9L, "user@example.com"));
        verify(plantGardenZoneRepository, never()).save(any(PlantGardenZone.class));
    }

    @Test
    void deleteZone_whenNotOwnedThrowsNotFound() {
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(gardenZoneRepository.findByIdAndUser_Id(99L, 7L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> gardenService.deleteZone(99L, "user@example.com"));
        verify(plantGardenZoneRepository, never()).deleteByZone_Id(eq(99L));
    }

    @Test
    void getZonePlants_mapsZoneAndPlants() {
        PlantGardenZone relation = PlantGardenZone.builder()
            .zone(ownedZone)
            .plant(plant)
            .build();
        PlantSummaryDTO summary = new PlantSummaryDTO();
        summary.setId(9L);
        summary.setCommonName("Moringa");
        summary.setScientificName("Moringa oleifera");
        summary.setMainImageUrl("/moringa.jpg");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(gardenZoneRepository.findByIdAndUser_Id(3L, 7L)).thenReturn(Optional.of(ownedZone));
        when(plantGardenZoneRepository.findByZone_Id(3L)).thenReturn(List.of(relation));
        when(plantMapper.toSummaryDto(plant)).thenReturn(summary);
        when(plantGardenZoneRepository.countByZone_Id(3L)).thenReturn(1);

        GardenZonePlantsDTO result = gardenService.getZonePlants(3L, "user@example.com");

        assertEquals(3L, result.getZone().getId());
        assertTrue(result.getZone().isUserOwned());
        assertEquals(1, result.getPlants().size());
        assertEquals("Moringa", result.getPlants().get(0).getCommonName());
    }
}
