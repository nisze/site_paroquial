package com.paroquia.siteparoquial.repositories;

import com.paroquia.siteparoquial.entities.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {
}