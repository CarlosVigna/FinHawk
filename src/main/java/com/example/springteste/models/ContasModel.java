package com.example.springteste.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="contas")
public class ContasModel implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_conta")
    private Long id;

    @Column(name = "nome_conta")
    private String descricao;

    @Column(name = "foto_url")
    private String fotoUrl;

    @ManyToMany(cascade = CascadeType.PERSIST)
    @JoinTable(
            name = "usuarios_contas",
            joinColumns = @JoinColumn(name = "id_conta"),
            inverseJoinColumns = @JoinColumn(name = "id_usuario")
    )
    @JsonManagedReference
    @JsonIgnore
    private Set<UsuariosModel> usuarios = new HashSet<>();
    public Set<UsuariosModel> getUsuarios() {
        return usuarios;
    }

    public void setUsuarios(Set<UsuariosModel> usuarios) {
        this.usuarios = usuarios;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    public void addUsuario(UsuariosModel usuario) {
        if (usuario != null) {
            this.usuarios.add(usuario);
            usuario.getContas().add(this);
        }
    }

    public void removeUsuario(UsuariosModel usuario) {
        if (usuario != null) {
            this.usuarios.remove(usuario);
            usuario.getContas().remove(this);
        }
    }
}
