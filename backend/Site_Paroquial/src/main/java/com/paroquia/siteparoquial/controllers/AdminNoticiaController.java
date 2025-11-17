package com.paroquia.siteparoquial.controllers;

import com.paroquia.siteparoquial.dto.NoticiaDTO;
import com.paroquia.siteparoquial.entities.Noticia;
import com.paroquia.siteparoquial.services.NoticiaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin/noticias")
@CrossOrigin(origins = "*")
public class AdminNoticiaController {

    @Autowired
    private NoticiaService noticiaService;

    @GetMapping
    public List<NoticiaDTO> listar() {
        return noticiaService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> buscar(@PathVariable Long id) {
        Optional<Noticia> noticia = noticiaService.buscarPorId(id);
        if (noticia.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Noticia n = noticia.get();
        Map<String, Object> response = new HashMap<>();
        response.put("id", n.getId());
        response.put("titulo", n.getTitulo());
        response.put("conteudo", n.getConteudo());
        response.put("resumo", n.getResumo());
        response.put("autor", n.getAutor());
        response.put("dataPublicacao", n.getDataPublicacao() != null ? n.getDataPublicacao().toString() : null);
        response.put("tipo", n.getTipo());
        response.put("ativo", n.getAtivo());
        response.put("imagemUrl", n.getImagemUrl());
        
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> criar(@RequestBody Map<String, Object> payload) {
        Noticia noticia = new Noticia();
        noticia.setTitulo((String) payload.get("titulo"));
        noticia.setConteudo((String) payload.get("conteudo"));
        noticia.setResumo((String) payload.get("resumo"));
        noticia.setAutor((String) payload.get("autor"));
        noticia.setTipo((String) payload.get("tipo"));
        noticia.setAtivo((Boolean) payload.getOrDefault("ativo", true));
        noticia.setImagemUrl((String) payload.get("imagemUrl"));
        
        String dataPublicacao = (String) payload.get("dataPublicacao");
        if (dataPublicacao != null && !dataPublicacao.isEmpty()) {
            noticia.setDataPublicacao(java.time.LocalDate.parse(dataPublicacao));
        }
        
        Noticia novaNoticia = noticiaService.criar(noticia);
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", novaNoticia.getId());
        response.put("titulo", novaNoticia.getTitulo());
        response.put("conteudo", novaNoticia.getConteudo());
        response.put("resumo", novaNoticia.getResumo());
        response.put("autor", novaNoticia.getAutor());
        response.put("dataPublicacao", novaNoticia.getDataPublicacao() != null ? novaNoticia.getDataPublicacao().toString() : null);
        response.put("tipo", novaNoticia.getTipo());
        response.put("ativo", novaNoticia.getAtivo());
        response.put("imagemUrl", novaNoticia.getImagemUrl());
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> atualizar(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Noticia noticia = new Noticia();
        noticia.setTitulo((String) payload.get("titulo"));
        noticia.setConteudo((String) payload.get("conteudo"));
        noticia.setResumo((String) payload.get("resumo"));
        noticia.setAutor((String) payload.get("autor"));
        noticia.setTipo((String) payload.get("tipo"));
        noticia.setAtivo((Boolean) payload.getOrDefault("ativo", true));
        noticia.setImagemUrl((String) payload.get("imagemUrl"));
        
        String dataPublicacao = (String) payload.get("dataPublicacao");
        if (dataPublicacao != null && !dataPublicacao.isEmpty()) {
            noticia.setDataPublicacao(java.time.LocalDate.parse(dataPublicacao));
        }
        
        Noticia noticiaAtualizada = noticiaService.atualizar(id, noticia);
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", noticiaAtualizada.getId());
        response.put("titulo", noticiaAtualizada.getTitulo());
        response.put("conteudo", noticiaAtualizada.getConteudo());
        response.put("resumo", noticiaAtualizada.getResumo());
        response.put("autor", noticiaAtualizada.getAutor());
        response.put("dataPublicacao", noticiaAtualizada.getDataPublicacao() != null ? noticiaAtualizada.getDataPublicacao().toString() : null);
        response.put("tipo", noticiaAtualizada.getTipo());
        response.put("ativo", noticiaAtualizada.getAtivo());
        response.put("imagemUrl", noticiaAtualizada.getImagemUrl());
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletar(@PathVariable Long id) {
        noticiaService.deletar(id);
        return ResponseEntity.ok(Map.of("mensagem", "Noticia deletada com sucesso"));
    }
}