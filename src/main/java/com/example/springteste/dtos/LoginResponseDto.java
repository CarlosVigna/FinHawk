package com.example.springteste.dtos;

public class LoginResponseDto {
    private Long id; // ou o tipo apropriado para o seu ID
    private String token;

    public LoginResponseDto(Long id, String token) {
        this.id = id;
        this.token = token;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getToken() {
        return token;
    }
}