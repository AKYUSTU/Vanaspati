package com.vanaspati.dto.response;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BulkImportResultDTO {
    private int total;
    private int created;
    private int updated;
    private int failed;
    private List<String> errors;
}