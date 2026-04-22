package com.vanaspati.service;

import com.vanaspati.dto.request.RemedyUpsertRequest;
import com.vanaspati.dto.response.RemedyDetailDTO;
import com.vanaspati.dto.response.RemedySummaryDTO;
import com.vanaspati.exception.ResourceNotFoundException;
import com.vanaspati.model.Plant;
import com.vanaspati.model.Remedy;
import com.vanaspati.model.RemedyIngredient;
import com.vanaspati.model.RemedyStep;
import com.vanaspati.repository.PlantRepository;
import com.vanaspati.repository.RemedyIngredientRepository;
import com.vanaspati.repository.RemedyRepository;
import com.vanaspati.repository.RemedyStepRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RemedyService {

    private final RemedyRepository remedyRepository;
    private final RemedyIngredientRepository remedyIngredientRepository;
    private final RemedyStepRepository remedyStepRepository;
    private final PlantRepository plantRepository;

    public List<RemedySummaryDTO> getAllRemedies() {
        return remedyRepository.findAll().stream()
            .map(this::toSummaryDto)
            .toList();
    }

    public Page<RemedySummaryDTO> getRemediesPaged(int page, int size, String sortBy) {
        Sort sort = sortBy.equals("rating") 
            ? Sort.by(Sort.Direction.DESC, "ratingAvg")
            : Sort.by(Sort.Direction.DESC, "createdAt");
        Pageable pageable = PageRequest.of(page, size, sort);
        return remedyRepository.findAll(pageable)
            .map(this::toSummaryDto);
    }

    public Page<RemedySummaryDTO> searchRemedies(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        String searchTerm = "%" + (query == null ? "" : query.toLowerCase()) + "%";
        
        return remedyRepository.findAll(pageable).stream()
            .filter(r -> r.getName().toLowerCase().contains(query == null ? "" : query.toLowerCase())
                    || (r.getDescription() != null && r.getDescription().toLowerCase().contains(query == null ? "" : query.toLowerCase())))
            .map(this::toSummaryDto)
            .collect(Collectors.collectingAndThen(
                Collectors.toList(),
                list -> new org.springframework.data.domain.PageImpl<>(list, pageable, list.size())
            ));
    }

    public RemedyDetailDTO getRemedyById(Long id) {
        Remedy remedy = remedyRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Remedy not found: " + id));
        
        List<RemedyIngredient> ingredients = remedyIngredientRepository.findByRemedy_Id(id);
        List<RemedyStep> steps = remedyStepRepository.findByRemedy_IdOrderByStepNumber(id);
        
        return toDetailDto(remedy, ingredients, steps);
    }

    @Transactional
    public RemedyDetailDTO createRemedy(RemedyUpsertRequest request) {
        Remedy remedy = Remedy.builder()
            .name(request.getName())
            .forAilment(request.getForAilment())
            .difficulty(request.getDifficulty())
            .prepTimeMinutes(request.getPrepTimeMinutes())
            .description(request.getDescription())
            .precautions(request.getPrecautions())
            .ratingAvg(java.math.BigDecimal.ZERO)
            .ratingCount(0)
            .createdAt(LocalDateTime.now())
            .build();
        
        Remedy savedRemedy = remedyRepository.save(remedy);
        
        List<RemedyIngredient> ingredients = (request.getIngredients() != null)
            ? request.getIngredients().stream()
                .map(ing -> RemedyIngredient.builder()
                    .remedy(savedRemedy)
                    .ingredientName(ing.getIngredientName())
                    .quantity(ing.getQuantity())
                    .notes(ing.getNotes())
                    .plant(ing.getPlantId() != null ? plantRepository.findById(ing.getPlantId()).orElse(null) : null)
                    .build())
                .peek(remedyIngredientRepository::save)
                .toList()
            : List.of();
        
        List<RemedyStep> steps = (request.getSteps() != null)
            ? request.getSteps().stream()
                .map(step -> RemedyStep.builder()
                    .remedy(savedRemedy)
                    .stepNumber(step.getStepNumber())
                    .instruction(step.getInstruction())
                    .build())
                .peek(remedyStepRepository::save)
                .toList()
            : List.of();
        
        return toDetailDto(savedRemedy, ingredients, steps);
    }

    @Transactional
    public RemedyDetailDTO updateRemedy(Long id, RemedyUpsertRequest request) {
        Remedy remedy = remedyRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Remedy not found: " + id));
        
        remedy.setName(request.getName());
        remedy.setForAilment(request.getForAilment());
        remedy.setDifficulty(request.getDifficulty());
        remedy.setPrepTimeMinutes(request.getPrepTimeMinutes());
        remedy.setDescription(request.getDescription());
        remedy.setPrecautions(request.getPrecautions());
        
        Remedy savedRemedy = remedyRepository.save(remedy);
        
        // Update ingredients
        remedyIngredientRepository.deleteAll(remedyIngredientRepository.findByRemedy_Id(id));
        List<RemedyIngredient> ingredients = (request.getIngredients() != null)
            ? request.getIngredients().stream()
                .map(ing -> RemedyIngredient.builder()
                    .remedy(savedRemedy)
                    .ingredientName(ing.getIngredientName())
                    .quantity(ing.getQuantity())
                    .notes(ing.getNotes())
                    .plant(ing.getPlantId() != null ? plantRepository.findById(ing.getPlantId()).orElse(null) : null)
                    .build())
                .peek(remedyIngredientRepository::save)
                .toList()
            : List.of();
        
        // Update steps
        remedyStepRepository.deleteAll(remedyStepRepository.findByRemedy_IdOrderByStepNumber(id));
        List<RemedyStep> steps = (request.getSteps() != null)
            ? request.getSteps().stream()
                .map(step -> RemedyStep.builder()
                    .remedy(savedRemedy)
                    .stepNumber(step.getStepNumber())
                    .instruction(step.getInstruction())
                    .build())
                .peek(remedyStepRepository::save)
                .toList()
            : List.of();
        
        return toDetailDto(savedRemedy, ingredients, steps);
    }

    @Transactional
    public void deleteRemedy(Long id) {
        Remedy remedy = remedyRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Remedy not found: " + id));
        
        remedyIngredientRepository.deleteAll(remedyIngredientRepository.findByRemedy_Id(id));
        remedyStepRepository.deleteAll(remedyStepRepository.findByRemedy_IdOrderByStepNumber(id));
        remedyRepository.delete(remedy);
    }

    private RemedySummaryDTO toSummaryDto(Remedy remedy) {
        return RemedySummaryDTO.builder()
            .id(remedy.getId())
            .name(remedy.getName())
            .forAilment(remedy.getForAilment())
            .ailmentName(remedy.getAilment() != null ? remedy.getAilment().getName() : null)
            .difficulty(remedy.getDifficulty())
            .prepTimeMinutes(remedy.getPrepTimeMinutes())
            .description(remedy.getDescription())
            .ratingAvg(remedy.getRatingAvg())
            .ratingCount(remedy.getRatingCount() != null ? remedy.getRatingCount() : 0)
            .createdAt(remedy.getCreatedAt())
            .build();
    }

    private RemedyDetailDTO toDetailDto(Remedy remedy, List<RemedyIngredient> ingredients, List<RemedyStep> steps) {
        return RemedyDetailDTO.builder()
            .id(remedy.getId())
            .name(remedy.getName())
            .forAilment(remedy.getForAilment())
            .ailmentName(remedy.getAilment() != null ? remedy.getAilment().getName() : null)
            .difficulty(remedy.getDifficulty())
            .prepTimeMinutes(remedy.getPrepTimeMinutes())
            .description(remedy.getDescription())
            .precautions(remedy.getPrecautions())
            .ratingAvg(remedy.getRatingAvg())
            .ratingCount(remedy.getRatingCount() != null ? remedy.getRatingCount() : 0)
            .createdAt(remedy.getCreatedAt())
            .ingredients(ingredients.stream()
                .map(ing -> RemedyDetailDTO.IngredientDTO.builder()
                    .id(ing.getId())
                    .ingredientName(ing.getIngredientName())
                    .quantity(ing.getQuantity())
                    .notes(ing.getNotes())
                    .plantId(ing.getPlant() != null ? ing.getPlant().getId() : null)
                    .plantName(ing.getPlant() != null ? ing.getPlant().getCommonName() : null)
                    .build())
                .toList())
            .steps(steps.stream()
                .map(step -> RemedyDetailDTO.StepDTO.builder()
                    .id(step.getId())
                    .stepNumber(step.getStepNumber())
                    .instruction(step.getInstruction())
                    .build())
                .toList())
            .build();
    }
}
