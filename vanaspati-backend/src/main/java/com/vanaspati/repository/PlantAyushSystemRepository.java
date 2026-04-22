package com.vanaspati.repository;

import com.vanaspati.model.PlantAyushSystem;
import com.vanaspati.model.id.PlantAyushSystemId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlantAyushSystemRepository extends JpaRepository<PlantAyushSystem, PlantAyushSystemId> {
}
