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
public class GardenZoneDTO {

    private Long id;
    private String zoneName;
    private String zoneKey;
    private String description;
    private String systemName;
    private String svgPathData;
    private Integer svgCx;
    private Integer svgCy;
    private String colorHex;
    private String iconEmoji;
    private boolean userOwned;
    private int plantCount;
}
