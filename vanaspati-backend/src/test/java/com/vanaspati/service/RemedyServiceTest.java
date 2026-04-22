package com.vanaspati.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.vanaspati.dto.request.RemedyUpsertRequest;
import com.vanaspati.dto.response.RemedyDetailDTO;
import com.vanaspati.exception.ResourceNotFoundException;
import com.vanaspati.model.Plant;
import com.vanaspati.model.Remedy;
import com.vanaspati.model.RemedyIngredient;
import com.vanaspati.model.RemedyStep;
import com.vanaspati.model.enums.RemedyDifficulty;
import com.vanaspati.repository.PlantRepository;
import com.vanaspati.repository.RemedyIngredientRepository;
import com.vanaspati.repository.RemedyRepository;
import com.vanaspati.repository.RemedyStepRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RemedyServiceTest {

    @Mock
    private RemedyRepository remedyRepository;

    @Mock
    private RemedyIngredientRepository remedyIngredientRepository;

    @Mock
    private RemedyStepRepository remedyStepRepository;

    @Mock
    private PlantRepository plantRepository;

    @InjectMocks
    private RemedyService remedyService;

    @Test
    void createRemedy_createsIngredientsAndSteps() {
        RemedyUpsertRequest request = RemedyUpsertRequest.builder()
            .name("Tulsi Kadha")
            .forAilment("Cold")
            .difficulty(RemedyDifficulty.BEGINNER)
            .prepTimeMinutes(15)
            .description("Warm decoction")
            .precautions("Avoid excess use")
            .ingredients(List.of(RemedyUpsertRequest.IngredientInput.builder()
                .ingredientName("Tulsi leaves")
                .quantity("10 leaves")
                .notes("Fresh")
                .plantId(3L)
                .build()))
            .steps(List.of(RemedyUpsertRequest.StepInput.builder()
                .stepNumber(1)
                .instruction("Boil and reduce")
                .build()))
            .build();

        Remedy savedRemedy = Remedy.builder()
            .id(11L)
            .name("Tulsi Kadha")
            .forAilment("Cold")
            .difficulty(RemedyDifficulty.BEGINNER)
            .prepTimeMinutes(15)
            .description("Warm decoction")
            .precautions("Avoid excess use")
            .ratingAvg(BigDecimal.ZERO)
            .ratingCount(0)
            .createdAt(LocalDateTime.now())
            .build();
        Plant linkedPlant = Plant.builder().id(3L).commonName("Tulsi").build();

        when(remedyRepository.save(any(Remedy.class))).thenReturn(savedRemedy);
        when(plantRepository.findById(3L)).thenReturn(Optional.of(linkedPlant));
        when(remedyIngredientRepository.save(any(RemedyIngredient.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(remedyStepRepository.save(any(RemedyStep.class))).thenAnswer(invocation -> invocation.getArgument(0));

        RemedyDetailDTO result = remedyService.createRemedy(request);

        assertEquals("Tulsi Kadha", result.getName());
        assertEquals(1, result.getIngredients().size());
        assertEquals("Tulsi", result.getIngredients().get(0).getPlantName());
        assertEquals(1, result.getSteps().size());
    }

    @Test
    void updateRemedy_whenMissing_throwsNotFound() {
        when(remedyRepository.findById(404L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> remedyService.updateRemedy(404L, RemedyUpsertRequest.builder()
            .name("x")
            .description("x")
            .difficulty(RemedyDifficulty.BEGINNER)
            .build()));
    }

    @Test
    void deleteRemedy_removesChildrenAndEntity() {
        Remedy remedy = Remedy.builder().id(8L).name("Neem paste").build();

        when(remedyRepository.findById(8L)).thenReturn(Optional.of(remedy));
        when(remedyIngredientRepository.findByRemedy_Id(8L)).thenReturn(List.of());
        when(remedyStepRepository.findByRemedy_IdOrderByStepNumber(8L)).thenReturn(List.of());

        remedyService.deleteRemedy(8L);

        verify(remedyIngredientRepository).deleteAll(any());
        verify(remedyStepRepository).deleteAll(any());
        verify(remedyRepository).delete(remedy);
    }
}
