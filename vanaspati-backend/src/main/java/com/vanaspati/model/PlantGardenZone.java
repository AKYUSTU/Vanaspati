package com.vanaspati.model;

import com.vanaspati.model.id.PlantGardenZoneId;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
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
@Table(name = "plant_garden_zones")
public class PlantGardenZone {

    @EmbeddedId
    private PlantGardenZoneId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("plantId")
    @JoinColumn(name = "plant_id")
    private Plant plant;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("zoneId")
    @JoinColumn(name = "zone_id")
    private GardenZone zone;
}
