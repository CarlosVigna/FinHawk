package com.example.springteste.controllers;

import com.example.springteste.models.ContasModel;
import com.example.springteste.models.UsuariosModel;
import com.example.springteste.repositories.ContasRepository;
import com.example.springteste.repositories.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Set;

@Service
public class ContasService {

    @Autowired
    private ContasRepository contasRepository;
    @Autowired
    private UsuariosRepository usuariosRepository;

    @Transactional
    public ContasModel salvarConta(ContasModel conta, Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("Usuário não autenticado"); // Lança uma RuntimeException
        }
        try {
            UsuariosModel usuarioLogado = usuariosRepository.findById(((UsuariosModel) authentication.getPrincipal()).getId())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado")); // RuntimeException
            conta.setUsuarios(Set.of(usuarioLogado));
            return contasRepository.save(conta);
        } catch (RuntimeException e) {
            throw e; // propaga a exceção para o controller
        }
    }
}