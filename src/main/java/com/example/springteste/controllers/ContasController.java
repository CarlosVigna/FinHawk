package com.example.springteste.controllers;

import com.example.springteste.dtos.ContasRecordDto;
import com.example.springteste.models.ContasModel;
import com.example.springteste.models.UsuariosModel;
import com.example.springteste.repositories.ContasRepository;
import com.example.springteste.repositories.UsuariosRepository;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/contas")
public class ContasController {

    @Autowired
    private ContasRepository contasRepository;

    @Autowired
    private UsuariosRepository usuariosRepository;

    @Autowired
    private ContasService contasService;

    @PostMapping
    @CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
    public ResponseEntity<ContasModel> saveConta(@RequestBody @Valid ContasRecordDto contasRecordDto, Authentication authentication) {
        try {
            ContasModel conta = new ContasModel();
            BeanUtils.copyProperties(contasRecordDto, conta);
            ContasModel contaSalva = contasService.salvarConta(conta, authentication);
            return ResponseEntity.status(HttpStatus.CREATED).body(contaSalva);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // Retorna 400
        } catch (Exception e) {
            e.printStackTrace(); // REMOVA EM PRODUÇÃO. Use um logger apropriado.
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/usuario")
    public ResponseEntity<List<ContasModel>> getContasPorUsuario(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        UsuariosModel usuarioLogado = (UsuariosModel) authentication.getPrincipal();
        List<ContasModel> contas = contasRepository.findByUsuarioId(usuarioLogado.getId());
        return ResponseEntity.ok(contas);
    }

    @GetMapping
    @CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
    public ResponseEntity<List<ContasModel>> getAllContas() {
        return ResponseEntity.status(HttpStatus.OK).body(contasRepository.findAll());
    }

//    @GetMapping("/{id}/usuarios")
//    public ResponseEntity<List<UsuariosModel>> getUsuariosByConta(@PathVariable Long id) {
//        return contasRepository.findByIdWithUsers(id)
//                .map(conta -> ResponseEntity.ok(new ArrayList<>(conta.getUsuarios())))
//                .orElse(ResponseEntity.notFound().build());
//    }

    @PutMapping("/{id}")
    @CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
    public ResponseEntity<ContasModel> updateConta(@PathVariable Long id, @RequestBody @Valid ContasRecordDto contasRecordDto) {
        ContasModel contaExistente = contasRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));
        BeanUtils.copyProperties(contasRecordDto, contaExistente, "id"); // Não alterar o ID
        return ResponseEntity.ok(contasRepository.save(contaExistente));
    }

    @GetMapping("/usuario/{id}")
    @CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
    public ResponseEntity<List<ContasModel>> getContasPorUsuarioId(@PathVariable Long id) {
        try {
            List<ContasModel> contas = contasRepository.findContasByUserId(id);
            return ResponseEntity.ok(contas);
        } catch (Exception e) {
            e.printStackTrace(); // REMOVA EM PRODUÇÃO. Use um logger apropriado.
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
