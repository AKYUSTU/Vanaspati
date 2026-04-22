package com.vanaspati.repository;

import com.vanaspati.model.PlantViewHistory;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlantViewHistoryRepository extends JpaRepository<PlantViewHistory, Long> {
	List<PlantViewHistory> findAllByUserIdOrderByViewedAtDesc(Long userId);

	void deleteAllByUserId(Long userId);
}
