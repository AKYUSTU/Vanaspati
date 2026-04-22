package com.vanaspati.repository;

import com.vanaspati.model.CultivationInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CultivationInfoRepository extends JpaRepository<CultivationInfo, Long> {
}
