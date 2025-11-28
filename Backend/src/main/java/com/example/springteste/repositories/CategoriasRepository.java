package com.example.springteste.repositories;


import com.example.springteste.models.CategoriasModel;
import com.example.springteste.models.TitulosModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoriasRepository extends JpaRepository<CategoriasModel, Long> {

    @Query("SELECT DISTINCT c FROM CategoriasModel c " +
            "JOIN c.titulos t " +
            "WHERE t.tipo = :tipo AND t.status = :status AND t.conta.id = :contaId")
    List<CategoriasModel> findCategoriasByTipoAndStatus(
            @Param("tipo") String tipo,
            @Param("status") TitulosModel.StatusTitulo status, // Mude o tipo do parâmetro para o enum correto
            @Param("contaId") Long contaId);

    @Query("SELECT c FROM CategoriasModel c WHERE c.tipo = :tipo")
    List<CategoriasModel> findCategoriasByTipo(@Param("tipo") String tipo);
}