package com.example.demo.config;

import com.example.demo.entity.SystemUser;
import com.example.demo.repository.SystemUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final SystemUserRepository systemUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUser("admanager1", "admanager1@advantage.com", "password123", SystemUser.UserRole.ADMANAGER);
        seedUser("client1", "client1@advantage.com", "password123", SystemUser.UserRole.CLIENT);
        seedUser("audience1", "audience1@advantage.com", "password123", SystemUser.UserRole.AUDIENCE);
    }

    private void seedUser(String username, String email, String rawPassword, SystemUser.UserRole role) {
        if (systemUserRepository.findByUsername(username).isEmpty()) {
            SystemUser user = SystemUser.builder()
                    .username(username)
                    .email(email)
                    .password(passwordEncoder.encode(rawPassword))
                    .role(role)
                    .build();
            systemUserRepository.save(user);
        }
    }
}