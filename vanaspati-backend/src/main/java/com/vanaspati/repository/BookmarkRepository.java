package com.vanaspati.repository;

import com.vanaspati.model.Bookmark;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
	List<Bookmark> findAllByUserIdOrderByCreatedAtDesc(Long userId);

	boolean existsByUserIdAndPlantId(Long userId, Long plantId);

	Optional<Bookmark> findByUserIdAndPlantId(Long userId, Long plantId);
}
