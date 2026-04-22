package com.vanaspati.dto.response;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PointsHistoryResponseDTO {
    private Long id;
    private String action;
    private Integer points;
    private Long referenceId;
    private LocalDateTime earnedAt;
}