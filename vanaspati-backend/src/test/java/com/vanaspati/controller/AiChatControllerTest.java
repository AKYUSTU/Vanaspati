package com.vanaspati.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vanaspati.config.JwtAuthFilter;
import com.vanaspati.dto.request.AiChatRequest;
import com.vanaspati.service.AiChatService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(controllers = AiChatController.class)
@AutoConfigureMockMvc(addFilters = false)
class AiChatControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AiChatService aiChatService;

    @MockBean
    private JwtAuthFilter jwtAuthFilter;

    @Test
    void chat_returnsReplyPayload() throws Exception {
        AiChatRequest request = new AiChatRequest();
        request.setMessage("best herbs for stress");

        when(aiChatService.reply(any(AiChatRequest.class))).thenReturn("Suggested remedies:\n- Brahmi -> /plants/5/brahmi");

        mockMvc.perform(post("/api/ai/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.reply").exists())
            .andExpect(jsonPath("$.reply").value(org.hamcrest.Matchers.containsString("Suggested remedies")));
    }
}
