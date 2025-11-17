package com.paroquia.siteparoquial.services;

import com.paroquia.siteparoquial.dto.EventoDTO;
import com.paroquia.siteparoquial.entities.Evento;
import com.paroquia.siteparoquial.repositories.EventoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventoService {

    @Autowired
    private EventoRepository repository;

    private EventoDTO toDTO(Evento entity) {
        return new EventoDTO(
            entity.getId(),
            entity.getTitulo(),
            entity.getDescricao(),
            entity.getData(),
            entity.getHora(),
            entity.getLocal(),
            entity.getTipo(),
            entity.getAtivo(),
            entity.getImagemUrl()
        );
    }

    public List<EventoDTO> listarTodos() {
        return repository.findAll().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public Optional<Evento> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public Evento criar(Evento evento) {
        return repository.save(evento);
    }

    public Evento atualizar(Long id, Evento evento) {
        evento.setId(id);
        return repository.save(evento);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}