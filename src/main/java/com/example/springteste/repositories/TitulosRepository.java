package com.example.springteste.repositories;


import com.example.springteste.models.TitulosModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TitulosRepository extends JpaRepository<TitulosModel, Long> {
    List<TitulosModel> findByContaId(Long contaId);
}
