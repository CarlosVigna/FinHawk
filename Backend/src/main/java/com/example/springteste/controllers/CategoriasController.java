package com.example.springteste.controllers;


import com.example.springteste.dtos.CategoriasRecordDto;
import com.example.springteste.models.CategoriasModel;
import com.example.springteste.models.TitulosModel;
import com.example.springteste.repositories.CategoriasRepository;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categorias")

public class CategoriasController {

    @Autowired
    private CategoriasRepository categoriasRepository;

    @GetMapping
    @CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
    public ResponseEntity<List<CategoriasModel>> getAllCategorias(@RequestParam(required = false) String tipo) {
        List<CategoriasModel> categorias;
        if (tipo != null && !tipo.isEmpty()) {
            categorias = categoriasRepository.findCategoriasByTipo(tipo);
        } else {
            categorias = categoriasRepository.findAll();
        }
        return ResponseEntity.ok(categorias);
    }

    @PostMapping
    @CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
    public ResponseEntity<CategoriasModel> saveCategoria(@RequestBody @Valid CategoriasRecordDto categoriasRecordDto) {
        var categoriasModel = new CategoriasModel();
        BeanUtils.copyProperties(categoriasRecordDto, categoriasModel);
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriasRepository.save(categoriasModel));
    }

    @GetMapping("/tipo")
    @CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
    public ResponseEntity<List<CategoriasModel>> getCategoriasByTipo(
            @RequestParam String tipo,
            @RequestParam Long contaId) {

        try {
            // Validação do tipo
            if (!tipo.equals("Pagamento") && !tipo.equals("Recebimento")) {
                return ResponseEntity.badRequest().body(null);
            }

            // Converte a String para o enum correspondente
            TitulosModel.StatusTitulo status = tipo.equals("Pagamento") ? TitulosModel.StatusTitulo.PAGO : TitulosModel.StatusTitulo.RECEBIDO;

            List<CategoriasModel> categorias = categoriasRepository.findCategoriasByTipoAndStatus(tipo, status, contaId);
            return ResponseEntity.ok(categorias);

        } catch (Exception e) {
            // Imprime a mensagem de erro e o stack trace no console de erro (System.err)
            System.err.println("Erro ao buscar categorias por tipo e contaId: " + e.getMessage());
            e.printStackTrace();

            // Retorna uma resposta de erro 500 (Internal Server Error)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
