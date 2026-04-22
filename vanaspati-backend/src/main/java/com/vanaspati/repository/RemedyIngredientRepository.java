package com.vanaspati.repository;

import com.vanaspati.model.RemedyIngredient;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RemedyIngredientRepository extends JpaRepository<RemedyIngredient, Long> {
    List<RemedyIngredient> findByRemedy_Id(Long remedyId);
}
