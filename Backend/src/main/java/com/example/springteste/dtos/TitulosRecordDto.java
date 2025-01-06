package com.example.springteste.dtos;

import com.example.springteste.models.TitulosModel;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TitulosRecordDto(
        @NotBlank(message = "A descrição é obrigatória") String descricao,

        @NotNull(message = "O valor é obrigatório") @Positive(message = "O valor deve ser maior que zero") BigDecimal valor,

        @NotNull(message = "A data de emissão é obrigatória") LocalDate emissao,

        @NotNull(message = "A data de vencimento é obrigatória") LocalDate vencimento,

        @NotNull(message = "A categoria é obrigatória") Long categoriaId,

        @NotNull(message = "O status é obrigatório") TitulosModel.StatusTitulo status,

        @NotNull(message = "O tipo é obrigatório") String tipo,

        Long contaId,

        boolean fixo, // Indica se é um título fixo (recorrente)

        @Min(value = 1, message = "A quantidade de parcelas deve ser no mínimo 1") Integer quantidadeParcelas, // Para
                                                                                                               // títulos
                                                                                                               // regulares

        @Min(value = 1, message = "A quantidade de recorrências deve ser no mínimo 1") Integer quantidadeRecorrencias, // Para
                                                                                                                       // títulos
                                                                                                                       // fixos

        @NotNull(message = "A periodicidade é obrigatória") TitulosModel.Periodicidade periodicidade // Usado para
                                                                                                     // títulos fixos

) {
}