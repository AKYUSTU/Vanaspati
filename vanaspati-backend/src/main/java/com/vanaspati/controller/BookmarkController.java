package com.vanaspati.controller;

import com.vanaspati.dto.response.BookmarkResponseDTO;
import com.vanaspati.exception.DuplicateResourceException;
import com.vanaspati.exception.ResourceNotFoundException;
import com.vanaspati.model.Bookmark;
import com.vanaspati.model.Plant;
import com.vanaspati.model.User;
import com.vanaspati.repository.BookmarkRepository;
import com.vanaspati.repository.PlantRepository;
import com.vanaspati.repository.UserRepository;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;
    private final PlantRepository plantRepository;

    @GetMapping
    public ResponseEntity<List<BookmarkResponseDTO>> getBookmarks(Authentication authentication) {
        User user = resolveCurrentUser(authentication);
        List<BookmarkResponseDTO> data = bookmarkRepository.findAllByUserIdOrderByCreatedAtDesc(user.getId())
            .stream()
            .map(this::toResponse)
            .toList();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/export")
    public ResponseEntity<String> exportBookmarks(Authentication authentication) {
        User user = resolveCurrentUser(authentication);
        List<Bookmark> bookmarks = bookmarkRepository.findAllByUserIdOrderByCreatedAtDesc(user.getId());

        StringBuilder csv = new StringBuilder();
        csv.append("plantId,commonName,scientificName,personalNote,createdAt\n");
        for (Bookmark bookmark : bookmarks) {
            Plant plant = bookmark.getPlant();
            csv.append(plant.getId()).append(',')
                .append(escapeCsv(plant.getCommonName())).append(',')
                .append(escapeCsv(plant.getScientificName())).append(',')
                .append(escapeCsv(bookmark.getPersonalNote())).append(',')
                .append(bookmark.getCreatedAt() == null ? "" : bookmark.getCreatedAt())
                .append('\n');
        }

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=bookmarks.csv")
            .contentType(MediaType.TEXT_PLAIN)
            .body(csv.toString());
    }

    @PostMapping("/{plantId}")
    @Transactional
    public ResponseEntity<Void> addBookmark(@PathVariable Long plantId, Authentication authentication) {
        User user = resolveCurrentUser(authentication);
        Plant plant = plantRepository.findById(plantId)
            .orElseThrow(() -> new ResourceNotFoundException("Plant not found: " + plantId));

        if (bookmarkRepository.existsByUserIdAndPlantId(user.getId(), plantId)) {
            throw new DuplicateResourceException("Plant is already bookmarked");
        }

        Bookmark bookmark = Bookmark.builder()
            .user(user)
            .plant(plant)
            .createdAt(java.time.LocalDateTime.now())
            .build();
        bookmarkRepository.save(bookmark);

        plant.setBookmarkCount((plant.getBookmarkCount() == null ? 0 : plant.getBookmarkCount()) + 1);
        plantRepository.save(plant);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{plantId}")
    @Transactional
    public ResponseEntity<Void> removeBookmark(@PathVariable Long plantId, Authentication authentication) {
        User user = resolveCurrentUser(authentication);
        Bookmark bookmark = bookmarkRepository.findByUserIdAndPlantId(user.getId(), plantId)
            .orElseThrow(() -> new ResourceNotFoundException("Bookmark not found for plant: " + plantId));

        bookmarkRepository.delete(bookmark);

        Plant plant = bookmark.getPlant();
        int current = plant.getBookmarkCount() == null ? 0 : plant.getBookmarkCount();
        plant.setBookmarkCount(Math.max(0, current - 1));
        plantRepository.save(plant);
        return ResponseEntity.noContent().build();
    }

    private User resolveCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new ResourceNotFoundException("Authenticated user not found");
        }
        return userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + authentication.getName()));
    }

    private BookmarkResponseDTO toResponse(Bookmark bookmark) {
        Plant plant = bookmark.getPlant();
        return BookmarkResponseDTO.builder()
            .id(bookmark.getId())
            .plantId(plant.getId())
            .commonName(plant.getCommonName())
            .scientificName(plant.getScientificName())
            .mainImageUrl(plant.getMainImageUrl())
            .personalNote(bookmark.getPersonalNote())
            .createdAt(bookmark.getCreatedAt())
            .build();
    }

    private String escapeCsv(String value) {
        if (value == null) {
            return "\"\"";
        }
        return "\"" + value.replace("\"", "\"\"") + "\"";
    }
}
