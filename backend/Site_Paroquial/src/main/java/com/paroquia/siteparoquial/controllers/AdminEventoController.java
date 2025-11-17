package com.paroquia.siteparoquial.controllers;

import com.paroquia.siteparoquial.dto.EventoDTO;
import com.paroquia.siteparoquial.entities.Evento;
import com.paroquia.siteparoquial.services.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin/eventos")
@CrossOrigin(origins = "*")
public class AdminEventoController {

    @Autowired
    private EventoService eventoService;

    @GetMapping
    public List<EventoDTO> listar() {
        return eventoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> buscar(@PathVariable Long id) {
        Optional<Evento> evento = eventoService.buscarPorId(id);
        if (evento.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Evento e = evento.get();
        Map<String, Object> response = new HashMap<>();
        response.put("id", e.getId());
        response.put("titulo", e.getTitulo());
        response.put("descricao", e.getDescricao());
        response.put("dataInicio", e.getData() != null ? e.getData().toString() : null);
        response.put("horaInicio", e.getHora() != null ? e.getHora().toString() : null);
        response.put("local", e.getLocal());
        response.put("tipo", e.getTipo());
        response.put("ativo", e.getAtivo());
        response.put("imagemUrl", e.getImagemUrl());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> criar(@RequestBody Map<String, Object> payload) {
        Evento evento = new Evento();
        evento.setTitulo((String) payload.get("titulo"));
        evento.setDescricao((String) payload.get("descricao"));
        evento.setLocal((String) payload.get("local"));
        evento.setTipo((String) payload.get("tipo"));
        evento.setAtivo((Boolean) payload.getOrDefault("ativo", true));
        evento.setImagemUrl((String) payload.get("imagemUrl"));
        
        // Converter dataInicio para data
        String dataInicio = (String) payload.get("dataInicio");
        if (dataInicio != null && !dataInicio.isEmpty()) {
            evento.setData(java.time.LocalDate.parse(dataInicio));
        }
        
        // Converter horaInicio para hora
        String horaInicio = (String) payload.get("horaInicio");
        if (horaInicio != null && !horaInicio.isEmpty()) {
            evento.setHora(java.time.LocalTime.parse(horaInicio));
        }
        
        Evento novoEvento = eventoService.criar(evento);
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", novoEvento.getId());
        response.put("titulo", novoEvento.getTitulo());
        response.put("descricao", novoEvento.getDescricao());
        response.put("dataInicio", novoEvento.getData() != null ? novoEvento.getData().toString() : null);
        response.put("horaInicio", novoEvento.getHora() != null ? novoEvento.getHora().toString() : null);
        response.put("local", novoEvento.getLocal());
        response.put("tipo", novoEvento.getTipo());
        response.put("ativo", novoEvento.getAtivo());
        response.put("imagemUrl", novoEvento.getImagemUrl());
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> atualizar(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Evento evento = new Evento();
        evento.setTitulo((String) payload.get("titulo"));
        evento.setDescricao((String) payload.get("descricao"));
        evento.setLocal((String) payload.get("local"));
        evento.setTipo((String) payload.get("tipo"));
        evento.setAtivo((Boolean) payload.getOrDefault("ativo", true));
        evento.setImagemUrl((String) payload.get("imagemUrl"));
        
        // Converter dataInicio para data
        String dataInicio = (String) payload.get("dataInicio");
        if (dataInicio != null && !dataInicio.isEmpty()) {
            evento.setData(java.time.LocalDate.parse(dataInicio));
        }
        
        // Converter horaInicio para hora
        String horaInicio = (String) payload.get("horaInicio");
        if (horaInicio != null && !horaInicio.isEmpty()) {
            evento.setHora(java.time.LocalTime.parse(horaInicio));
        }
        
        Evento eventoAtualizado = eventoService.atualizar(id, evento);
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", eventoAtualizado.getId());
        response.put("titulo", eventoAtualizado.getTitulo());
        response.put("descricao", eventoAtualizado.getDescricao());
        response.put("dataInicio", eventoAtualizado.getData() != null ? eventoAtualizado.getData().toString() : null);
        response.put("horaInicio", eventoAtualizado.getHora() != null ? eventoAtualizado.getHora().toString() : null);
        response.put("local", eventoAtualizado.getLocal());
        response.put("tipo", eventoAtualizado.getTipo());
        response.put("ativo", eventoAtualizado.getAtivo());
        response.put("imagemUrl", eventoAtualizado.getImagemUrl());
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletar(@PathVariable Long id) {
        eventoService.deletar(id);
        return ResponseEntity.ok(Map.of("mensagem", "Evento deletado com sucesso"));
    }
}