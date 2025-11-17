package com.paroquia.siteparoquial.repositories;
import com.paroquia.siteparoquial.entities.Noticia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface NoticiaRepository extends JpaRepository<Noticia, Long> {}