package com.example.springteste.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "categorias")
public final class CategoriasModel implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String tipo;

    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL)
    @JsonBackReference
    private List<TitulosModel> titulos;
    public CategoriasModel() {
    }

    public CategoriasModel(Long id, String nome, String tipo) {
        this.id = id;
        this.nome = nome;
        this.tipo = tipo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public List<TitulosModel> getTitulos() {
        return titulos;
    }

    public void setTitulos(List<TitulosModel> titulos) {
        this.titulos = titulos;
    }
}
