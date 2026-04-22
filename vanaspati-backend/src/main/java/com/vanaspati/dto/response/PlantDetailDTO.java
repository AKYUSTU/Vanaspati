package com.vanaspati.dto.response;

import com.vanaspati.model.enums.PlantType;
import java.math.BigDecimal;
import lombok.Data;

@Data
public class PlantDetailDTO {
    private Long id;
    private String commonName;
    private String scientificName;
    private String sanskritName;
    private String localNames;
    private String plantFamily;
    private PlantType plantType;
    private String nativeRegion;
    private BigDecimal nativeLat;
    private BigDecimal nativeLng;
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
}
