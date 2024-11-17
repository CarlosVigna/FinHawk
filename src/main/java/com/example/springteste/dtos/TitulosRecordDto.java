package com.example.springteste.dtos;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

public record TitulosRecordDto(
        @NotNull LocalDate vencimento,
        @NotNull LocalDate emissao,
        @NotNull Long categoriaId,
        String categoriaNome,
        String categoriaTipo,
        @NotNull BigDecimal valor,
        @NotNull String status,
        @NotNull Long contaId)
{
}