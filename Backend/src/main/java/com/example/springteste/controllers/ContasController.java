package com.example.springteste.controllers;

import com.example.springteste.dtos.ContasRecordDto;
import com.example.springteste.models.ContasModel;
import com.example.springteste.repositories.ContasRepository;
import com.example.springteste.repositories.UsuariosRepository;
import com.example.springteste.models.UsuariosModel;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.Set;
import java.util.HashSet;

@RestController
@RequestMapping("/contas")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ContasController {

    @Autowired
    private ContasRepository contasRepository;

    @Autowired
    private ContasService contasService;

    @Autowired
    private UsuariosRepository usuariosRepository;

    @GetMapping
    public ResponseEntity<List<ContasModel>> getAllContas() {
        return ResponseEntity.status(HttpStatus.OK).body(contasRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getOneConta(@PathVariable(value = "id") Long id) {
        Optional<ContasModel> conta = contasRepository.findById(id);
        if (conta.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", "Conta não encontrada"));
        }
        return ResponseEntity.status(HttpStatus.OK)
                .body(Map.of("status", "success", "data", conta.get()));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> saveConta(@RequestBody @Valid ContasRecordDto contasRecordDto) {
        try {
            var contasModel = new ContasModel();
            BeanUtils.copyProperties(contasRecordDto, contasModel);
            
            Set<UsuariosModel> usuarios = new HashSet<>();
            for (Long usuarioId : contasRecordDto.usuarios()) {
                UsuariosModel usuario = usuariosRepository.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + usuarioId));
                usuarios.add(usuario);
            }
            contasModel.setUsuarios(usuarios);

            if (contasModel.getFotoUrl() == null) {
                contasModel.setFotoUrl("");
            }

            ContasModel savedConta = contasRepository.save(contasModel);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("status", "success", "data", savedConta));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("status", "error", "message", "Erro ao criar conta: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateConta(@PathVariable(value = "id") Long id,
            @RequestBody @Valid ContasRecordDto contasRecordDto) {
        try {
            Optional<ContasModel> contaOptional = contasRepository.findById(id);
            if (contaOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Conta não encontrada.");
            }
            
            var contaExistente = contaOptional.get();
            contaExistente.setDescricao(contasRecordDto.descricao());
            contaExistente.setFotoUrl(contasRecordDto.fotoUrl());
            
            Set<UsuariosModel> novosUsuarios = new HashSet<>();
            for (Long usuarioId : contasRecordDto.usuarios()) {
                UsuariosModel usuario = usuariosRepository.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado: " + usuarioId));
                novosUsuarios.add(usuario);
            }
            contaExistente.setUsuarios(novosUsuarios);
            
            ContasModel contaAtualizada = contasRepository.save(contaExistente);
            return ResponseEntity.status(HttpStatus.OK).body(contaAtualizada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao atualizar conta: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteConta(@PathVariable(value = "id") Long id) {
        try {
            contasService.deleteConta(id);
            return ResponseEntity.ok()
                    .body(Map.of("status", "success", "message", "Conta deletada com sucesso"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Erro interno ao deletar conta"));
        }
    }
}
