package com.vanaspati.service;

import com.vanaspati.config.JwtService;
import com.vanaspati.dto.request.LoginRequest;
import com.vanaspati.dto.request.RegisterRequest;
import com.vanaspati.dto.response.AuthResponse;
import com.vanaspati.mapper.UserMapper;
import com.vanaspati.model.User;
import com.vanaspati.model.enums.UserLevel;
import com.vanaspati.model.enums.UserRole;
import com.vanaspati.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserMapper userMapper;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(u -> {
            throw new IllegalArgumentException("Email already exists");
        });

        User user = User.builder()
            .name(request.getName())
            .email(request.getEmail())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .role(UserRole.USER)
            .points(0)
            .level(UserLevel.SEED)
            .languagePref("en")
            .isActive(true)
            .build();

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved.getEmail());
        return new AuthResponse(token, userMapper.toResponse(saved));
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, userMapper.toResponse(user));
    }

    public AuthResponse refresh(String currentToken) {
        String email = jwtService.extractUsername(currentToken);
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String token = jwtService.generateToken(email);
        return new AuthResponse(token, userMapper.toResponse(user));
    }
}
