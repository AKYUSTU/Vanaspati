package com.vanaspati.repository;

import com.vanaspati.model.AilmentCategory;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AilmentCategoryRepository extends JpaRepository<AilmentCategory, Long> {
	List<AilmentCategory> findTop5ByNameContainingIgnoreCaseOrSlugContainingIgnoreCase(String name, String slug);
}
