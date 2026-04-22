package com.vanaspati.dto.response;

import lombok.Data;

@Data
public class PlantSummaryDTO {
    private Long id;
    private String commonName;
    private String scientificName;
    private String sanskritName;
    private String mainImageUrl;
    private String description;
}
