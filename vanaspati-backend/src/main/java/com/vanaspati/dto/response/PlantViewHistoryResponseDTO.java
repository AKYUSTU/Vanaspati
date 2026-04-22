package com.vanaspati.dto.response;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PlantViewHistoryResponseDTO {
    private Long id;
    private Long plantId;
    private String commonName;
    private String scientificName;
    private String mainImageUrl;
    private LocalDateTime viewedAt;
}