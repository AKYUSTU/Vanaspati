package com.vanaspati.service;

import com.vanaspati.dto.request.PlantUpsertRequest;
import com.vanaspati.dto.response.BulkImportResultDTO;
import com.vanaspati.dto.response.PlantDetailDTO;
import com.vanaspati.dto.response.PlantSummaryDTO;
import com.vanaspati.exception.DuplicateResourceException;
import com.vanaspati.exception.ResourceNotFoundException;
import com.vanaspati.mapper.PlantMapper;
import com.vanaspati.model.Plant;
import com.vanaspati.repository.PlantRepository;
import com.vanaspati.model.enums.PlantType;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PlantService {

    private final PlantRepository plantRepository;
    private final PlantMapper plantMapper;

    public Page<PlantSummaryDTO> getPlants(int page, int size, String sortBy, String system, String ailment, String type, String region, String q) {
        Sort sort = resolveSort(sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        String normalizedSystem = normalizeEnum(system);
        String normalizedType = normalizeType(type);
        return plantRepository.findFiltered(q, normalizedSystem, ailment, normalizedType, region, pageable)
            .map(plantMapper::toSummaryDto);
    }

    public PlantDetailDTO getPlantById(Long id) {
        Plant plant = plantRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Plant not found: " + id));
        return plantMapper.toDetailDto(plant);
    }

    public List<PlantSummaryDTO> searchPlants(String query) {
        if (query == null || query.isBlank()) {
            return List.of();
        }
        return plantRepository.searchAutocomplete(query).stream()
            .map(plantMapper::toSummaryDto)
            .toList();
    }

    public PlantSummaryDTO getPlantSummary(Long id) {
        Plant plant = plantRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Plant not found: " + id));
        return plantMapper.toSummaryDto(plant);
    }

    @Cacheable(value = "herb-of-day", key = "'daily'")
    public PlantSummaryDTO getHerbOfDay() {
        List<Plant> allPlants = plantRepository.findAll();
        if (allPlants.isEmpty()) {
            throw new IllegalArgumentException("No plants available");
        }
        long dayIndex = java.time.LocalDate.now().toEpochDay() % allPlants.size();
        return plantMapper.toSummaryDto(allPlants.get((int) dayIndex));
    }

    public List<PlantDetailDTO> comparePlants(List<Long> ids) {
        return plantRepository.findAllById(ids).stream()
            .map(plantMapper::toDetailDto)
            .toList();
    }

    public List<PlantDetailDTO> seasonalData() {
        return plantRepository.findAll().stream()
            .filter(p -> Boolean.TRUE.equals(p.getIsActive()))
            .map(plantMapper::toDetailDto)
            .toList();
    }

    public List<PlantSummaryDTO> findByBodyPart(String part) {
        if (part == null || part.isBlank()) {
            return List.of();
        }
        String normalized = part.toUpperCase();
        return plantRepository.findAll().stream()
            .filter(p -> p.getBodyParts() != null && p.getBodyParts().toUpperCase().contains(normalized))
            .map(plantMapper::toSummaryDto)
            .toList();
    }

    @Transactional
    public void trackView(Long plantId) {
        Plant plant = plantRepository.findById(plantId)
            .orElseThrow(() -> new IllegalArgumentException("Plant not found: " + plantId));
        plant.setViewCount((plant.getViewCount() == null ? 0 : plant.getViewCount()) + 1);
    }

    @Transactional
    public PlantDetailDTO createPlant(PlantUpsertRequest request) {
        if (plantRepository.existsByScientificNameIgnoreCase(request.getScientificName())) {
            throw new DuplicateResourceException("Plant with scientific name already exists: " + request.getScientificName());
        }

        Plant plant = new Plant();
        applyUpsertData(plant, request);
        plant.setViewCount(0);
        plant.setBookmarkCount(0);
        plant.setCreatedAt(LocalDateTime.now());
        plant.setUpdatedAt(LocalDateTime.now());

        return plantMapper.toDetailDto(plantRepository.save(plant));
    }

    @Transactional
    public PlantDetailDTO updatePlant(Long id, PlantUpsertRequest request) {
        Plant plant = plantRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Plant not found: " + id));

        plantRepository.findByScientificNameIgnoreCase(request.getScientificName())
            .filter(existing -> !existing.getId().equals(id))
            .ifPresent(existing -> {
                throw new DuplicateResourceException("Plant with scientific name already exists: " + request.getScientificName());
            });

        applyUpsertData(plant, request);
        plant.setUpdatedAt(LocalDateTime.now());
        return plantMapper.toDetailDto(plantRepository.save(plant));
    }

    @Transactional
    public void deletePlant(Long id) {
        Plant plant = plantRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Plant not found: " + id));
        plant.setIsActive(false);
        plant.setUpdatedAt(LocalDateTime.now());
        plantRepository.save(plant);
    }

    @Transactional
    public BulkImportResultDTO bulkImportPlants(List<PlantUpsertRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            throw new IllegalArgumentException("Bulk import payload is empty");
        }

        int created = 0;
        int updated = 0;
        int failed = 0;
        List<String> errors = new ArrayList<>();

        for (int index = 0; index < requests.size(); index++) {
            PlantUpsertRequest request = requests.get(index);
            try {
                if (request.getCommonName() == null || request.getCommonName().isBlank()) {
                    throw new IllegalArgumentException("commonName is required");
                }
                if (request.getScientificName() == null || request.getScientificName().isBlank()) {
                    throw new IllegalArgumentException("scientificName is required");
                }

                Plant plant = plantRepository.findByScientificNameIgnoreCase(request.getScientificName())
                    .orElse(null);

                if (plant == null) {
                    plant = new Plant();
                    applyUpsertData(plant, request);
                    plant.setViewCount(0);
                    plant.setBookmarkCount(0);
                    plant.setCreatedAt(LocalDateTime.now());
                    plant.setUpdatedAt(LocalDateTime.now());
                    plantRepository.save(plant);
                    created++;
                } else {
                    applyUpsertData(plant, request);
                    plant.setUpdatedAt(LocalDateTime.now());
                    plantRepository.save(plant);
                    updated++;
                }
            } catch (Exception ex) {
                failed++;
                errors.add("Item " + (index + 1) + ": " + ex.getMessage());
            }
        }

        return BulkImportResultDTO.builder()
            .total(requests.size())
            .created(created)
            .updated(updated)
            .failed(failed)
            .errors(errors)
            .build();
    }

    private void applyUpsertData(Plant plant, PlantUpsertRequest request) {
        plant.setCommonName(request.getCommonName().trim());
        plant.setScientificName(request.getScientificName().trim());
        plant.setSanskritName(request.getSanskritName());
        plant.setLocalNames(request.getLocalNames());
        plant.setPlantFamily(request.getPlantFamily());
        plant.setPlantType(parsePlantType(request.getPlantType()));
        plant.setNativeRegion(request.getNativeRegion());
        plant.setDescription(request.getDescription());
        plant.setMorphology(request.getMorphology());
        plant.setIdentifyingFeatures(request.getIdentifyingFeatures());
        plant.setMainImageUrl(request.getMainImageUrl());
        plant.setGalleryImages(request.getGalleryImages());
        plant.setPartsUsed(request.getPartsUsed());
        plant.setRasa(request.getRasa());
        plant.setVirya(request.getVirya());
        plant.setVipaka(request.getVipaka());
        plant.setBodyParts(request.getBodyParts());
        plant.setHarvestMonths(request.getHarvestMonths());
        plant.setBloomMonths(request.getBloomMonths());
        plant.setActiveCompounds(request.getActiveCompounds());
        plant.setPrecautions(request.getPrecautions());
        plant.setContraindications(request.getContraindications());
        plant.setIsFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : Boolean.FALSE);
        plant.setIsActive(request.getIsActive() != null ? request.getIsActive() : Boolean.TRUE);
    }

    private PlantType parsePlantType(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String normalized = normalizeEnum(value);
        try {
            return PlantType.valueOf(normalized);
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid plantType: " + value);
        }
    }

    private Sort resolveSort(String sortBy) {
        if (sortBy == null || sortBy.isBlank()) {
            return Sort.by("common_name").ascending();
        }

        return switch (sortBy) {
            case "A-Z", "NAME_ASC", "commonName" -> Sort.by("common_name").ascending();
            case "Z-A", "NAME_DESC" -> Sort.by("common_name").descending();
            case "MOST_VIEWED" -> Sort.by("view_count").descending();
            case "MOST_BOOKMARKED" -> Sort.by("bookmark_count").descending();
            case "RECENTLY_ADDED" -> Sort.by("created_at").descending();
            default -> Sort.by(sortBy).ascending();
        };
    }

    private String normalizeEnum(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim().toUpperCase().replace('-', '_').replace(' ', '_');
    }

    private String normalizeType(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String normalized = normalizeEnum(value);
        try {
            PlantType.valueOf(normalized);
            return normalized;
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }
}
