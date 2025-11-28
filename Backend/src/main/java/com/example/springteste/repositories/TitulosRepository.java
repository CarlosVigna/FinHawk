package com.example.springteste.repositories;

import com.example.springteste.models.TitulosModel;
import com.example.springteste.models.TitulosModel.StatusTitulo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TitulosRepository extends JpaRepository<TitulosModel, Long> {
    List<TitulosModel> findByContaId(Long contaId);

    List<TitulosModel> findByContaIdAndTipoAndStatus(Long contaId, String tipo, StatusTitulo status);

    @Query("SELECT t FROM TitulosModel t WHERE t.conta.id = :contaId AND t.tipo = :tipo")
    List<TitulosModel> findByContaIdAndTipo(@Param("contaId") Long contaId, @Param("tipo") String tipo);

    @Query("SELECT t FROM TitulosModel t WHERE t.conta.id = :contaId AND t.status = :status")
    List<TitulosModel> findByContaIdAndStatus(@Param("contaId") Long contaId, @Param("status") StatusTitulo status);

    @Query("SELECT t FROM TitulosModel t WHERE t.conta.id = :contaId AND t.tipo = 'Recebimento' AND t.status = :status")
    List<TitulosModel> findRecebimentosRecebidosByContaId(@Param("contaId") Long contaId, @Param("status") StatusTitulo status);

    @Query("SELECT t FROM TitulosModel t WHERE t.conta.id = :contaId AND t.tipo = 'Pagamento' AND t.status = :status")
    List<TitulosModel> findPagamentosPagosByContaId(@Param("contaId") Long contaId, @Param("status") StatusTitulo status);

    @Query("SELECT t FROM TitulosModel t WHERE t.conta.id = :contaId AND t.tipo = 'Recebimento' AND t.status = :status")
    List<TitulosModel> findRecebimentosAbertoByContaId(@Param("contaId") Long contaId, @Param("status") StatusTitulo status);

    @Query("SELECT t FROM TitulosModel t WHERE t.conta.id = :contaId AND t.tipo = 'Pagamento' AND t.status = :status")
    List<TitulosModel> findPagamentoAbertoByContaId(@Param("contaId") Long contaId, @Param("status") StatusTitulo status);

    @Modifying
    @Query("DELETE FROM TitulosModel t WHERE t.conta.id = :contaId")
    void deleteByContaId(Long contaId);

}