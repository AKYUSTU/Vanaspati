package com.vanaspati.service;

import com.vanaspati.dto.response.AilmentDetailDTO;
import com.vanaspati.dto.response.AilmentSummaryDTO;
import com.vanaspati.dto.response.RemedySummaryDTO;
import com.vanaspati.exception.ResourceNotFoundException;
import com.vanaspati.model.AilmentCategory;
import com.vanaspati.model.PlantAilment;
import com.vanaspati.model.Remedy;
import com.vanaspati.repository.AilmentCategoryRepository;
import com.vanaspati.repository.PlantAilmentRepository;
import com.vanaspati.repository.RemedyRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AilmentService {

    private final AilmentCategoryRepository ailmentCategoryRepository;
    private final PlantAilmentRepository plantAilmentRepository;
    private final RemedyRepository remedyRepository;

    public List<AilmentSummaryDTO> getAilments() {
        return ailmentCategoryRepository.findAll().stream()
            .map(this::toSummaryDto)
            .toList();
    }

    public AilmentDetailDTO getAilmentDetail(Long id) {
        AilmentCategory ailment = ailmentCategoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Ailment not found: " + id));

        List<PlantAilment> plantLinks = plantAilmentRepository.findByAilment_Id(id);
        List<Remedy> remedies = remedyRepository.findByAilment_Id(id);

        return AilmentDetailDTO.builder()
            .id(ailment.getId())
            .name(ailment.getName())
            .slug(ailment.getSlug())
            .bodyPart(ailment.getBodyPart())
            .description(ailment.getDescription())
            .plants(plantLinks.stream().map(link -> AilmentDetailDTO.PlantForAilmentDTO.builder()
                .plantId(link.getPlant().getId())
                .commonName(link.getPlant().getCommonName())
                .scientificName(link.getPlant().getScientificName())
                .mainImageUrl(link.getPlant().getMainImageUrl())
                .howUsed(link.getHowUsed())
                .dosageForm(link.getDosageForm())
                .notes(link.getNotes())
                .build()).toList())
            .remedies(remedies.stream().map(this::toRemedySummary).toList())
            .build();
    }

    public List<RemedySummaryDTO> getAilmentRemedies(Long ailmentId) {
        ailmentCategoryRepository.findById(ailmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Ailment not found: " + ailmentId));
        return remedyRepository.findByAilment_Id(ailmentId).stream()
            .map(this::toRemedySummary)
            .toList();
    }

    private AilmentSummaryDTO toSummaryDto(AilmentCategory ailment) {
        int plantCount = plantAilmentRepository.countByAilment_Id(ailment.getId());
        int remedyCount = remedyRepository.findByAilment_Id(ailment.getId()).size();
        return AilmentSummaryDTO.builder()
            .id(ailment.getId())
            .name(ailment.getName())
            .slug(ailment.getSlug())
            .bodyPart(ailment.getBodyPart())
            .description(ailment.getDescription())
            .plantCount(plantCount)
            .remedyCount(remedyCount)
            .build();
    }

    private RemedySummaryDTO toRemedySummary(Remedy remedy) {
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
}
