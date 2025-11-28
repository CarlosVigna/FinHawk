package com.example.springteste.controllers;

import com.example.springteste.dtos.AutenticacaoDTO;
import com.example.springteste.dtos.LoginResponseDto;
import com.example.springteste.models.UsuariosModel;
import com.example.springteste.config.ServicoToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ControleAutenticacao {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private ServicoToken servicoToken;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AutenticacaoDTO data) {
        try {
            if (data.email() == null || data.senha() == null) {
                return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("error", "Email e senha são obrigatórios"));
            }

            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(data.email(), data.senha())
            );

            UsuariosModel usuario = (UsuariosModel) authentication.getPrincipal();
            String token = servicoToken.geradorToken(usuario);

            return ResponseEntity.ok(new LoginResponseDto(usuario.getId(), token));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Collections.singletonMap("error", "Credenciais inválidas"));
        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("error", "Erro interno do servidor: " + e.getMessage()));
        }
    }
}
