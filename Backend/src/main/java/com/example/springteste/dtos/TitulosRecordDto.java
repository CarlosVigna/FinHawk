package com.example.springteste.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TitulosRecordDto(
    @NotBlank(message = "A descrição é obrigatória")
    String descricao,
    
    @NotNull(message = "O valor é obrigatório")
    @Positive(message = "O valor deve ser maior que zero")
    BigDecimal valor,
    
    @NotNull(message = "A data de emissão é obrigatória")
    LocalDate emissao,
    
    @NotNull(message = "A data de vencimento é obrigatória")
    LocalDate vencimento,
    
    @NotNull(message = "A categoria é obrigatória")
    Long categoriaId,
    
    @NotNull(message = "O status é obrigatório")
    String status,
    
    @NotNull(message = "O tipo é obrigatório")
    String tipo,
    
    Long contaId
) {}