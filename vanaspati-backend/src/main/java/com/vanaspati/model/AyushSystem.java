package com.vanaspati.model;

import com.vanaspati.model.enums.AyushSystemName;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
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
@Table(name = "ayush_systems")
public class AyushSystem {

    @Id
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "name", unique = true)
    private AyushSystemName name;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "origin_text", columnDefinition = "text")
    private String originText;

    @Column(name = "color_hex", length = 10)
    private String colorHex;

    @Column(name = "icon_emoji", length = 10)
    private String iconEmoji;

    @Column(name = "plant_count")
    private Integer plantCount;
}
