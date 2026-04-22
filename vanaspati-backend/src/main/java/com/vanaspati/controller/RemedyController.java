package com.vanaspati.controller;

import com.vanaspati.dto.request.RemedyUpsertRequest;
import com.vanaspati.dto.response.RemedyDetailDTO;
import com.vanaspati.dto.response.RemedySummaryDTO;
import com.vanaspati.service.RemedyService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/remedies")
@RequiredArgsConstructor
public class RemedyController {

    private final RemedyService remedyService;

    @GetMapping
    public ResponseEntity<List<RemedySummaryDTO>> getRemedies() {
        return ResponseEntity.ok(remedyService.getAllRemedies());
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<RemedySummaryDTO>> getRemediesPaged(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "12") int size,
        @RequestParam(defaultValue = "newest") String sortBy
    ) {
        return ResponseEntity.ok(remedyService.getRemediesPaged(page, size, sortBy));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<RemedySummaryDTO>> searchRemedies(
        @RequestParam(required = false) String query,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "12") int size
    ) {
        return ResponseEntity.ok(remedyService.searchRemedies(query, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RemedyDetailDTO> getRemedy(@PathVariable Long id) {
        return ResponseEntity.ok(remedyService.getRemedyById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RemedyDetailDTO> createRemedy(@Valid @RequestBody RemedyUpsertRequest request) {
        RemedyDetailDTO remedy = remedyService.createRemedy(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(remedy);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RemedyDetailDTO> updateRemedy(
        @PathVariable Long id,
        @Valid @RequestBody RemedyUpsertRequest request
    ) {
        RemedyDetailDTO remedy = remedyService.updateRemedy(id, request);
        return ResponseEntity.ok(remedy);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRemedy(@PathVariable Long id) {
        remedyService.deleteRemedy(id);
        return ResponseEntity.noContent().build();
    }
}
