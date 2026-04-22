package com.vanaspati.repository;

import com.vanaspati.model.RemedyPlant;
import com.vanaspati.model.id.RemedyPlantId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RemedyPlantRepository extends JpaRepository<RemedyPlant, RemedyPlantId> {
}
