package com.example.springteste.repositories;


import com.example.springteste.models.TitulosModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TitulosRepository extends JpaRepository<TitulosModel, Long> {
    List<TitulosModel> findByContaId(Long contaId);

    @Query(value = "SELECT * FROM v_Recebimentos_Recebidos WHERE conta_id = :contaId", nativeQuery = true)
    List<TitulosModel> findRecebimentosRecebidos(@Param("contaId") Long contaId);

    @Query(value = "SELECT * FROM v_Recebimentos_Em_Aberto WHERE conta_id = :contaId", nativeQuery = true)
    List<TitulosModel> findRecebimentosEmAberto(@Param("contaId") Long contaId);
}
