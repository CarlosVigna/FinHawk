package com.example.springteste.dtos;

public class LoginResponseDto {
    private Long id;
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