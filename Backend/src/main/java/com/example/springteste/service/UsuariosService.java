package com.example.springteste.service;

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

    public UsuariosModel criarUsuario(UsuariosRecordDto usuarioDto) {
        String senhaCriptografada = passwordEncoder.encode(usuarioDto.senha());
        UsuariosModel usuario = new UsuariosModel(
                usuarioDto.nome(),
                usuarioDto.email(),
                senhaCriptografada,
                usuarioDto.regra()
        );
        return usuariosRepository.save(usuario);
    }

    public List<UsuariosModel> getAllUsuarios() {
        return usuariosRepository.findAll();
    }

    public Optional<UsuariosModel> getUsuarioById(Long id) {
        return usuariosRepository.findById(id);
    }

    public Optional<UsuariosModel> getUsuarioByEmail(String email) {
        return usuariosRepository.findByEmail(email);
    }


    public UsuariosModel updateUsuario(Long id, UsuariosRecordDto usuarioDto) {
        Optional<UsuariosModel> usuarioExistente = usuariosRepository.findById(id);
        if (usuarioExistente.isPresent()) {
            UsuariosModel usuario = usuarioExistente.get();
            usuario.setNome(usuarioDto.nome());
            usuario.setEmail(usuarioDto.email());
            usuario.setSenha(passwordEncoder.encode(usuarioDto.senha()));
            usuario.setRegra(usuarioDto.regra());
            return usuariosRepository.save(usuario);
        }
        throw new RuntimeException("Usuário não encontrado");
    }

    public void deleteUsuario(Long id) {
        usuariosRepository.deleteById(id);
    }
}