package com.vanaspati.model.id;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class PlantAyushSystemId implements Serializable {

    @Column(name = "plant_id")
    private Long plantId;

    @Column(name = "system_id")
    private Long systemId;
}
