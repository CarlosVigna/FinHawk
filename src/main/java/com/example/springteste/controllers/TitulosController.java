package com.example.springteste.controllers;

import com.example.springteste.dtos.TitulosRecordDto;
import com.example.springteste.models.CategoriasModel;
import com.example.springteste.models.ContasModel;
import com.example.springteste.models.TitulosModel;
import com.example.springteste.repositories.CategoriasRepository;
import com.example.springteste.repositories.ContasRepository;
import com.example.springteste.repositories.TitulosRepository;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class TitulosController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private TitulosRepository titulosRepository;

    @Autowired
    private CategoriasRepository categoriasRepository;

    @Autowired
    private ContasRepository contasRepository;

    @PostMapping("/contas/{idConta}/titulos")
    @CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
    public ResponseEntity<String> saveTitulo(@PathVariable Long idConta, @RequestBody @Valid TitulosRecordDto titulosRecordDto) {
        // Buscando a conta através do idConta que vem na URL
        ContasModel conta = contasRepository.findById(idConta)
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));

        // Verificando se a categoria existe
        CategoriasModel categoria = categoriasRepository.findById(titulosRecordDto.categoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        // Chamando a stored procedure para salvar o título
        String sql = "EXEC sp_cadTitulo ?, ?, ?, ?, ?, ?, ?";
        jdbcTemplate.update(sql,
                titulosRecordDto.descricao(),
                titulosRecordDto.emissao(),
                titulosRecordDto.status(),
                titulosRecordDto.valor(),
                titulosRecordDto.vencimento(),
                titulosRecordDto.categoriaId(),
                idConta
        );

        return ResponseEntity.status(HttpStatus.CREATED).contentType(MediaType.APPLICATION_JSON)
                .body("{\"message\":\"Título salvo com sucesso!\"}");
    }

//
//    @GetMapping("/titulos")
//    @CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
//    public ResponseEntity<List<TitulosModel>> getTitulosPorConta(@RequestParam Long contaId) {
//        List<TitulosModel> titulos = titulosRepository.findByContaId(contaId);
//        return ResponseEntity.status(HttpStatus.OK).body(titulos);
//    }

    @GetMapping("/titulos/recebidos/{id}")
    @CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
    public ResponseEntity<List<TitulosModel>> getTitulosRecebidos (@PathVariable Long contaId) {
        List<TitulosModel> titulos = titulosRepository.findRecebimentosRecebidos(contaId);
        return ResponseEntity.status(HttpStatus.OK).body(titulos);
    }


    @PutMapping("/titulos/{id}")
    @CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
    public ResponseEntity<Object> updateTitulo(@PathVariable(value = "id") Long id, @RequestBody @Valid TitulosRecordDto titulosRecordDto) {
        Optional<TitulosModel> titulos0 = titulosRepository.findById(id);
        if (titulos0.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Título não encontrado");
        }
        var titulosModel = titulos0.get();
        BeanUtils.copyProperties(titulosRecordDto, titulosModel);

        CategoriasModel categoria = categoriasRepository.findById(titulosRecordDto.categoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        titulosModel.setCategoria(categoria);

        ContasModel conta = contasRepository.findById(titulosRecordDto.contaId())
                .orElseThrow(() -> new RuntimeException("Conta não encontrada"));
        titulosModel.setConta(conta);

        return ResponseEntity.status(HttpStatus.OK).body(titulosRepository.save(titulosModel));
    }

    @DeleteMapping("/titulos/{id}")
    @CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
    public ResponseEntity<Object> deleteTitulo(@PathVariable(value = "id") Long id) {
        Optional<TitulosModel> titulos0 = titulosRepository.findById(id);
        if (titulos0.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Título não encontrado");
        }
        titulosRepository.delete(titulos0.get());
        return ResponseEntity.status(HttpStatus.OK).body("Título deletado com sucesso");
    }
}
