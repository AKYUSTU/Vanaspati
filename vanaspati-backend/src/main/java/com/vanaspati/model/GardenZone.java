package com.vanaspati.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "garden_zones")
public class GardenZone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "zone_name", nullable = false, length = 100)
    private String zoneName;

    @Column(name = "zone_key", unique = true, length = 50)
    private String zoneKey;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ayush_system_id")
    private AyushSystem ayushSystem;

    @Column(name = "svg_path_data", columnDefinition = "text")
    private String svgPathData;

    @Column(name = "svg_cx")
    private Integer svgCx;

    @Column(name = "svg_cy")
    private Integer svgCy;

    @Column(name = "color_hex", length = 10)
    private String colorHex;

    @Column(name = "icon_emoji", length = 10)
    private String iconEmoji;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
