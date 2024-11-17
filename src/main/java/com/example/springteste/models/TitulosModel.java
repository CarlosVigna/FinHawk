package com.example.springteste.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "titulos")
public class TitulosModel implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate vencimento;
    private LocalDate emissao;

    @ManyToOne
    @JsonManagedReference
    @JoinColumn(name = "categoria_id")
    private CategoriasModel categoria;

    private BigDecimal valor;
    private String status;

    @ManyToOne
    @JoinColumn(name = "conta_id")
    private ContasModel conta;

    public TitulosModel() {
    }

    public TitulosModel(Long id, LocalDate vencimento, LocalDate emissao, CategoriasModel categoria, BigDecimal valor, String status, ContasModel conta) {
        this.id = id;
        this.vencimento = vencimento;
        this.emissao = emissao;
        this.categoria = categoria;
        this.valor = valor;
        this.status = status;
        this.conta = conta;  // Inicializando a conta
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getVencimento() {
        return vencimento;
    }

    public void setVencimento(LocalDate vencimento) {
        this.vencimento = vencimento;
    }

    public LocalDate getEmissao() {
        return emissao;
    }

    public void setEmissao(LocalDate emissao) {
        this.emissao = emissao;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public CategoriasModel getCategoria() {
        return categoria;
    }

    public void setCategoria(CategoriasModel categoria) {
        this.categoria = categoria;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public ContasModel getConta() {
        return conta;
    }

    public void setConta(ContasModel conta) {
        this.conta = conta;
    }
}
