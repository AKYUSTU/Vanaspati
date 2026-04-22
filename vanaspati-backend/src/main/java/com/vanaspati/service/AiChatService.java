package com.vanaspati.service;

import com.vanaspati.dto.request.AiChatRequest;
import com.vanaspati.model.AilmentCategory;
import com.vanaspati.model.Plant;
import com.vanaspati.model.Remedy;
import com.vanaspati.repository.AilmentCategoryRepository;
import com.vanaspati.repository.PlantRepository;
import com.vanaspati.repository.RemedyRepository;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AiChatService {

    private static final List<String> SYSTEM_TERMS = List.of("ayurveda", "yoga", "unani", "siddha", "homeopathy");

    private final PlantRepository plantRepository;
    private final RemedyRepository remedyRepository;
    private final AilmentCategoryRepository ailmentCategoryRepository;

    public String reply(AiChatRequest request) {
        String message = request.getMessage() == null ? "" : request.getMessage().trim();
        String normalized = message.toLowerCase(Locale.ROOT);

        if (normalized.isBlank()) {
            return "Ask me about a plant, remedy, or ailment. Example: 'best remedies for cough' or 'tell me about tulsi'.";
        }

        if (isGreeting(normalized)) {
            return "Hello. I can guide you with plants, remedies, and ailments from your Vanaspati database. Try asking 'best plants for stress' or 'remedies for digestion'.";
        }

        RetrievalResult result = retrieveKnowledge(normalized);
        if (!result.hasAny()) {
            return fallbackResponse(normalized);
        }

        return formatResponse(normalized, result);
    }

    private RetrievalResult retrieveKnowledge(String normalized) {
        Map<Long, Plant> plantMap = new LinkedHashMap<>();
        Map<Long, Remedy> remedyMap = new LinkedHashMap<>();
        Map<Long, AilmentCategory> ailmentMap = new LinkedHashMap<>();

        addPlants(plantMap, plantRepository.searchAutocomplete(normalized));
        addRemedies(remedyMap, remedyRepository.findTop5ByNameContainingIgnoreCaseOrForAilmentContainingIgnoreCase(normalized, normalized));
        addAilments(ailmentMap, ailmentCategoryRepository.findTop5ByNameContainingIgnoreCaseOrSlugContainingIgnoreCase(normalized, normalized));

        List<String> tokens = tokenize(normalized);
        for (String token : tokens) {
            if (token.length() < 4) {
                continue;
            }
            if (plantMap.size() < 5) {
                addPlants(plantMap, plantRepository.searchAutocomplete(token));
            }
            if (remedyMap.size() < 5) {
                addRemedies(remedyMap, remedyRepository.findTop5ByNameContainingIgnoreCaseOrForAilmentContainingIgnoreCase(token, token));
            }
            if (ailmentMap.size() < 5) {
                addAilments(ailmentMap, ailmentCategoryRepository.findTop5ByNameContainingIgnoreCaseOrSlugContainingIgnoreCase(token, token));
            }
        }

        return new RetrievalResult(
            plantMap.values().stream().limit(5).toList(),
            remedyMap.values().stream().limit(5).toList(),
            ailmentMap.values().stream().limit(5).toList()
        );
    }

    private String formatResponse(String normalized, RetrievalResult result) {
        StringBuilder reply = new StringBuilder();

        if (result.hasAilments()) {
            reply.append("Matching ailments:\n");
            result.ailments().forEach(ailment -> reply
                .append("- ")
                .append(ailment.getName())
                .append(" -> /ailments/")
                .append(ailment.getId())
                .append("\n"));
            reply.append("\n");
        }

        if (result.hasRemedies()) {
            reply.append("Suggested remedies:\n");
            result.remedies().forEach(remedy -> reply
                .append("- ")
                .append(remedy.getName())
                .append(remedy.getForAilment() != null ? " (for " + remedy.getForAilment() + ")" : "")
                .append(" -> /remedies/")
                .append(remedy.getId())
                .append("\n"));
            reply.append("\n");
        }

        if (result.hasPlants()) {
            reply.append("Relevant plants:\n");
            result.plants().forEach(plant -> reply
                .append("- ")
                .append(plant.getCommonName())
                .append(" (")
                .append(plant.getScientificName())
                .append(") -> /plants/")
                .append(plant.getId())
                .append("/")
                .append(slugify(plant.getCommonName()))
                .append("\n"));
            reply.append("\n");
        }

        if (mentionsSystem(normalized)) {
            reply.append("Tip: You can filter plants by AYUSH system from the Plants page filter panel.\n\n");
        }

        reply.append("Safety note: herbal guidance is educational and not a medical diagnosis. For chronic conditions or medications, consult a qualified practitioner.");
        return reply.toString();
    }

    private String fallbackResponse(String normalized) {
        if (containsAny(normalized, "stress", "anxiety", "sleep")) {
            return "I could not find an exact match, but you can start with /ailments and check Stress and Anxiety or Better Sleep, then open linked remedies and plants.";
        }
        if (containsAny(normalized, "immunity", "cold", "flu", "cough")) {
            return "I could not find an exact match, but check /ailments for Immunity or Respiratory and then open linked remedies and plants like Tulsi, Giloy, and Amla.";
        }
        return "I could not find a direct match. Try naming a plant, ailment, or remedy keyword, for example: 'tulsi', 'digestion', or 'kadha'.";
    }

    private boolean isGreeting(String normalized) {
        return normalized.equals("hi")
            || normalized.equals("hello")
            || normalized.equals("hey")
            || normalized.startsWith("hi ")
            || normalized.startsWith("hello ")
            || normalized.startsWith("hey ");
    }

    private boolean mentionsSystem(String normalized) {
        return SYSTEM_TERMS.stream().anyMatch(normalized::contains);
    }

    private boolean containsAny(String normalized, String... values) {
        for (String value : values) {
            if (normalized.contains(value)) {
                return true;
            }
        }
        return false;
    }

    private List<String> tokenize(String normalized) {
        return List.of(normalized.split("\\s+"));
    }

    private void addPlants(Map<Long, Plant> target, List<Plant> plants) {
        for (Plant plant : plants) {
            target.putIfAbsent(plant.getId(), plant);
        }
    }

    private void addRemedies(Map<Long, Remedy> target, List<Remedy> remedies) {
        for (Remedy remedy : remedies) {
            target.putIfAbsent(remedy.getId(), remedy);
        }
    }

    private void addAilments(Map<Long, AilmentCategory> target, List<AilmentCategory> ailments) {
        for (AilmentCategory ailment : ailments) {
            target.putIfAbsent(ailment.getId(), ailment);
        }
    }

    private String slugify(String value) {
        return value == null
            ? "plant"
            : value.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
    }

    private record RetrievalResult(
        List<Plant> plants,
        List<Remedy> remedies,
        List<AilmentCategory> ailments
    ) {
        boolean hasPlants() {
            return plants != null && !plants.isEmpty();
        }

        boolean hasRemedies() {
            return remedies != null && !remedies.isEmpty();
        }

        boolean hasAilments() {
            return ailments != null && !ailments.isEmpty();
        }

        boolean hasAny() {
            return hasPlants() || hasRemedies() || hasAilments();
        }
    }
}
