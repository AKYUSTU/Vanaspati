package com.vanaspati.dto.request;

import com.vanaspati.model.enums.RemedyDifficulty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class RemedyUpsertRequest {

    @NotBlank(message = "Remedy name is required")
    private String name;

    private String forAilment;

    private Long ailmentId;

    @NotNull(message = "Difficulty is required")
    private RemedyDifficulty difficulty;

    private Integer prepTimeMinutes;

    @NotBlank(message = "Description is required")
    private String description;

    private String precautions;

    private List<IngredientInput> ingredients;

    private List<StepInput> steps;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IngredientInput {
        @NotBlank
        private String ingredientName;
        private String quantity;
        private String notes;
        private Long plantId;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StepInput {
        @NotNull
        private Integer stepNumber;
        @NotBlank
        private String instruction;
    }
}
