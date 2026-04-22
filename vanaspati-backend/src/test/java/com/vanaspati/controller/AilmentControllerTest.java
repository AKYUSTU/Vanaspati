package com.vanaspati.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.vanaspati.config.JwtAuthFilter;
import com.vanaspati.dto.response.AilmentDetailDTO;
import com.vanaspati.dto.response.AilmentSummaryDTO;
import com.vanaspati.exception.ResourceNotFoundException;
import com.vanaspati.service.AilmentService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = AilmentController.class)
@AutoConfigureMockMvc(addFilters = false)
class AilmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AilmentService ailmentService;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @Test
    void getAilments_returnsSummaryList() throws Exception {
        when(ailmentService.getAilments()).thenReturn(List.of(
            AilmentSummaryDTO.builder().id(1L).name("Fever").slug("fever").plantCount(8).remedyCount(3).build()
        ));

        mockMvc.perform(get("/api/ailments"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].name").value("Fever"))
            .andExpect(jsonPath("$[0].plantCount").value(8));
    }

    @Test
    void getAilment_returnsDetail() throws Exception {
        when(ailmentService.getAilmentDetail(1L)).thenReturn(
            AilmentDetailDTO.builder().id(1L).name("Fever").description("Body heat").build()
        );

        mockMvc.perform(get("/api/ailments/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.name").value("Fever"));
    }

    @Test
    void getAilment_whenMissing_returnsNotFoundErrorContract() throws Exception {
        when(ailmentService.getAilmentDetail(777L)).thenThrow(new ResourceNotFoundException("Ailment not found: 777"));

        mockMvc.perform(get("/api/ailments/777"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.status").value(404))
            .andExpect(jsonPath("$.error").value("Not Found"))
            .andExpect(jsonPath("$.message").value("Ailment not found: 777"))
            .andExpect(jsonPath("$.path").value("/api/ailments/777"));
    }
}
