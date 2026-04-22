package com.vanaspati.service;

import com.vanaspati.dto.request.QuizQuestionRequest;
import com.vanaspati.dto.request.QuizResultRequest;
import com.vanaspati.dto.response.PlantQuizScoreDTO;
import com.vanaspati.dto.response.QuizQuestionDTO;
import com.vanaspati.exception.ResourceNotFoundException;
import com.vanaspati.model.PlantQuizScore;
import com.vanaspati.model.QuizQuestion;
import com.vanaspati.model.User;
import com.vanaspati.repository.PlantQuizScoreRepository;
import com.vanaspati.repository.QuizQuestionRepository;
import com.vanaspati.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizQuestionRepository quizQuestionRepository;
    private final PlantQuizScoreRepository plantQuizScoreRepository;
    private final UserRepository userRepository;

    public List<QuizQuestionDTO> getAllQuestions() {
        return quizQuestionRepository.findAll().stream()
            .map(this::toDto)
            .toList();
    }

    public QuizQuestionDTO getQuestionById(Long id) {
        QuizQuestion question = quizQuestionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Quiz question not found: " + id));
        return toDto(question);
    }

    @Transactional
    public QuizQuestionDTO createQuestion(QuizQuestionRequest request) {
        QuizQuestion question = QuizQuestion.builder()
            .questionText(request.getQuestionText())
            .optionA(request.getOptionA())
            .doshaA(request.getDoshaA())
            .optionB(request.getOptionB())
            .doshaB(request.getDoshaB())
            .optionC(request.getOptionC())
            .doshaC(request.getDoshaC())
            .displayOrder(request.getDisplayOrder())
            .build();
        QuizQuestion saved = quizQuestionRepository.save(question);
        return toDto(saved);
    }

    @Transactional
    public QuizQuestionDTO updateQuestion(Long id, QuizQuestionRequest request) {
        QuizQuestion question = quizQuestionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Quiz question not found: " + id));
        question.setQuestionText(request.getQuestionText());
        question.setOptionA(request.getOptionA());
        question.setDoshaA(request.getDoshaA());
        question.setOptionB(request.getOptionB());
        question.setDoshaB(request.getDoshaB());
        question.setOptionC(request.getOptionC());
        question.setDoshaC(request.getDoshaC());
        if (request.getDisplayOrder() != null) {
            question.setDisplayOrder(request.getDisplayOrder());
        }
        QuizQuestion saved = quizQuestionRepository.save(question);
        return toDto(saved);
    }

    @Transactional
    public void deleteQuestion(Long id) {
        QuizQuestion question = quizQuestionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Quiz question not found: " + id));
        quizQuestionRepository.delete(question);
    }

    @Transactional
    public PlantQuizScoreDTO saveQuizResult(String userEmail, QuizResultRequest request) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));
        
        PlantQuizScore score = PlantQuizScore.builder()
            .user(user)
            .score(request.getScore())
            .total(request.getTotal())
            .nickname(request.getNickname() != null ? request.getNickname() : user.getName())
            .playedAt(LocalDateTime.now())
            .build();
        
        PlantQuizScore saved = plantQuizScoreRepository.save(score);
        return toScoreDto(saved);
    }

    public List<PlantQuizScoreDTO> getLeaderboard(int limit) {
        return plantQuizScoreRepository.findAll().stream()
            .sorted((a, b) -> {
                double percentA = (double) a.getScore() / a.getTotal();
                double percentB = (double) b.getScore() / b.getTotal();
                return Double.compare(percentB, percentA);
            })
            .limit(limit)
            .map(this::toScoreDto)
            .toList();
    }

    public List<PlantQuizScoreDTO> getUserScores(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));
        
        return plantQuizScoreRepository.findAll().stream()
            .filter(score -> score.getUser().getId().equals(user.getId()))
            .sorted((a, b) -> b.getPlayedAt().compareTo(a.getPlayedAt()))
            .map(this::toScoreDto)
            .toList();
    }

    private QuizQuestionDTO toDto(QuizQuestion question) {
        return QuizQuestionDTO.builder()
            .id(question.getId())
            .questionText(question.getQuestionText())
            .optionA(question.getOptionA())
            .doshaA(question.getDoshaA())
            .optionB(question.getOptionB())
            .doshaB(question.getDoshaB())
            .optionC(question.getOptionC())
            .doshaC(question.getDoshaC())
            .displayOrder(question.getDisplayOrder())
            .build();
    }

    private PlantQuizScoreDTO toScoreDto(PlantQuizScore score) {
        return PlantQuizScoreDTO.builder()
            .id(score.getId())
            .userId(score.getUser().getId())
            .userName(score.getUser().getName())
            .nickname(score.getNickname())
            .score(score.getScore())
            .total(score.getTotal())
            .playedAt(score.getPlayedAt())
            .build();
    }
}
