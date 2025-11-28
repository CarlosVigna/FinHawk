package com.example.springteste.controllers;

import com.example.springteste.dtos.UsuariosRecordDto;
import com.example.springteste.models.UsuariosModel;
import com.example.springteste.service.UsuariosService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
public class UsuariosController {

    @Autowired
    private UsuariosService usuariosService;

    @PostMapping
    public ResponseEntity<?> saveUsuario(@RequestBody @Valid UsuariosRecordDto usuarioDto) {
        try {
            UsuariosModel novoUsuario = usuariosService.criarUsuario(usuarioDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao criar usuário: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<UsuariosModel>> getAllUsuarios() {
        List<UsuariosModel> usuarios = usuariosService.getAllUsuarios();
        return usuarios.isEmpty()
                ? ResponseEntity.status(HttpStatus.NO_CONTENT).body(usuarios)
                : ResponseEntity.status(HttpStatus.OK).body(usuarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getOneUsuario(@PathVariable Long id) {
        Optional<UsuariosModel> usuario = usuariosService.getUsuarioById(id);
        return usuario.isPresent()
                ? ResponseEntity.status(HttpStatus.OK).body(usuario.get())
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado");
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateUsuario(@PathVariable Long id, @RequestBody @Valid UsuariosRecordDto usuarioDto) {
        Optional<UsuariosModel> usuario = usuariosService.getUsuarioById(id);
        if (usuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado");
        }
        UsuariosModel updatedUsuario = usuariosService.updateUsuario(id, usuarioDto);
        return ResponseEntity.status(HttpStatus.OK).body(updatedUsuario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUsuario(@PathVariable Long id) {
        try {
            usuariosService.deleteUsuario(id);
            return ResponseEntity.status(HttpStatus.OK).body("Usuário deletado com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado");
        }
    }
}
