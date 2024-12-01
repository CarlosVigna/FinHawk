package com.example.springteste.config;

import com.example.springteste.models.UsuariosModel;
import com.example.springteste.repositories.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class ServicoAutenticacao implements UserDetailsService {

    @Autowired
    UsuariosRepository usuariosRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Aqui, 'username' é o email do usuário
        UsuariosModel usuario = usuariosRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com o e-mail: " + username));

        // Retorna a instância de UsuariosModel, que implementa UserDetails
        return usuario;
    }
}
