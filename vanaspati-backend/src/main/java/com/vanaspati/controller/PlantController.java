package com.vanaspati.controller;

import com.vanaspati.dto.request.PlantUpsertRequest;
import com.vanaspati.dto.response.PlantDetailDTO;
import com.vanaspati.dto.response.PlantSummaryDTO;
import com.vanaspati.service.PlantService;
import com.vanaspati.service.PlantOfDayService;
import com.vanaspati.service.ViewTrackingService;
import jakarta.validation.Valid;
import java.util.Arrays;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/plants")
@RequiredArgsConstructor
public class PlantController {

    private final PlantService plantService;
    private final PlantOfDayService plantOfDayService;
    private final ViewTrackingService viewTrackingService;

    @GetMapping
    public ResponseEntity<Page<PlantSummaryDTO>> getPlants(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "12") int size,
        @RequestParam(defaultValue = "commonName") String sort,
        @RequestParam(required = false) String system,
        @RequestParam(required = false) String ailment,
        @RequestParam(required = false) String type,
        @RequestParam(required = false) String region,
        @RequestParam(required = false) String q
    ) {
        return ResponseEntity.ok(plantService.getPlants(page, size, sort, system, ailment, type, region, q));
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<PlantSummaryDTO>> filterPlants(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "12") int size,
        @RequestParam(defaultValue = "commonName") String sort,
        @RequestParam(required = false) String system,
        @RequestParam(required = false) String ailment,
        @RequestParam(required = false) String type,
        @RequestParam(required = false) String region,
        @RequestParam(required = false) String q
    ) {
        return ResponseEntity.ok(plantService.getPlants(page, size, sort, system, ailment, type, region, q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlantDetailDTO> getPlant(@PathVariable Long id) {
        return ResponseEntity.ok(plantService.getPlantById(id));
    }

    @GetMapping("/{id}/summary")
    public ResponseEntity<PlantSummaryDTO> getPlantSummary(@PathVariable Long id) {
        return ResponseEntity.ok(plantService.getPlantSummary(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<PlantSummaryDTO>> searchPlants(@RequestParam("q") String q) {
        return ResponseEntity.ok(plantService.searchPlants(q));
    }

    @GetMapping("/herb-of-day")
    public ResponseEntity<PlantSummaryDTO> getHerbOfDay() {
        return ResponseEntity.ok(plantOfDayService.getHerbOfDay());
    }

    @GetMapping("/compare")
    public ResponseEntity<List<PlantDetailDTO>> comparePlants(@RequestParam("ids") String ids) {
        List<Long> parsedIds = Arrays.stream(ids.split(","))
            .map(String::trim)
            .map(Long::valueOf)
            .toList();
        return ResponseEntity.ok(plantService.comparePlants(parsedIds));
    }

    @GetMapping("/by-body-part")
    public ResponseEntity<List<PlantSummaryDTO>> byBodyPart(@RequestParam("part") String part) {
        return ResponseEntity.ok(plantService.findByBodyPart(part));
    }

    @GetMapping("/seasonal-data")
    public ResponseEntity<List<PlantDetailDTO>> getSeasonalData() {
        return ResponseEntity.ok(plantService.seasonalData());
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<Void> trackView(@PathVariable Long id) {
        viewTrackingService.trackView(id, null);
        return ResponseEntity.ok().build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PlantDetailDTO> createPlant(@Valid @RequestBody PlantUpsertRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(plantService.createPlant(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PlantDetailDTO> updatePlant(@PathVariable Long id, @Valid @RequestBody PlantUpsertRequest request) {
        return ResponseEntity.ok(plantService.updatePlant(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePlant(@PathVariable Long id) {
        plantService.deletePlant(id);
        return ResponseEntity.noContent().build();
    }
}
