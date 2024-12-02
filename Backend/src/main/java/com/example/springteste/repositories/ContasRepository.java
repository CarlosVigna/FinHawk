package com.example.springteste.repositories;

import com.example.springteste.models.ContasModel;
import com.example.springteste.models.UsuariosModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContasRepository extends JpaRepository<ContasModel, Long> {

    @Query("SELECT c FROM ContasModel c JOIN FETCH c.usuarios u WHERE u.id = :usuarioId")
    List<ContasModel> findByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT c FROM ContasModel c JOIN FETCH c.usuarios u WHERE u.id = :userId")
    List<ContasModel> findContasByUserId(@Param("userId") Long userId);
}
