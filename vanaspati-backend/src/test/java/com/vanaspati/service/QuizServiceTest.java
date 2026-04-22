package com.vanaspati.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

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
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class QuizServiceTest {

    @Mock
    private QuizQuestionRepository quizQuestionRepository;

    @Mock
    private PlantQuizScoreRepository plantQuizScoreRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private QuizService quizService;

    @Test
    void createQuestion_mapsRequestAndReturnsDto() {
        QuizQuestionRequest request = QuizQuestionRequest.builder()
            .questionText("Which herb helps memory?")
            .optionA("Tulsi")
            .doshaA("Vata")
            .optionB("Brahmi")
            .doshaB("Pitta")
            .optionC("Neem")
            .doshaC("Kapha")
            .displayOrder(1)
            .build();

        QuizQuestion saved = QuizQuestion.builder()
            .id(12L)
            .questionText(request.getQuestionText())
            .optionA(request.getOptionA())
            .doshaA(request.getDoshaA())
            .optionB(request.getOptionB())
            .doshaB(request.getDoshaB())
            .optionC(request.getOptionC())
            .doshaC(request.getDoshaC())
            .displayOrder(1)
            .build();

        when(quizQuestionRepository.save(any(QuizQuestion.class))).thenReturn(saved);

        QuizQuestionDTO result = quizService.createQuestion(request);

        assertEquals(12L, result.getId());
        assertEquals("Which herb helps memory?", result.getQuestionText());
        assertEquals("Brahmi", result.getOptionB());
    }

    @Test
    void saveQuizResult_usesFallbackNicknameFromUser() {
        User user = User.builder().id(3L).name("Asha").email("asha@example.com").passwordHash("x").build();
        QuizResultRequest request = QuizResultRequest.builder().score(4).total(5).nickname(null).build();

        PlantQuizScore saved = PlantQuizScore.builder()
            .id(99L)
            .user(user)
            .nickname("Asha")
            .score(4)
            .total(5)
            .playedAt(LocalDateTime.now())
            .build();

        when(userRepository.findByEmail("asha@example.com")).thenReturn(Optional.of(user));
        when(plantQuizScoreRepository.save(any(PlantQuizScore.class))).thenReturn(saved);

        PlantQuizScoreDTO result = quizService.saveQuizResult("asha@example.com", request);

        assertEquals("Asha", result.getNickname());
        assertEquals(4, result.getScore());
        assertEquals(5, result.getTotal());
    }

    @Test
    void getLeaderboard_ordersByScorePercentDescending() {
        User u1 = User.builder().id(1L).name("U1").email("u1@example.com").passwordHash("x").build();
        User u2 = User.builder().id(2L).name("U2").email("u2@example.com").passwordHash("x").build();

        PlantQuizScore low = PlantQuizScore.builder().id(1L).user(u1).nickname("u1").score(3).total(5).playedAt(LocalDateTime.now()).build();
        PlantQuizScore high = PlantQuizScore.builder().id(2L).user(u2).nickname("u2").score(9).total(10).playedAt(LocalDateTime.now()).build();

        when(plantQuizScoreRepository.findAll()).thenReturn(List.of(low, high));

        List<PlantQuizScoreDTO> leaderboard = quizService.getLeaderboard(5);

        assertEquals(2, leaderboard.size());
        assertEquals("U2", leaderboard.get(0).getUserName());
    }

    @Test
    void getUserScores_whenUserMissing_throwsNotFound() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> quizService.getUserScores("missing@example.com"));
    }
}
