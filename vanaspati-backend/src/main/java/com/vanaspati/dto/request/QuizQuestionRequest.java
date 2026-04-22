package com.vanaspati.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class QuizQuestionRequest {

    @NotBlank(message = "Question text is required")
    private String questionText;

    @NotBlank(message = "Option A is required")
    private String optionA;

    private String doshaA;

    @NotBlank(message = "Option B is required")
    private String optionB;

    private String doshaB;

    @NotBlank(message = "Option C is required")
    private String optionC;

    private String doshaC;

    private Integer displayOrder;
}
