package com.vanaspati.controller;

import com.vanaspati.dto.request.PlantUpsertRequest;
import com.vanaspati.dto.response.BulkImportResultDTO;
import com.vanaspati.dto.response.UserResponse;
import com.vanaspati.mapper.UserMapper;
import com.vanaspati.model.User;
import com.vanaspati.model.enums.UserRole;
import com.vanaspati.repository.PlantRepository;
import com.vanaspati.repository.RemedyRepository;
import com.vanaspati.repository.UserRepository;
import com.vanaspati.service.PlantService;
import java.util.Map;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final PlantRepository plantRepository;
    private final UserRepository userRepository;
    private final RemedyRepository remedyRepository;
    private final UserMapper userMapper;
    private final PlantService plantService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> stats() {
        return ResponseEntity.ok(Map.of(
            "plants", plantRepository.count(),
            "users", userRepository.count(),
            "remedies", remedyRepository.count()
        ));
    }

    @GetMapping("/users")
    public ResponseEntity<java.util.List<UserResponse>> users() {
        return ResponseEntity.ok(userRepository.findAll().stream().map(userMapper::toResponse).toList());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<Void> changeRole(@PathVariable Long id, @RequestParam UserRole role) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setRole(role);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/plants/bulk-import")
    public ResponseEntity<BulkImportResultDTO> bulkImport(@RequestBody List<PlantUpsertRequest> payload) {
        return ResponseEntity.ok(plantService.bulkImportPlants(payload));
    }
}
