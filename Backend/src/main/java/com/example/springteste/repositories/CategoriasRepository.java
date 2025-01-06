package com.example.springteste.repositories;

import com.example.springteste.models.CategoriasModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriasRepository extends JpaRepository<CategoriasModel, Long> {
}