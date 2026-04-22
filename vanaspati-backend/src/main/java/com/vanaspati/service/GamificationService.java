package com.vanaspati.service;

import com.vanaspati.model.User;
import com.vanaspati.model.UserPointsHistory;
import com.vanaspati.model.enums.UserLevel;
import com.vanaspati.repository.UserPointsHistoryRepository;
import com.vanaspati.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GamificationService {

    private final UserRepository userRepository;
    private final UserPointsHistoryRepository userPointsHistoryRepository;

    @Transactional
    public void awardPoints(Long userId, String action, int points, Long referenceId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        int currentPoints = user.getPoints() == null ? 0 : user.getPoints();
        int updatedPoints = currentPoints + points;
        user.setPoints(updatedPoints);
        user.setLevel(resolveLevel(updatedPoints));
        userRepository.save(user);

        UserPointsHistory history = UserPointsHistory.builder()
            .user(user)
            .action(action)
            .points(points)
            .referenceId(referenceId)
            .build();
        userPointsHistoryRepository.save(history);
    }

    private UserLevel resolveLevel(int points) {
        if (points >= 600) {
            return UserLevel.VAIDYA;
        }
        if (points >= 300) {
            return UserLevel.HERBALIST;
        }
        if (points >= 150) {
            return UserLevel.SAPLING;
        }
        if (points >= 50) {
            return UserLevel.SPROUT;
        }
        return UserLevel.SEED;
    }
}
