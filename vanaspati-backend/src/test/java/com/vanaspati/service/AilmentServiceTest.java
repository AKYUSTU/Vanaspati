package com.vanaspati.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import com.vanaspati.dto.response.AilmentDetailDTO;
import com.vanaspati.dto.response.AilmentSummaryDTO;
import com.vanaspati.exception.ResourceNotFoundException;
import com.vanaspati.model.AilmentCategory;
import com.vanaspati.model.Plant;
import com.vanaspati.model.PlantAilment;
import com.vanaspati.model.Remedy;
import com.vanaspati.model.enums.RemedyDifficulty;
import com.vanaspati.repository.AilmentCategoryRepository;
import com.vanaspati.repository.PlantAilmentRepository;
import com.vanaspati.repository.RemedyRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AilmentServiceTest {

    @Mock
    private AilmentCategoryRepository ailmentCategoryRepository;

    @Mock
    private PlantAilmentRepository plantAilmentRepository;

    @Mock
    private RemedyRepository remedyRepository;

    @InjectMocks
    private AilmentService ailmentService;

    @Test
    void getAilments_includesCounts() {
        AilmentCategory ailment = AilmentCategory.builder()
            .id(1L)
            .name("Fever")
            .slug("fever")
            .bodyPart("HEAD")
            .description("Body heat")
            .build();

        when(ailmentCategoryRepository.findAll()).thenReturn(List.of(ailment));
        when(plantAilmentRepository.countByAilment_Id(1L)).thenReturn(3);
        when(remedyRepository.findByAilment_Id(1L)).thenReturn(List.of());

        List<AilmentSummaryDTO> result = ailmentService.getAilments();

        assertEquals(1, result.size());
        assertEquals("Fever", result.get(0).getName());
        assertEquals(3, result.get(0).getPlantCount());
    }

    @Test
    void getAilmentDetail_mapsPlantsAndRemedies() {
        AilmentCategory ailment = AilmentCategory.builder()
            .id(2L)
            .name("Digestion")
            .slug("digestion")
            .bodyPart("STOMACH")
            .description("Digestive support")
            .build();
        Plant plant = Plant.builder().id(9L).commonName("Amla").scientificName("Phyllanthus emblica").mainImageUrl("/amla.jpg").build();
        PlantAilment link = PlantAilment.builder().plant(plant).ailment(ailment).howUsed("Fruit form").dosageForm("Powder").notes("Use after meals").build();
        Remedy remedy = Remedy.builder()
            .id(44L)
            .name("Amla Digestive Tonic")
            .forAilment("Digestion")
            .difficulty(RemedyDifficulty.BEGINNER)
            .prepTimeMinutes(10)
            .description("Helps digestion")
            .ratingAvg(BigDecimal.valueOf(4.5))
            .ratingCount(12)
            .build();

        when(ailmentCategoryRepository.findById(2L)).thenReturn(Optional.of(ailment));
        when(plantAilmentRepository.findByAilment_Id(2L)).thenReturn(List.of(link));
        when(remedyRepository.findByAilment_Id(2L)).thenReturn(List.of(remedy));

        AilmentDetailDTO result = ailmentService.getAilmentDetail(2L);

        assertEquals("Digestion", result.getName());
        assertEquals(1, result.getPlants().size());
        assertEquals("Amla", result.getPlants().get(0).getCommonName());
        assertEquals(1, result.getRemedies().size());
        assertEquals("Amla Digestive Tonic", result.getRemedies().get(0).getName());
    }

    @Test
    void getAilmentDetail_missingThrowsNotFound() {
        when(ailmentCategoryRepository.findById(404L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> ailmentService.getAilmentDetail(404L));
    }
}
