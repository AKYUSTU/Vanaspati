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
public class AilmentSummaryDTO {

    private Long id;
    private String name;
    private String slug;
    private String bodyPart;
    private String description;
    private int plantCount;
    private int remedyCount;
}
