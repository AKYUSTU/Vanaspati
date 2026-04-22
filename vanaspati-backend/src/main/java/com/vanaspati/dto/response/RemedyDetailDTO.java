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
public class RemedyDetailDTO {

    private Long id;
    private String name;
    private String forAilment;
    private String ailmentName;
    private RemedyDifficulty difficulty;
    private Integer prepTimeMinutes;
    private String description;
    private String precautions;
    private BigDecimal ratingAvg;
    private Integer ratingCount;
    private LocalDateTime createdAt;
    private List<IngredientDTO> ingredients;
    private List<StepDTO> steps;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IngredientDTO {
        private Long id;
        private String ingredientName;
        private String quantity;
        private String notes;
        private Long plantId;
        private String plantName;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StepDTO {
        private Long id;
        private Integer stepNumber;
        private String instruction;
    }
}
