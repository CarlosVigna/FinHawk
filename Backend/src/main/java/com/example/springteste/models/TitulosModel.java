package com.example.springteste.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "titulos")
@AllArgsConstructor
@RequiredArgsConstructor
@EqualsAndHashCode
@ToString
@Setter
@Getter
public class TitulosModel implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String descricao;
    private LocalDate vencimento;
    private LocalDate emissao;

    @Min(value = 1, message = "A quantidade de parcelas deve ser no mínimo 1")
    private Integer quantidadeParcelas = 1;

    @Min(value = 1, message = "O número da parcela deve ser no mínimo 1")
    private Integer numeroParcela = 1;

    @Enumerated(EnumType.STRING)
    private Periodicidade periodicidade;

    @ManyToOne
    @JsonManagedReference
    @JoinColumn(name = "categoria_id")
    private CategoriasModel categoria;

    private BigDecimal valor;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private StatusTitulo status = StatusTitulo.PENDENTE;

    @ManyToOne
    @JoinColumn(name = "conta_id")
    private ContasModel conta;

    private String tipo;

    public enum StatusTitulo {
        PENDENTE,
        RECEBIDO,
        PAGO
    }

    public enum Periodicidade {
        MENSAL,
        BIMESTRAL,
        TRIMESTRAL,
        SEMESTRAL,
        ANUAL;

    }

}
