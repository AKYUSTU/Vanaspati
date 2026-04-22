package com.vanaspati.mapper;

import com.vanaspati.dto.response.PlantDetailDTO;
import com.vanaspati.dto.response.PlantSummaryDTO;
import com.vanaspati.model.Plant;
import java.util.List;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PlantMapper {

    PlantSummaryDTO toSummaryDto(Plant plant);

    List<PlantSummaryDTO> toSummaryDtoList(List<Plant> plants);

    PlantDetailDTO toDetailDto(Plant plant);
}
