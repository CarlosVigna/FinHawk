package com.example.springteste.controllers;

import com.example.springteste.dtos.UsuariosRecordDto;
import com.example.springteste.models.UsuariosModel;
import com.example.springteste.repositories.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuariosService {

    @Autowired
    private UsuariosRepository usuariosRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Criar um novo usuário
    public UsuariosModel criarUsuario(UsuariosRecordDto usuarioDto) {
        String senhaCriptografada = passwordEncoder.encode(usuarioDto.senha());
        UsuariosModel usuario = new UsuariosModel(
                usuarioDto.nome(),
                usuarioDto.email(),
                senhaCriptografada,
                usuarioDto.regra() // Atribui a regra ou usa o padrão
        );
        return usuariosRepository.save(usuario);
    }

    // Obter todos os usuários
    public List<UsuariosModel> getAllUsuarios() {
        return usuariosRepository.findAll();
    }

    // Obter um usuário por ID
    public Optional<UsuariosModel> getUsuarioById(Long id) {
        return usuariosRepository.findById(id);
    }

    // Obter um usuário por e-mail (verificação de e-mail duplicado)
    public Optional<UsuariosModel> getUsuarioByEmail(String email) {
        return usuariosRepository.findByEmail(email);
    }

    // Atualizar um usuário
    public UsuariosModel updateUsuario(Long id, UsuariosRecordDto usuarioDto) {
        Optional<UsuariosModel> usuarioExistente = usuariosRepository.findById(id);
        if (usuarioExistente.isPresent()) {
            UsuariosModel usuario = usuarioExistente.get();
            usuario.setNome(usuarioDto.nome());
            usuario.setEmail(usuarioDto.email());
            usuario.setSenha(passwordEncoder.encode(usuarioDto.senha())); // Atualiza a senha
            usuario.setRegra(usuarioDto.regra());
            return usuariosRepository.save(usuario);
        }
        throw new RuntimeException("Usuário não encontrado");
    }

    // Deletar um usuário
    public void deleteUsuario(Long id) {
        usuariosRepository.deleteById(id);
    }
}
