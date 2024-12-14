package com.example.springteste.controllers;

import com.example.springteste.models.ContasModel;
import com.example.springteste.models.UsuariosModel;
import com.example.springteste.repositories.ContasRepository;
import com.example.springteste.repositories.UsuariosRepository;
import com.example.springteste.repositories.TitulosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
public class ContasService {

    @Autowired
    private ContasRepository contasRepository;
    @Autowired
    private UsuariosRepository usuariosRepository;
    @Autowired
    private TitulosRepository titulosRepository;

    @Transactional
    public ContasModel salvarConta(ContasModel conta, Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("Usuário não autenticado"); // Lança uma RuntimeException
        }
        try {
            UsuariosModel usuarioLogado = usuariosRepository
                    .findById(((UsuariosModel) authentication.getPrincipal()).getId())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado")); // RuntimeException
            conta.setUsuarios(Set.of(usuarioLogado));
            return contasRepository.save(conta);
        } catch (RuntimeException e) {
            throw e;
        }
    }

    @Transactional
    public void deleteConta(Long id) {
        try {
            ContasModel conta = contasRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Conta não encontrada"));
            
            // Primeiro, deletar todos os títulos associados à conta
            titulosRepository.deleteByContaId(id);
            
            // Verifica se a conta tem usuários associados
            if (conta.getUsuarios() != null) {
                conta.getUsuarios().clear();
                contasRepository.save(conta);
            }
            
            contasRepository.delete(conta);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao deletar conta: " + e.getMessage());
        }
    }
}