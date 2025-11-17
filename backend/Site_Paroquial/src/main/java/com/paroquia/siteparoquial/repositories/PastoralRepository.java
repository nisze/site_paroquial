package com.paroquia.siteparoquial.repositories;
import com.paroquia.siteparoquial.entities.Pastoral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface PastoralRepository extends JpaRepository<Pastoral, Long> {}