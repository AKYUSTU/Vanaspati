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
public class GardenZonePlantsDTO {

    private GardenZoneDTO zone;
    private List<PlantSummaryDTO> plants;
}
