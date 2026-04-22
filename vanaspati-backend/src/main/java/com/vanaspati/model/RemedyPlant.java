package com.vanaspati.model;

import com.vanaspati.model.id.RemedyPlantId;
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
@Table(name = "remedy_plants")
public class RemedyPlant {

    @EmbeddedId
    private RemedyPlantId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("remedyId")
    @JoinColumn(name = "remedy_id")
    private Remedy remedy;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("plantId")
    @JoinColumn(name = "plant_id")
    private Plant plant;
}
