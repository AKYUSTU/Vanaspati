package com.vanaspati.dto.response;

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
public class PlantQuizScoreDTO {

    private Long id;
    private Long userId;
    private String userName;
    private String nickname;
    private Integer score;
    private Integer total;
    private LocalDateTime playedAt;
}
