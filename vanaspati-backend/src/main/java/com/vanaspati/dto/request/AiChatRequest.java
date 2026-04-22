package com.vanaspati.dto.request;

import java.util.List;
import lombok.Data;

@Data
public class AiChatRequest {

    private String message;
    private List<ChatMessage> history;

    @Data
    public static class ChatMessage {
        private String role;
        private String content;
    }
}
