package com.example.springteste.repositories;


import com.example.springteste.models.TitulosModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TitulosRepository extends JpaRepository<TitulosModel, Long> {
    List<TitulosModel> findByContaId(Long contaId);

    @Query("SELECT t FROM TitulosModel t WHERE t.conta.id = :contaId AND t.categoria.tipo = 'Recebimento' AND t.status = 'Recebido'")
    List<TitulosModel> findRecebimentosRecebidosByContaId(@Param("contaId") Long contaId);

    @Query("SELECT t FROM TitulosModel t WHERE t.conta.id = :contaId AND t.categoria.tipo = 'Pagamento' AND t.status = 'Pago'")
    List<TitulosModel> findPagamentosPagosByContaId(@Param("contaId") Long contaId);

    @Query("SELECT t FROM TitulosModel t WHERE t.conta.id = :contaId AND t.categoria.tipo = 'Recebimento' AND t.status = 'Em aberto'")
    List<TitulosModel> findRecebimentosAbertoByContaId(@Param("contaId") Long contaId);

    @Query("SELECT t FROM TitulosModel t WHERE t.conta.id = :contaId AND t.categoria.tipo = 'Pagamento' AND t.status = 'Em aberto'")
    List<TitulosModel> findPagamentoAbertoByContaId(@Param("contaId") Long contaId);

    @Modifying
    @Query("DELETE FROM TitulosModel t WHERE t.conta.id = :contaId")
    void deleteByContaId(Long contaId);
}
