package com.vanaspati.dto.response;

import com.vanaspati.model.enums.UserLevel;
import com.vanaspati.model.enums.UserRole;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private UserRole role;
    private Integer points;
    private UserLevel level;
    private String languagePref;
}
