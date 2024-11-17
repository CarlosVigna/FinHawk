package com.example.springteste.dtos;

import com.example.springteste.models.RegrasUsuarios;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UsuariosRecordDto(
        @NotBlank String nome,
        @NotNull String email,
        @NotNull String senha,
        RegrasUsuarios regra
) {

    public RegrasUsuarios regra() {
        return (this.regra != null) ? this.regra : RegrasUsuarios.ADMIN;
    }


}