package com.paroquia.siteparoquial.repositories;
import com.paroquia.siteparoquial.entities.Santo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface SantoRepository extends JpaRepository<Santo, Long> {}