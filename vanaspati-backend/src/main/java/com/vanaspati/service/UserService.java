package com.vanaspati.service;

import com.vanaspati.dto.response.UserResponse;
import com.vanaspati.mapper.UserMapper;
import com.vanaspati.model.User;
import com.vanaspati.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse updateLanguagePreference(Long userId, String languagePref) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        user.setLanguagePref(languagePref);
        return userMapper.toResponse(userRepository.save(user));
    }
}
