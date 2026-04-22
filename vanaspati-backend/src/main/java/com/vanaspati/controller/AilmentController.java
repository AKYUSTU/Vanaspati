package com.vanaspati.controller;

import com.vanaspati.dto.response.AilmentDetailDTO;
import com.vanaspati.dto.response.AilmentSummaryDTO;
import com.vanaspati.dto.response.RemedySummaryDTO;
import com.vanaspati.service.AilmentService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ailments")
@RequiredArgsConstructor
public class AilmentController {

    private final AilmentService ailmentService;

    @GetMapping
    public ResponseEntity<List<AilmentSummaryDTO>> getAilments() {
        return ResponseEntity.ok(ailmentService.getAilments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AilmentDetailDTO> getAilment(@PathVariable Long id) {
        return ResponseEntity.ok(ailmentService.getAilmentDetail(id));
    }

    @GetMapping("/{id}/remedies")
    public ResponseEntity<List<RemedySummaryDTO>> getAilmentRemedies(@PathVariable Long id) {
        return ResponseEntity.ok(ailmentService.getAilmentRemedies(id));
    }
}
