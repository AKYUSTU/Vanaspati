package com.vanaspati.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vanaspati.config.JwtAuthFilter;
import com.vanaspati.dto.request.GardenZoneUpsertRequest;
import com.vanaspati.dto.response.GardenZoneDTO;
import com.vanaspati.dto.response.GardenZonePlantsDTO;
import com.vanaspati.dto.response.PlantSummaryDTO;
import com.vanaspati.service.GardenService;
import java.security.Principal;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = GardenController.class)
@AutoConfigureMockMvc(addFilters = false)
class GardenControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private GardenService gardenService;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @Test
    void getZones_returnsZonesForAnonymous() throws Exception {
        when(gardenService.getZones(null)).thenReturn(List.of(
            GardenZoneDTO.builder().id(1L).zoneName("Healing Herbs").systemName("AYURVEDA").plantCount(3).build()
        ));

        mockMvc.perform(get("/api/garden/zones"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(1))
            .andExpect(jsonPath("$[0].zoneName").value("Healing Herbs"))
            .andExpect(jsonPath("$[0].systemName").value("AYURVEDA"));
    }

    @Test
    void getZonePlants_returnsZoneAndPlants() throws Exception {
        PlantSummaryDTO plant = new PlantSummaryDTO();
        plant.setId(9L);
        plant.setCommonName("Moringa");
        plant.setScientificName("Moringa oleifera");

        GardenZonePlantsDTO payload = GardenZonePlantsDTO.builder()
            .zone(GardenZoneDTO.builder().id(2L).zoneName("Personal Zone").build())
            .plants(List.of(plant))
            .build();

        when(gardenService.getZonePlants(2L, "user@example.com")).thenReturn(payload);

        mockMvc.perform(get("/api/garden/zones/2/plants").principal((Principal) () -> "user@example.com"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.zone.id").value(2))
            .andExpect(jsonPath("$.plants[0].commonName").value("Moringa"));
    }

    @Test
    void createZone_withInvalidBody_returnsBadRequest() throws Exception {
        GardenZoneUpsertRequest invalid = GardenZoneUpsertRequest.builder()
            .zoneName("")
            .description("desc")
            .build();

        mockMvc.perform(post("/api/garden/zones")
                .principal((Principal) () -> "user@example.com")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalid)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.status").value(400))
            .andExpect(jsonPath("$.path").value("/api/garden/zones"));
    }

    @Test
    void createZone_withValidBody_returnsCreated() throws Exception {
        GardenZoneUpsertRequest request = GardenZoneUpsertRequest.builder()
            .zoneName("My Herbal Corner")
            .description("Custom zone")
            .colorHex("#4A8C5C")
            .iconEmoji("ZG")
            .build();

        when(gardenService.createZone(eq("user@example.com"), any(GardenZoneUpsertRequest.class)))
            .thenReturn(GardenZoneDTO.builder().id(99L).zoneName("My Herbal Corner").userOwned(true).build());

        mockMvc.perform(post("/api/garden/zones")
                .principal((Principal) () -> "user@example.com")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(99))
            .andExpect(jsonPath("$.zoneName").value("My Herbal Corner"))
            .andExpect(jsonPath("$.userOwned").value(true));
    }
}
