package com.vanaspati.dto.request;

import jakarta.validation.constraints.NotBlank;
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
public class GardenZoneUpsertRequest {

    @NotBlank(message = "Zone name is required")
    private String zoneName;

    private String description;
    private String svgPathData;
    private Integer svgCx;
    private Integer svgCy;
    private String colorHex;
    private String iconEmoji;
}
