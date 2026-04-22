package com.vanaspati.model;

import com.vanaspati.model.id.PlantAyushSystemId;
import jakarta.persistence.Column;
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
@Table(name = "plant_ayush_systems")
public class PlantAyushSystem {

    @EmbeddedId
    private PlantAyushSystemId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("plantId")
    @JoinColumn(name = "plant_id", nullable = false)
    private Plant plant;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("systemId")
    @JoinColumn(name = "system_id", nullable = false)
    private AyushSystem system;

    @Column(name = "system_specific_name", length = 150)
    private String systemSpecificName;

    @Column(name = "system_specific_uses", columnDefinition = "text")
    private String systemSpecificUses;

    @Column(name = "classical_text_ref", length = 300)
    private String classicalTextRef;

    @Column(name = "mizaj", length = 100)
    private String mizaj;

    @Column(name = "siddha_name", length = 100)
    private String siddhaName;

    @Column(name = "tincture_details", length = 300)
    private String tinctureDetails;
}
