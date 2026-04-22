package com.vanaspati.dto.response;

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
public class AilmentDetailDTO {

    private Long id;
    private String name;
    private String slug;
    private String bodyPart;
    private String description;
    private List<PlantForAilmentDTO> plants;
    private List<RemedySummaryDTO> remedies;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlantForAilmentDTO {
        private Long plantId;
        private String commonName;
        private String scientificName;
        private String mainImageUrl;
        private String howUsed;
        private String dosageForm;
        private String notes;
    }
}
