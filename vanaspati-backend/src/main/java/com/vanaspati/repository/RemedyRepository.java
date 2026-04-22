package com.vanaspati.repository;

import com.vanaspati.model.Remedy;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RemedyRepository extends JpaRepository<Remedy, Long> {
	List<Remedy> findByAilment_Id(Long ailmentId);
	List<Remedy> findTop5ByNameContainingIgnoreCaseOrForAilmentContainingIgnoreCase(String name, String ailment);
}
