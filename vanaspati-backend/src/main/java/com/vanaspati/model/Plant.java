package com.vanaspati.model;

import com.vanaspati.model.enums.PlantType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
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
@Table(name = "plants")
public class Plant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "common_name", nullable = false, length = 100)
    private String commonName;

    @Column(name = "scientific_name", nullable = false, unique = true, length = 150)
    private String scientificName;

    @Column(name = "sanskrit_name", length = 100)
    private String sanskritName;

    @Column(name = "local_names", columnDefinition = "json")
    private String localNames;

    @Column(name = "plant_family", length = 100)
    private String plantFamily;

    @Enumerated(EnumType.STRING)
    @Column(name = "plant_type")
    private PlantType plantType;

    @Column(name = "native_region", length = 200)
    private String nativeRegion;

    @Column(name = "native_lat", precision = 9, scale = 6)
    private BigDecimal nativeLat;

    @Column(name = "native_lng", precision = 9, scale = 6)
    private BigDecimal nativeLng;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "morphology", columnDefinition = "text")
    private String morphology;

    @Column(name = "identifying_features", columnDefinition = "text")
    private String identifyingFeatures;

    @Column(name = "main_image_url", length = 500)
    private String mainImageUrl;

    @Column(name = "gallery_images", columnDefinition = "json")
    private String galleryImages;

    @Column(name = "parts_used", length = 200)
    private String partsUsed;

    @Column(name = "rasa", length = 100)
    private String rasa;

    @Column(name = "virya", length = 50)
    private String virya;

    @Column(name = "vipaka", length = 50)
    private String vipaka;

    @Column(name = "body_parts", columnDefinition = "json")
    private String bodyParts;

    @Column(name = "harvest_months", columnDefinition = "json")
    private String harvestMonths;

    @Column(name = "bloom_months", columnDefinition = "json")
    private String bloomMonths;

    @Column(name = "active_compounds", columnDefinition = "text")
    private String activeCompounds;

    @Column(name = "precautions", columnDefinition = "text")
    private String precautions;

    @Column(name = "contraindications", columnDefinition = "text")
    private String contraindications;

    @Column(name = "is_featured")
    private Boolean isFeatured;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "view_count")
    private Integer viewCount;

    @Column(name = "bookmark_count")
    private Integer bookmarkCount;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
