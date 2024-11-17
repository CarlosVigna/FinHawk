package com.example.springteste.dtos;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record ContasRecordDto(
        @NotBlank String descricao,
        String fotoUrl
) {

}