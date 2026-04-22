package com.vanaspati.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlantUpsertRequest {

    @NotBlank
    private String commonName;

    @NotBlank
    private String scientificName;

    private String sanskritName;
    private String localNames;
    private String plantFamily;
    private String plantType;
    private String nativeRegion;
    private String description;
    private String morphology;
    private String identifyingFeatures;
    private String mainImageUrl;
    private String galleryImages;
    private String partsUsed;
    private String rasa;
    private String virya;
    private String vipaka;
    private String bodyParts;
    private String harvestMonths;
    private String bloomMonths;
    private String activeCompounds;
    private String precautions;
    private String contraindications;
    private Boolean isFeatured;
    private Boolean isActive;
}