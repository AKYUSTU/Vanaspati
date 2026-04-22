package com.vanaspati.dto.response;

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
public class QuizQuestionDTO {

    private Long id;
    private String questionText;
    private String optionA;
    private String doshaA;
    private String optionB;
    private String doshaB;
    private String optionC;
    private String doshaC;
    private Integer displayOrder;
}
