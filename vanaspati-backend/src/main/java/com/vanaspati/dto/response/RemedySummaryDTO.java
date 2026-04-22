package com.vanaspati.dto.response;

import com.vanaspati.model.enums.RemedyDifficulty;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
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
public class RemedySummaryDTO {

    private Long id;
    private String name;
    private String forAilment;
    private String ailmentName;
    private RemedyDifficulty difficulty;
    private Integer prepTimeMinutes;
    private String description;
    private BigDecimal ratingAvg;
    private Integer ratingCount;
    private LocalDateTime createdAt;
}
