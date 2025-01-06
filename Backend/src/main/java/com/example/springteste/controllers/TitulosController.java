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

import java.time.LocalDate;
import java.util.*;

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
    public ResponseEntity<Map<String, Object>> saveTitulo(@PathVariable Long idConta,
            @RequestBody @Valid TitulosRecordDto titulosRecordDto) {
        Map<String, Object> response = new HashMap<>();

        try {
            ContasModel conta = contasRepository.findById(idConta)
                    .orElseThrow(() -> new RuntimeException("Conta não encontrada"));

            CategoriasModel categoria = categoriasRepository.findById(titulosRecordDto.categoriaId())
                    .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

            List<TitulosModel> titulosSalvos = new ArrayList<>();

            if (titulosRecordDto.fixo()) {
                // Título fixo/recorrente
                if (titulosRecordDto.quantidadeRecorrencias() != null) {
                    titulosSalvos = gerarTitulosRecorrentes(titulosRecordDto, categoria, conta);
                    response.put("message", "Títulos recorrentes salvos com sucesso!");
                }

            } else {
                // Título regular (não fixo)
                for (int i = 0; i < titulosRecordDto.quantidadeParcelas(); i++) {
                    TitulosModel titulo = criarTitulo(titulosRecordDto, categoria, conta);
                    titulo.setNumeroParcela(i + 1);
                    titulo.setVencimento(titulo.getVencimento().plusMonths(i));
                    titulosRepository.save(titulo);
                    titulosSalvos.add(titulo);
                }

                response.put("message", "Título regular salvo com sucesso!");
            }

            response.put("success", true);
            response.put("data", titulosSalvos);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("message", "Erro ao salvar título: " + e.getMessage());
            response.put("success", false);

            return ResponseEntity.internalServerError().contentType(MediaType.APPLICATION_JSON).body(response); // Retorna
                                                                                                                // 500
                                                                                                                // Internal
                                                                                                                // Server
                                                                                                                // Error
        }
    }

    private List<TitulosModel> gerarTitulosRecorrentes(TitulosRecordDto titulosRecordDto, CategoriasModel categoria,
            ContasModel conta) {
        List<TitulosModel> titulos = new ArrayList<>();
        LocalDate dataVencimento = titulosRecordDto.vencimento();
        LocalDate dataEmissao = titulosRecordDto.emissao();

        for (int i = 0; i < titulosRecordDto.quantidadeRecorrencias(); i++) {
            TitulosModel titulo = criarTitulo(titulosRecordDto, categoria, conta);
            titulo.setVencimento(dataVencimento);
            titulo.setEmissao(dataEmissao);
            titulosRepository.save(titulo);
            titulos.add(titulo);

            dataVencimento = calcularProximoVencimento(dataVencimento, titulosRecordDto.periodicidade());
            dataEmissao = calcularProximoVencimento(dataEmissao, titulosRecordDto.periodicidade());

        }
        return titulos;
    }

    private LocalDate calcularProximoVencimento(LocalDate dataAtual, TitulosModel.Periodicidade periodicidade) {
        switch (periodicidade) {
            case MENSAL:
                return dataAtual.plusMonths(1);
            case BIMESTRAL:
                return dataAtual.plusMonths(2);
            case TRIMESTRAL:
                return dataAtual.plusMonths(3);
            case SEMESTRAL:
                return dataAtual.plusMonths(6);
            case ANUAL:
                return dataAtual.plusYears(1);
            default:
                throw new IllegalArgumentException("Periodicidade inválida: " + periodicidade);
        }
    }

    private TitulosModel criarTitulo(TitulosRecordDto titulosRecordDto, CategoriasModel categoria, ContasModel conta) {
        var titulosModel = new TitulosModel();
        BeanUtils.copyProperties(titulosRecordDto, titulosModel);
        titulosModel.setConta(conta);
        titulosModel.setCategoria(categoria);

        if (titulosRecordDto.fixo()) {
            titulosModel.setQuantidadeParcelas(titulosRecordDto.quantidadeRecorrencias()); // Define a quantidade de
                                                                                           // recorrências para títulos
                                                                                           // fixos
        }

        return titulosModel;
    }

    @GetMapping("/titulos")
    @CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
    public ResponseEntity<List<TitulosModel>> getTitulosPorConta(
            @RequestParam Long contaId,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String statusString) {

        List<TitulosModel> titulos;

        try {
            TitulosModel.StatusTitulo status = null;
            if (statusString != null && !statusString.trim().isEmpty()) {
                status = TitulosModel.StatusTitulo.valueOf(statusString.toUpperCase());
            }

            if (tipo != null && status != null) {
                titulos = titulosRepository.findByContaIdAndTipoAndStatus(contaId, tipo, status);
            } else if (tipo != null) {
                titulos = titulosRepository.findByContaIdAndTipo(contaId, tipo);
            } else if (status != null) {
                titulos = titulosRepository.findByContaIdAndStatus(contaId, status);
            } else {
                titulos = titulosRepository.findByContaId(contaId);
            }

            return ResponseEntity.status(HttpStatus.OK).body(titulos);

        } catch (IllegalArgumentException e) {
            System.err.println("Status inválido: " + statusString);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            System.err.println("Erro ao buscar títulos: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/titulos/recebidos")
    public ResponseEntity<List<TitulosModel>> getTitulosRecebidos(@RequestParam Long contaId) {
        List<TitulosModel> titulos = titulosRepository.findRecebimentosRecebidosByContaId(contaId,
                TitulosModel.StatusTitulo.RECEBIDO);
        return ResponseEntity.status(HttpStatus.OK).body(titulos);
    }

    @GetMapping("/titulos/pagos")
    public ResponseEntity<List<TitulosModel>> getTitulosPagos(@RequestParam Long contaId) {
        List<TitulosModel> titulos = titulosRepository.findPagamentosPagosByContaId(contaId,
                TitulosModel.StatusTitulo.PAGO);
        return ResponseEntity.status(HttpStatus.OK).body(titulos);
    }

    @GetMapping("/titulos/rec-aberto")
    public ResponseEntity<List<TitulosModel>> getTitulosRecAberto(@RequestParam Long contaId) {
        List<TitulosModel> titulos = titulosRepository.findRecebimentosAbertoByContaId(contaId,
                TitulosModel.StatusTitulo.PENDENTE);
        return ResponseEntity.status(HttpStatus.OK).body(titulos);
    }

    @GetMapping("/titulos/pag-aberto")
    public ResponseEntity<List<TitulosModel>> getTitulosPagAberto(@RequestParam Long contaId) {
        List<TitulosModel> titulos = titulosRepository.findPagamentoAbertoByContaId(contaId,
                TitulosModel.StatusTitulo.PENDENTE);
        return ResponseEntity.status(HttpStatus.OK).body(titulos);
    }

    @PutMapping("/titulos/{id}")
    @CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
    public ResponseEntity<Object> updateTitulo(@PathVariable(value = "id") Long id,
            @RequestBody @Valid TitulosRecordDto titulosRecordDto) {
        Optional<TitulosModel> titulos0 = titulosRepository.findById(id);
        if (titulos0.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Título não encontrado");
        }
        var titulosModel = titulos0.get();
        titulosModel.setDescricao(titulosRecordDto.descricao());
        titulosModel.setValor(titulosRecordDto.valor());
        titulosModel.setEmissao(titulosRecordDto.emissao());
        titulosModel.setVencimento(titulosRecordDto.vencimento());
        titulosModel.setStatus(titulosRecordDto.status());
        titulosModel.setTipo(titulosRecordDto.tipo());

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