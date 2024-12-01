package com.example.springteste.dtos;

public class UsuarioResumoDto {
    private Long id;
    private String nome;
    private String email;

    public UsuarioResumoDto(Long id, String nome, String email) {
        this.id = id;
        this.nome = nome;
        this.email = email;
    }
}
