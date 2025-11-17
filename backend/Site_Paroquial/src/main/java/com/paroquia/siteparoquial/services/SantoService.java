package com.paroquia.siteparoquial.services;
import com.paroquia.siteparoquial.dto.SantoDTO;
import com.paroquia.siteparoquial.entities.Santo;
import com.paroquia.siteparoquial.repositories.SantoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
public class SantoService {
    @Autowired
    private SantoRepository repository;
    
    private SantoDTO toDTO(Santo entity) {
        SantoDTO dto = new SantoDTO();
        dto.setId(entity.getId());
        dto.setNome(entity.getNome());
        dto.setBiografia(entity.getBiografia());
        dto.setOracao(entity.getOracao());
        dto.setDia(entity.getDia());
        dto.setMes(entity.getMes());
        dto.setFestaLiturgica(entity.getFestaLiturgica());
        dto.setImagemUrl(entity.getImagemUrl());
        return dto;
    }
    
    public List<SantoDTO> listarTodos() { 
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList()); 
    }
    
    public SantoDTO buscarPorDia(int dia, int mes) {
        Optional<Santo> santo = repository.findAll().stream()
            .filter(s -> s.getDia() == dia && s.getMes() == mes)
            .findFirst();
        
        return santo.map(this::toDTO).orElse(null);
    }
    
    public List<SantoDTO> buscarPorData(int dia, int mes) {
        return repository.findAll().stream()
            .filter(s -> s.getDia() == dia && s.getMes() == mes)
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
    
    public Optional<Santo> buscarPorId(Long id) { return repository.findById(id); }
    public Santo criar(Santo entity) { return repository.save(entity); }
    public Santo atualizar(Long id, Santo entity) { entity.setId(id); return repository.save(entity); }
    public void deletar(Long id) { repository.deleteById(id); }
}