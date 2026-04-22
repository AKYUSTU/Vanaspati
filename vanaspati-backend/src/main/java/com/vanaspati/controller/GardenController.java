package com.vanaspati.controller;

import com.vanaspati.dto.request.GardenZoneUpsertRequest;
import com.vanaspati.dto.response.GardenZoneDTO;
import com.vanaspati.dto.response.GardenZonePlantsDTO;
import com.vanaspati.service.GardenService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/garden")
@RequiredArgsConstructor
public class GardenController {

    private final GardenService gardenService;

    @GetMapping("/zones")
    public ResponseEntity<List<GardenZoneDTO>> getZones(Principal principal) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(gardenService.getZones(email));
    }

    @GetMapping("/zones/{id}/plants")
    public ResponseEntity<GardenZonePlantsDTO> getZonePlants(@PathVariable Long id, Principal principal) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(gardenService.getZonePlants(id, email));
    }

    @PostMapping("/zones")
    public ResponseEntity<GardenZoneDTO> createZone(
        @Valid @RequestBody GardenZoneUpsertRequest request,
        Principal principal
    ) {
        GardenZoneDTO created = gardenService.createZone(principal.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/zones/{id}")
    public ResponseEntity<GardenZoneDTO> updateZone(
        @PathVariable Long id,
        @Valid @RequestBody GardenZoneUpsertRequest request,
        Principal principal
    ) {
        return ResponseEntity.ok(gardenService.updateZone(id, principal.getName(), request));
    }

    @DeleteMapping("/zones/{id}")
    public ResponseEntity<Void> deleteZone(@PathVariable Long id, Principal principal) {
        gardenService.deleteZone(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/zones/{zoneId}/plants/{plantId}")
    public ResponseEntity<Void> assignPlant(
        @PathVariable Long zoneId,
        @PathVariable Long plantId,
        Principal principal
    ) {
        gardenService.assignPlantToZone(zoneId, plantId, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/zones/{zoneId}/plants/{plantId}")
    public ResponseEntity<Void> removePlant(
        @PathVariable Long zoneId,
        @PathVariable Long plantId,
        Principal principal
    ) {
        gardenService.removePlantFromZone(zoneId, plantId, principal.getName());
        return ResponseEntity.noContent().build();
    }
}
