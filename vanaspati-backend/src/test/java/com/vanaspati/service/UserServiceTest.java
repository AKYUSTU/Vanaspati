package com.vanaspati.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.vanaspati.dto.response.UserResponse;
import com.vanaspati.mapper.UserMapper;
import com.vanaspati.model.User;
import com.vanaspati.repository.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserService userService;

    @Test
    void getUserByEmail_returnsMappedUserResponse() {
        User user = User.builder().id(9L).name("Asha").email("asha@example.com").passwordHash("x").build();
        UserResponse mapped = new UserResponse();
        mapped.setId(9L);
        mapped.setEmail("asha@example.com");

        when(userRepository.findByEmail("asha@example.com")).thenReturn(Optional.of(user));
        when(userMapper.toResponse(user)).thenReturn(mapped);

        UserResponse result = userService.getUserByEmail("asha@example.com");

        assertEquals(9L, result.getId());
        assertEquals("asha@example.com", result.getEmail());
    }

    @Test
    void getUserByEmail_whenMissing_throwsNotFound() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
            () -> userService.getUserByEmail("missing@example.com"));
        assertEquals("User not found: missing@example.com", ex.getMessage());
    }

    @Test
    void updateLanguagePreference_updatesAndPersistsLanguage() {
        User user = User.builder().id(12L).name("Dev").email("dev@example.com").passwordHash("x").languagePref("en").build();
        UserResponse mapped = new UserResponse();
        mapped.setId(12L);
        mapped.setLanguagePref("hi");

        when(userRepository.findById(12L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userMapper.toResponse(any(User.class))).thenReturn(mapped);

        UserResponse result = userService.updateLanguagePreference(12L, "hi");

        assertEquals("hi", user.getLanguagePref());
        assertEquals("hi", result.getLanguagePref());
    }
}
