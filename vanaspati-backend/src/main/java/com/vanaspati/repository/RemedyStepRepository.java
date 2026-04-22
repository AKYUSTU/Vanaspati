package com.vanaspati.repository;

import com.vanaspati.model.RemedyStep;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RemedyStepRepository extends JpaRepository<RemedyStep, Long> {
    List<RemedyStep> findByRemedy_IdOrderByStepNumber(Long remedyId);
}
