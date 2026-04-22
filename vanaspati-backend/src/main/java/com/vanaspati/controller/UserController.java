package com.vanaspati.controller;

import com.vanaspati.dto.request.ChangePasswordRequest;
import com.vanaspati.dto.request.UpdateProfileRequest;
import com.vanaspati.dto.response.PlantViewHistoryResponseDTO;
import com.vanaspati.dto.response.PointsHistoryResponseDTO;
import com.vanaspati.dto.response.UserResponse;
import com.vanaspati.mapper.UserMapper;
import com.vanaspati.model.Plant;
import com.vanaspati.model.PlantViewHistory;
import com.vanaspati.model.User;
import com.vanaspati.model.UserPointsHistory;
import com.vanaspati.repository.PlantViewHistoryRepository;
import com.vanaspati.repository.UserPointsHistoryRepository;
import com.vanaspati.repository.UserRepository;
import jakarta.validation.Valid;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/me")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final UserPointsHistoryRepository userPointsHistoryRepository;
    private final PlantViewHistoryRepository plantViewHistoryRepository;

    @GetMapping
    public ResponseEntity<UserResponse> me(Principal principal) {
        User user = getCurrentUser(principal);
        return ResponseEntity.ok(userMapper.toResponse(user));
    }

    @PutMapping
    public ResponseEntity<UserResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request, Principal principal) {
        User user = getCurrentUser(principal);
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        return ResponseEntity.ok(userMapper.toResponse(userRepository.save(user)));
    }

    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request, Principal principal) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Password confirmation does not match");
        }

        User user = getCurrentUser(principal);
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAccount(Principal principal) {
        User user = getCurrentUser(principal);
        userRepository.delete(user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/history")
    public ResponseEntity<java.util.List<PlantViewHistoryResponseDTO>> history(Principal principal) {
        User user = getCurrentUser(principal);
        java.util.List<PlantViewHistoryResponseDTO> history = plantViewHistoryRepository.findAllByUserIdOrderByViewedAtDesc(user.getId())
            .stream()
            .map(this::toHistoryResponse)
            .toList();
        return ResponseEntity.ok(history);
    }

    @DeleteMapping("/history")
    public ResponseEntity<Void> clearHistory(Principal principal) {
        User user = getCurrentUser(principal);
        plantViewHistoryRepository.deleteAllByUserId(user.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/points-history")
    public ResponseEntity<java.util.List<PointsHistoryResponseDTO>> pointsHistory(Principal principal) {
        User user = getCurrentUser(principal);
        java.util.List<PointsHistoryResponseDTO> history = userPointsHistoryRepository.findAllByUserIdOrderByEarnedAtDesc(user.getId())
            .stream()
            .map(this::toPointsResponse)
            .toList();
        return ResponseEntity.ok(history);
    }

    private User getCurrentUser(Principal principal) {
        return userRepository.findByEmail(principal.getName())
            .orElseThrow(() -> new IllegalArgumentException("Current user not found"));
    }

    private PlantViewHistoryResponseDTO toHistoryResponse(PlantViewHistory history) {
        Plant plant = history.getPlant();
        return PlantViewHistoryResponseDTO.builder()
            .id(history.getId())
            .plantId(plant.getId())
            .commonName(plant.getCommonName())
            .scientificName(plant.getScientificName())
            .mainImageUrl(plant.getMainImageUrl())
            .viewedAt(history.getViewedAt())
            .build();
    }

    private PointsHistoryResponseDTO toPointsResponse(UserPointsHistory history) {
        return PointsHistoryResponseDTO.builder()
            .id(history.getId())
            .action(history.getAction())
            .points(history.getPoints())
            .referenceId(history.getReferenceId())
            .earnedAt(history.getEarnedAt())
            .build();
    }
}
