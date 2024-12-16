package com.example.springteste.config;

import com.example.springteste.repositories.UsuariosRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
public class FiltroSeguranca extends OncePerRequestFilter {

    @Autowired
    ServicoToken servicoToken;

    @Autowired
    UsuariosRepository usuariosRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        var token = recoverToken(request);


        if (token != null) {
            var email = servicoToken.validacaoToken(token);
            UserDetails usuario = usuariosRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado com o e-mail: " + email));

            var autenticacao = new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(autenticacao);
        }

        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        String token = authHeader.replace("Bearer ", "").trim();
        System.out.println("Token: " + token);  
        return token;
    }
}
