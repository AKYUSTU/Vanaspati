package com.vanaspati.repository;

import com.vanaspati.model.UserPointsHistory;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserPointsHistoryRepository extends JpaRepository<UserPointsHistory, Long> {
	List<UserPointsHistory> findAllByUserIdOrderByEarnedAtDesc(Long userId);
}
