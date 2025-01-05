package com.example.springteste.controllers;


import com.example.springteste.dtos.CategoriasRecordDto;
import com.example.springteste.models.CategoriasModel;
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
        List<CategoriasModel> categorias = categoriasRepository.findCategoriasByTipoAndStatus(tipo, contaId);
        return ResponseEntity.ok(categorias);
    }

}
