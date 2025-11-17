package com.paroquia.siteparoquial.services;
import com.paroquia.siteparoquial.dto.PastoralDTO;
import com.paroquia.siteparoquial.entities.Pastoral;
import com.paroquia.siteparoquial.repositories.PastoralRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
public class PastoralService {
    @Autowired
    private PastoralRepository repository;
    
    private PastoralDTO toDTO(Pastoral entity) {
        PastoralDTO dto = new PastoralDTO();
        dto.setId(entity.getId());
        dto.setNome(entity.getNome());
        dto.setDescricao(entity.getDescricao());
        dto.setCoordenador(entity.getCoordenador());
        dto.setContato(entity.getContato());
        dto.setHorario(entity.getHorario());
        dto.setTipo(entity.getTipo());
        dto.setAtivo(entity.getAtivo());
        dto.setImagemUrl(entity.getImagemUrl());
        return dto;
    }
    
    public List<PastoralDTO> listarTodos() { 
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList()); 
    }
    public Optional<Pastoral> buscarPorId(Long id) { return repository.findById(id); }
    public Pastoral criar(Pastoral entity) { return repository.save(entity); }
    public Pastoral atualizar(Long id, Pastoral entity) { entity.setId(id); return repository.save(entity); }
    public void deletar(Long id) { repository.deleteById(id); }
}