package com.vanaspati.repository;

import com.vanaspati.model.PlantAilment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlantAilmentRepository extends JpaRepository<PlantAilment, Long> {
	List<PlantAilment> findByAilment_Id(Long ailmentId);
	int countByAilment_Id(Long ailmentId);
}
