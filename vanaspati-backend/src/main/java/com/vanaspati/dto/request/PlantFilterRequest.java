package com.vanaspati.dto.request;

import lombok.Data;

@Data
public class PlantFilterRequest {
    private String system;
    private String ailment;
    private String type;
    private String region;
    private String sort;
    private int page = 0;
    private int size = 12;
}
