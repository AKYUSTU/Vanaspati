package com.vanaspati.model;

import com.vanaspati.model.enums.RemedyDifficulty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
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
@Table(name = "remedies")
public class Remedy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "for_ailment", length = 200)
    private String forAilment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ailment_id")
    private AilmentCategory ailment;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty")
    private RemedyDifficulty difficulty;

    @Column(name = "prep_time_minutes")
    private Integer prepTimeMinutes;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "precautions", columnDefinition = "text")
    private String precautions;

    @Column(name = "rating_avg", precision = 3, scale = 2)
    private BigDecimal ratingAvg;

    @Column(name = "rating_count")
    private Integer ratingCount;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
