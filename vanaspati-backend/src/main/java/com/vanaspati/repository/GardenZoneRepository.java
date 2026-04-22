package com.vanaspati.repository;

import com.vanaspati.model.GardenZone;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GardenZoneRepository extends JpaRepository<GardenZone, Long> {
	List<GardenZone> findByUser_IdOrUserIsNullOrderByIdAsc(Long userId);
	Optional<GardenZone> findByIdAndUser_Id(Long id, Long userId);
	Optional<GardenZone> findByIdAndUserIsNull(Long id);
}
