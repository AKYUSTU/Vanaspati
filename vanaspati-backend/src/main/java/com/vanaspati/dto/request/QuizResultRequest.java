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
public class QuizResultRequest {

    @NotNull(message = "Score is required")
    private Integer score;

    @NotNull(message = "Total is required")
    private Integer total;

    private String nickname;
}
