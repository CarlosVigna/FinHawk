package com.example.springteste.controllers;

import com.example.springteste.dtos.AutenticacaoDTO;
import com.example.springteste.dtos.LoginResponseDto;
import com.example.springteste.models.UsuariosModel;
import com.example.springteste.config.ServicoToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class ControleAutenticacao {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private ServicoToken servicoToken;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AutenticacaoDTO data) {
        try {
            var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.senha());
            var auth = authenticationManager.authenticate(usernamePassword);

            var usuario = (UsuariosModel) auth.getPrincipal();
            var token = servicoToken.geradorToken(usuario);

            return ResponseEntity.ok(new LoginResponseDto(usuario.getId(), token));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao autenticar: " + e.getMessage());
        }
    }
}
