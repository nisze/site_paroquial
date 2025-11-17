package com.paroquia.siteparoquial.services;
import com.paroquia.siteparoquial.dto.NoticiaDTO;
import com.paroquia.siteparoquial.entities.Noticia;
import com.paroquia.siteparoquial.repositories.NoticiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
public class NoticiaService {
    @Autowired
    private NoticiaRepository repository;
    
    private NoticiaDTO toDTO(Noticia entity) {
        NoticiaDTO dto = new NoticiaDTO();
        dto.setId(entity.getId());
        dto.setTitulo(entity.getTitulo());
        dto.setConteudo(entity.getConteudo());
        dto.setResumo(entity.getResumo());
        dto.setAutor(entity.getAutor());
        dto.setDataPublicacao(entity.getDataPublicacao());
        dto.setTipo(entity.getTipo());
        dto.setAtivo(entity.getAtivo());
        dto.setImagemUrl(entity.getImagemUrl());
        return dto;
    }
    
    public List<NoticiaDTO> listarTodos() { 
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList()); 
    }
    public Optional<Noticia> buscarPorId(Long id) { return repository.findById(id); }
    public Noticia criar(Noticia entity) { return repository.save(entity); }
    public Noticia atualizar(Long id, Noticia entity) { entity.setId(id); return repository.save(entity); }
    public void deletar(Long id) { repository.deleteById(id); }
}