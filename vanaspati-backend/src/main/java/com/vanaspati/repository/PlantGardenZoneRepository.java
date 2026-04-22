package com.vanaspati.repository;

import com.vanaspati.model.PlantGardenZone;
import com.vanaspati.model.id.PlantGardenZoneId;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlantGardenZoneRepository extends JpaRepository<PlantGardenZone, PlantGardenZoneId> {
	List<PlantGardenZone> findByZone_Id(Long zoneId);
	int countByZone_Id(Long zoneId);
	boolean existsByPlant_IdAndZone_Id(Long plantId, Long zoneId);
	Optional<PlantGardenZone> findByPlant_IdAndZone_Id(Long plantId, Long zoneId);
	void deleteByPlant_IdAndZone_Id(Long plantId, Long zoneId);
	void deleteByZone_Id(Long zoneId);
}
