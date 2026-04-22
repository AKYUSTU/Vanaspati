package com.vanaspati.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
@Table(name = "quiz_questions")
public class QuizQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "question_text", nullable = false, columnDefinition = "text")
    private String questionText;

    @Column(name = "option_a", columnDefinition = "text")
    private String optionA;

    @Column(name = "dosha_a", length = 10)
    private String doshaA;

    @Column(name = "option_b", columnDefinition = "text")
    private String optionB;

    @Column(name = "dosha_b", length = 10)
    private String doshaB;

    @Column(name = "option_c", columnDefinition = "text")
    private String optionC;

    @Column(name = "dosha_c", length = 10)
    private String doshaC;

    @Column(name = "display_order")
    private Integer displayOrder;
}
