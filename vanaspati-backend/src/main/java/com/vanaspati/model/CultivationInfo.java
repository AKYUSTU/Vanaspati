package com.vanaspati.model;

import com.vanaspati.model.enums.SunlightType;
import com.vanaspati.model.enums.WaterNeedsType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "cultivation_info")
public class CultivationInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plant_id", nullable = false, unique = true)
    private Plant plant;

    @Column(name = "soil_type", length = 200)
    private String soilType;

    @Column(name = "ph_min", precision = 4, scale = 2)
    private BigDecimal phMin;

    @Column(name = "ph_max", precision = 4, scale = 2)
    private BigDecimal phMax;

    @Enumerated(EnumType.STRING)
    @Column(name = "sunlight")
    private SunlightType sunlight;

    @Enumerated(EnumType.STRING)
    @Column(name = "water_needs")
    private WaterNeedsType waterNeeds;

    @Column(name = "best_season", length = 100)
    private String bestSeason;

    @Column(name = "propagation_method", length = 200)
    private String propagationMethod;

    @Column(name = "growth_duration", length = 100)
    private String growthDuration;

    @Column(name = "companion_plants", length = 300)
    private String companionPlants;

    @Column(name = "grow_at_home_tips", columnDefinition = "text")
    private String growAtHomeTips;
}
