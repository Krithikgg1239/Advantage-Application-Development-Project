package com.example.demo.service;

import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.entity.SystemUser;
import com.example.demo.repository.SystemUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final SystemUserRepository systemUserRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthResponseDto authenticate(AuthRequestDto request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SystemUser user = systemUserRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String token = jwtService.generateToken(user);

        return AuthResponseDto.builder()
                .token(token)
                .username(user.getUsername())
                .role(user.getRole().name())
                .build();
    }

    public void register(RegisterDto request) {
        String role = request.getRole() == null ? "" : request.getRole().toUpperCase();

        if (!role.equals(SystemUser.UserRole.CLIENT.name()) && !role.equals(SystemUser.UserRole.AUDIENCE.name())) {
            throw new IllegalArgumentException("Invalid role selected. Only CLIENT and AUDIENCE are allowed.");
        }

        SystemUser user = SystemUser.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(SystemUser.UserRole.valueOf(role))
                .build();

        systemUserRepository.save(user);
    }
}