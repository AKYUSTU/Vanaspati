package com.vanaspati.service;

import com.vanaspati.dto.request.GardenZoneUpsertRequest;
import com.vanaspati.dto.response.GardenZoneDTO;
import com.vanaspati.dto.response.GardenZonePlantsDTO;
import com.vanaspati.dto.response.PlantSummaryDTO;
import com.vanaspati.exception.DuplicateResourceException;
import com.vanaspati.exception.ResourceNotFoundException;
import com.vanaspati.mapper.PlantMapper;
import com.vanaspati.model.GardenZone;
import com.vanaspati.model.Plant;
import com.vanaspati.model.PlantGardenZone;
import com.vanaspati.model.User;
import com.vanaspati.model.id.PlantGardenZoneId;
import com.vanaspati.repository.GardenZoneRepository;
import com.vanaspati.repository.PlantGardenZoneRepository;
import com.vanaspati.repository.PlantRepository;
import com.vanaspati.repository.UserRepository;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GardenService {

    private final GardenZoneRepository gardenZoneRepository;
    private final PlantGardenZoneRepository plantGardenZoneRepository;
    private final PlantRepository plantRepository;
    private final UserRepository userRepository;
    private final PlantMapper plantMapper;

    public List<GardenZoneDTO> getZones(String userEmail) {
        List<GardenZone> zones;
        Long userId = null;
        if (userEmail != null && !userEmail.isBlank()) {
            User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));
            userId = user.getId();
            zones = gardenZoneRepository.findByUser_IdOrUserIsNullOrderByIdAsc(userId);
        } else {
            zones = gardenZoneRepository.findAll().stream()
                .filter(zone -> zone.getUser() == null)
                .toList();
        }
        Long finalUserId = userId;
        return zones.stream()
            .map(zone -> toZoneDto(zone, finalUserId))
            .toList();
    }

    public GardenZonePlantsDTO getZonePlants(Long zoneId, String userEmail) {
        GardenZone zone = resolveAccessibleZone(zoneId, userEmail);
        List<PlantSummaryDTO> plants = plantGardenZoneRepository.findByZone_Id(zoneId).stream()
            .map(PlantGardenZone::getPlant)
            .map(plantMapper::toSummaryDto)
            .toList();
        Long userId = resolveUserIdOrNull(userEmail);
        return GardenZonePlantsDTO.builder()
            .zone(toZoneDto(zone, userId))
            .plants(plants)
            .build();
    }

    @Transactional
    public GardenZoneDTO createZone(String userEmail, GardenZoneUpsertRequest request) {
        User user = resolveUser(userEmail);
        GardenZone zone = GardenZone.builder()
            .zoneName(request.getZoneName())
            .zoneKey(generateZoneKey(request.getZoneName(), user.getId()))
            .description(request.getDescription())
            .svgPathData(request.getSvgPathData())
            .svgCx(request.getSvgCx())
            .svgCy(request.getSvgCy())
            .colorHex(request.getColorHex())
            .iconEmoji(request.getIconEmoji())
            .user(user)
            .build();
        GardenZone saved = gardenZoneRepository.save(zone);
        return toZoneDto(saved, user.getId());
    }

    @Transactional
    public GardenZoneDTO updateZone(Long zoneId, String userEmail, GardenZoneUpsertRequest request) {
        User user = resolveUser(userEmail);
        GardenZone zone = gardenZoneRepository.findByIdAndUser_Id(zoneId, user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Garden zone not found: " + zoneId));

        zone.setZoneName(request.getZoneName());
        zone.setDescription(request.getDescription());
        zone.setSvgPathData(request.getSvgPathData());
        zone.setSvgCx(request.getSvgCx());
        zone.setSvgCy(request.getSvgCy());
        zone.setColorHex(request.getColorHex());
        zone.setIconEmoji(request.getIconEmoji());

        GardenZone saved = gardenZoneRepository.save(zone);
        return toZoneDto(saved, user.getId());
    }

    @Transactional
    public void deleteZone(Long zoneId, String userEmail) {
        User user = resolveUser(userEmail);
        GardenZone zone = gardenZoneRepository.findByIdAndUser_Id(zoneId, user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Garden zone not found: " + zoneId));
        plantGardenZoneRepository.deleteByZone_Id(zone.getId());
        gardenZoneRepository.delete(zone);
    }

    @Transactional
    public void assignPlantToZone(Long zoneId, Long plantId, String userEmail) {
        User user = resolveUser(userEmail);
        GardenZone zone = gardenZoneRepository.findByIdAndUser_Id(zoneId, user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Garden zone not found: " + zoneId));
        Plant plant = plantRepository.findById(plantId)
            .orElseThrow(() -> new ResourceNotFoundException("Plant not found: " + plantId));

        boolean alreadyAssigned = plantGardenZoneRepository.existsByPlant_IdAndZone_Id(plantId, zoneId);
        if (alreadyAssigned) {
            throw new DuplicateResourceException("Plant already assigned to this zone");
        }

        PlantGardenZone relation = PlantGardenZone.builder()
            .id(new PlantGardenZoneId(plantId, zoneId))
            .plant(plant)
            .zone(zone)
            .build();
        plantGardenZoneRepository.save(relation);
    }

    @Transactional
    public void removePlantFromZone(Long zoneId, Long plantId, String userEmail) {
        User user = resolveUser(userEmail);
        gardenZoneRepository.findByIdAndUser_Id(zoneId, user.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Garden zone not found: " + zoneId));

        PlantGardenZone relation = plantGardenZoneRepository.findByPlant_IdAndZone_Id(plantId, zoneId)
            .orElseThrow(() -> new ResourceNotFoundException("Plant is not assigned to this zone"));
        plantGardenZoneRepository.delete(relation);
    }

    private GardenZone resolveAccessibleZone(Long zoneId, String userEmail) {
        Long userId = resolveUserIdOrNull(userEmail);
        if (userId == null) {
            return gardenZoneRepository.findByIdAndUserIsNull(zoneId)
                .orElseThrow(() -> new ResourceNotFoundException("Garden zone not found: " + zoneId));
        }

        return gardenZoneRepository.findByIdAndUser_Id(zoneId, userId)
            .or(() -> gardenZoneRepository.findByIdAndUserIsNull(zoneId))
            .orElseThrow(() -> new ResourceNotFoundException("Garden zone not found: " + zoneId));
    }

    private User resolveUser(String userEmail) {
        if (userEmail == null || userEmail.isBlank()) {
            throw new ResourceNotFoundException("Authenticated user is required");
        }
        return userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));
    }

    private Long resolveUserIdOrNull(String userEmail) {
        if (userEmail == null || userEmail.isBlank()) {
            return null;
        }
        return userRepository.findByEmail(userEmail)
            .map(User::getId)
            .orElse(null);
    }

    private GardenZoneDTO toZoneDto(GardenZone zone, Long currentUserId) {
        boolean userOwned = zone.getUser() != null && currentUserId != null && zone.getUser().getId().equals(currentUserId);
        return GardenZoneDTO.builder()
            .id(zone.getId())
            .zoneName(zone.getZoneName())
            .zoneKey(zone.getZoneKey())
            .description(zone.getDescription())
            .systemName(zone.getAyushSystem() != null ? zone.getAyushSystem().getName().name() : "General")
            .svgPathData(zone.getSvgPathData())
            .svgCx(zone.getSvgCx())
            .svgCy(zone.getSvgCy())
            .colorHex(zone.getColorHex())
            .iconEmoji(zone.getIconEmoji())
            .userOwned(userOwned)
            .plantCount(plantGardenZoneRepository.countByZone_Id(zone.getId()))
            .build();
    }

    private String generateZoneKey(String zoneName, Long userId) {
        String base = zoneName.toLowerCase(Locale.ROOT)
            .replaceAll("[^a-z0-9]+", "-")
            .replaceAll("(^-|-$)", "");
        return base + "-u" + userId + "-" + System.currentTimeMillis();
    }
}
