package com.example.demo.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDto {
    private String username;
    private String email;
    private String password;
    private String role;
}