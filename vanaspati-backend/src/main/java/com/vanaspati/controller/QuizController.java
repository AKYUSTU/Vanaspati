package com.vanaspati.controller;

import com.vanaspati.dto.request.QuizQuestionRequest;
import com.vanaspati.dto.request.QuizResultRequest;
import com.vanaspati.dto.response.PlantQuizScoreDTO;
import com.vanaspati.dto.response.QuizQuestionDTO;
import com.vanaspati.service.QuizService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
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
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @GetMapping("/dosha/questions")
    public ResponseEntity<List<QuizQuestionDTO>> getDoshaQuestions() {
        return ResponseEntity.ok(quizService.getAllQuestions());
    }

    @PostMapping("/dosha/result")
    public ResponseEntity<PlantQuizScoreDTO> saveDoshaResult(
        @Valid @RequestBody QuizResultRequest request,
        Principal principal
    ) {
        PlantQuizScoreDTO result = quizService.saveQuizResult(principal.getName(), request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/plant/leaderboard")
    public ResponseEntity<List<PlantQuizScoreDTO>> getLeaderboard(
        @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(quizService.getLeaderboard(limit));
    }

    @GetMapping("/plant/scores")
    public ResponseEntity<List<PlantQuizScoreDTO>> getUserScores(Principal principal) {
        return ResponseEntity.ok(quizService.getUserScores(principal.getName()));
    }

    @PostMapping("/admin/questions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuizQuestionDTO> createQuestion(@Valid @RequestBody QuizQuestionRequest request) {
        QuizQuestionDTO question = quizService.createQuestion(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(question);
    }

    @GetMapping("/admin/questions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuizQuestionDTO> getQuestion(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuestionById(id));
    }

    @PutMapping("/admin/questions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuizQuestionDTO> updateQuestion(
        @PathVariable Long id,
        @Valid @RequestBody QuizQuestionRequest request
    ) {
        QuizQuestionDTO question = quizService.updateQuestion(id, request);
        return ResponseEntity.ok(question);
    }

    @DeleteMapping("/admin/questions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        quizService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}
