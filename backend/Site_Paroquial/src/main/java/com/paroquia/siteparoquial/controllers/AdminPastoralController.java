package com.paroquia.siteparoquial.controllers;

import com.paroquia.siteparoquial.dto.PastoralDTO;
import com.paroquia.siteparoquial.entities.Pastoral;
import com.paroquia.siteparoquial.services.PastoralService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin/pastorais")
@CrossOrigin(origins = "*")
public class AdminPastoralController {

    @Autowired
    private PastoralService pastoralService;

    @GetMapping
    public List<PastoralDTO> listar() {
        return pastoralService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> buscar(@PathVariable Long id) {
        Optional<Pastoral> pastoral = pastoralService.buscarPorId(id);
        if (pastoral.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Pastoral p = pastoral.get();
        Map<String, Object> response = new HashMap<>();
        response.put("id", p.getId());
        response.put("nome", p.getNome());
        response.put("descricao", p.getDescricao());
        response.put("coordenador", p.getCoordenador());
        response.put("contato", p.getContato());
        response.put("horario", p.getHorario());
        response.put("tipo", p.getTipo());
        response.put("ativo", p.getAtivo());
        response.put("imagemUrl", p.getImagemUrl());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> criar(@RequestBody Map<String, Object> payload) {
        Pastoral pastoral = new Pastoral();
        pastoral.setNome((String) payload.get("nome"));
        pastoral.setDescricao((String) payload.get("descricao"));
        pastoral.setCoordenador((String) payload.get("coordenador"));
        pastoral.setContato((String) payload.get("contato"));
        pastoral.setHorario((String) payload.get("horario"));
        pastoral.setTipo((String) payload.get("tipo"));
        pastoral.setAtivo((Boolean) payload.getOrDefault("ativo", true));
        pastoral.setImagemUrl((String) payload.get("imagemUrl"));
        
        Pastoral novaPastoral = pastoralService.criar(pastoral);
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", novaPastoral.getId());
        response.put("nome", novaPastoral.getNome());
        response.put("descricao", novaPastoral.getDescricao());
        response.put("coordenador", novaPastoral.getCoordenador());
        response.put("contato", novaPastoral.getContato());
        response.put("horario", novaPastoral.getHorario());
        response.put("tipo", novaPastoral.getTipo());
        response.put("ativo", novaPastoral.getAtivo());
        response.put("imagemUrl", novaPastoral.getImagemUrl());
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> atualizar(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Pastoral pastoral = new Pastoral();
        pastoral.setNome((String) payload.get("nome"));
        pastoral.setDescricao((String) payload.get("descricao"));
        pastoral.setCoordenador((String) payload.get("coordenador"));
        pastoral.setContato((String) payload.get("contato"));
        pastoral.setHorario((String) payload.get("horario"));
        pastoral.setTipo((String) payload.get("tipo"));
        pastoral.setAtivo((Boolean) payload.getOrDefault("ativo", true));
        pastoral.setImagemUrl((String) payload.get("imagemUrl"));
        
        Pastoral pastoralAtualizada = pastoralService.atualizar(id, pastoral);
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", pastoralAtualizada.getId());
        response.put("nome", pastoralAtualizada.getNome());
        response.put("descricao", pastoralAtualizada.getDescricao());
        response.put("coordenador", pastoralAtualizada.getCoordenador());
        response.put("contato", pastoralAtualizada.getContato());
        response.put("horario", pastoralAtualizada.getHorario());
        response.put("tipo", pastoralAtualizada.getTipo());
        response.put("ativo", pastoralAtualizada.getAtivo());
        response.put("imagemUrl", pastoralAtualizada.getImagemUrl());
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletar(@PathVariable Long id) {
        pastoralService.deletar(id);
        return ResponseEntity.ok(Map.of("mensagem", "Pastoral deletada com sucesso"));
    }
}