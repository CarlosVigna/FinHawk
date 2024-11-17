    package com.example.springteste.dtos;

    import jakarta.validation.constraints.NotNull;

    public record CategoriasRecordDto (@NotNull String nome,@NotNull String tipo) {

    }
