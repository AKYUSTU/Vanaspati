package com.vanaspati.service;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import com.vanaspati.dto.request.AiChatRequest;
import com.vanaspati.model.AilmentCategory;
import com.vanaspati.model.Plant;
import com.vanaspati.model.Remedy;
import com.vanaspati.model.enums.RemedyDifficulty;
import com.vanaspati.repository.AilmentCategoryRepository;
import com.vanaspati.repository.PlantRepository;
import com.vanaspati.repository.RemedyRepository;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AiChatServiceTest {

    @Mock
    private PlantRepository plantRepository;

    @Mock
    private RemedyRepository remedyRepository;

    @Mock
    private AilmentCategoryRepository ailmentCategoryRepository;

    @InjectMocks
    private AiChatService aiChatService;

    @Test
    void reply_whenQueryMatchesReturnsStructuredReferences() {
        Plant plant = Plant.builder().id(5L).commonName("Brahmi").scientificName("Bacopa monnieri").build();
        Remedy remedy = Remedy.builder().id(7L).name("Brahmi Calm Tea").forAilment("Stress").difficulty(RemedyDifficulty.BEGINNER).prepTimeMinutes(8).description("Calming tea").ratingAvg(BigDecimal.valueOf(4.4)).ratingCount(20).build();
        AilmentCategory ailment = AilmentCategory.builder().id(2L).name("Stress and Anxiety").slug("stress-anxiety").build();

        when(plantRepository.searchAutocomplete("stress"))
            .thenReturn(List.of(plant));
        when(remedyRepository.findTop5ByNameContainingIgnoreCaseOrForAilmentContainingIgnoreCase("stress", "stress"))
            .thenReturn(List.of(remedy));
        when(ailmentCategoryRepository.findTop5ByNameContainingIgnoreCaseOrSlugContainingIgnoreCase("stress", "stress"))
            .thenReturn(List.of(ailment));

        AiChatRequest request = new AiChatRequest();
        request.setMessage("stress");

        String reply = aiChatService.reply(request);

        assertTrue(reply.contains("Matching ailments:"));
        assertTrue(reply.contains("Stress and Anxiety"));
        assertTrue(reply.contains("Suggested remedies:"));
        assertTrue(reply.contains("Brahmi Calm Tea"));
        assertTrue(reply.contains("Relevant plants:"));
        assertTrue(reply.contains("Brahmi"));
        assertTrue(reply.contains("Safety note:"));
    }

    @Test
    void reply_whenBlankReturnsPrompt() {
        AiChatRequest request = new AiChatRequest();
        request.setMessage("   ");

        String reply = aiChatService.reply(request);

        assertTrue(reply.contains("Ask me about a plant, remedy, or ailment"));
    }

    @Test
    void reply_whenNoMatchUsesFallback() {
        AiChatRequest request = new AiChatRequest();
        request.setMessage("unknown topic");

        when(plantRepository.searchAutocomplete("unknown topic")).thenReturn(List.of());
        when(remedyRepository.findTop5ByNameContainingIgnoreCaseOrForAilmentContainingIgnoreCase("unknown topic", "unknown topic"))
            .thenReturn(List.of());
        when(ailmentCategoryRepository.findTop5ByNameContainingIgnoreCaseOrSlugContainingIgnoreCase("unknown topic", "unknown topic"))
            .thenReturn(List.of());

        String reply = aiChatService.reply(request);

        assertTrue(reply.contains("I could not find a direct match"));
    }
}
