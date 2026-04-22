package com.vanaspati.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.vanaspati.config.JwtService;
import com.vanaspati.dto.request.LoginRequest;
import com.vanaspati.dto.request.RegisterRequest;
import com.vanaspati.dto.response.AuthResponse;
import com.vanaspati.dto.response.UserResponse;
import com.vanaspati.mapper.UserMapper;
import com.vanaspati.model.User;
import com.vanaspati.model.enums.UserLevel;
import com.vanaspati.model.enums.UserRole;
import com.vanaspati.repository.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_whenEmailAlreadyExists_throwsConflict() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Anika");
        request.setEmail("anika@example.com");
        request.setPassword("secret123");

        when(userRepository.findByEmail("anika@example.com")).thenReturn(Optional.of(User.builder().id(1L).build()));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> authService.register(request));
        assertEquals("Email already exists", ex.getMessage());
    }

    @Test
    void register_createsDefaultUserStateAndReturnsToken() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Anika");
        request.setEmail("anika@example.com");
        request.setPassword("secret123");

        User savedUser = User.builder()
            .id(11L)
            .name("Anika")
            .email("anika@example.com")
            .passwordHash("encoded-secret")
            .role(UserRole.USER)
            .points(0)
            .level(UserLevel.SEED)
            .languagePref("en")
            .isActive(true)
            .build();

        UserResponse mapped = new UserResponse();
        mapped.setId(11L);
        mapped.setEmail("anika@example.com");

        when(userRepository.findByEmail("anika@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("secret123")).thenReturn("encoded-secret");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken("anika@example.com")).thenReturn("jwt-token");
        when(userMapper.toResponse(savedUser)).thenReturn(mapped);

        AuthResponse result = authService.register(request);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User persisted = userCaptor.getValue();

        assertEquals(UserRole.USER, persisted.getRole());
        assertEquals(UserLevel.SEED, persisted.getLevel());
        assertEquals(0, persisted.getPoints());
        assertTrue(Boolean.TRUE.equals(persisted.getIsActive()));
        assertEquals("jwt-token", result.getToken());
        assertEquals("anika@example.com", result.getUser().getEmail());
    }

    @Test
    void login_authenticatesAndReturnsMappedUser() {
        LoginRequest request = new LoginRequest();
        request.setEmail("anika@example.com");
        request.setPassword("secret123");

        User user = User.builder().id(5L).email("anika@example.com").name("Anika").passwordHash("x").build();
        UserResponse response = new UserResponse();
        response.setId(5L);
        response.setEmail("anika@example.com");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenReturn(org.mockito.Mockito.mock(Authentication.class));
        when(userRepository.findByEmail("anika@example.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken("anika@example.com")).thenReturn("login-jwt");
        when(userMapper.toResponse(user)).thenReturn(response);

        AuthResponse result = authService.login(request);

        assertEquals("login-jwt", result.getToken());
        assertEquals("anika@example.com", result.getUser().getEmail());
    }

    @Test
    void refresh_whenUserMissing_throwsNotFound() {
        when(jwtService.extractUsername("old-token")).thenReturn("missing@example.com");
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> authService.refresh("old-token"));
        assertEquals("User not found", ex.getMessage());
    }
}
