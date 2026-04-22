package com.vanaspati.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.vanaspati.model.User;
import com.vanaspati.model.UserPointsHistory;
import com.vanaspati.model.enums.UserLevel;
import com.vanaspati.repository.UserPointsHistoryRepository;
import com.vanaspati.repository.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class GamificationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserPointsHistoryRepository userPointsHistoryRepository;

    @InjectMocks
    private GamificationService gamificationService;

    @Test
    void awardPoints_whenUserMissing_throwsNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
            () -> gamificationService.awardPoints(99L, "QUIZ_WIN", 20, 7L));
        assertEquals("User not found: 99", ex.getMessage());
    }

    @Test
    void awardPoints_updatesPointsLevelAndHistory() {
        User user = User.builder().id(1L).name("Asha").email("asha@example.com").passwordHash("x").points(40).level(UserLevel.SEED).build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        gamificationService.awardPoints(1L, "QUIZ_WIN", 15, 7L);

        assertEquals(55, user.getPoints());
        assertEquals(UserLevel.SPROUT, user.getLevel());
        verify(userRepository).save(user);

        ArgumentCaptor<UserPointsHistory> historyCaptor = ArgumentCaptor.forClass(UserPointsHistory.class);
        verify(userPointsHistoryRepository).save(historyCaptor.capture());
        UserPointsHistory history = historyCaptor.getValue();
        assertEquals(user, history.getUser());
        assertEquals("QUIZ_WIN", history.getAction());
        assertEquals(15, history.getPoints());
        assertEquals(7L, history.getReferenceId());
    }

    @Test
    void awardPoints_crossesTopThreshold_assignsVaidyaLevel() {
        User user = User.builder().id(2L).name("Dev").email("dev@example.com").passwordHash("x").points(590).level(UserLevel.HERBALIST).build();
        when(userRepository.findById(2L)).thenReturn(Optional.of(user));

        gamificationService.awardPoints(2L, "CONTRIBUTION", 20, null);

        assertEquals(610, user.getPoints());
        assertEquals(UserLevel.VAIDYA, user.getLevel());
    }
}
