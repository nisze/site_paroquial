package com.paroquia.siteparoquial.controllers;

import com.paroquia.siteparoquial.dto.SantoDTO;
import com.paroquia.siteparoquial.entities.Santo;
import com.paroquia.siteparoquial.services.SantoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin/santos")
@CrossOrigin(origins = "*")
public class AdminSantoController {

    @Autowired
    private SantoService santoService;

    @GetMapping
    public List<SantoDTO> listar() {
        return santoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Santo> buscar(@PathVariable Long id) {
        Optional<Santo> santo = santoService.buscarPorId(id);
        return santo.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/data/{dia}/{mes}")
    public ResponseEntity<List<SantoDTO>> buscarPorData(@PathVariable Integer dia, @PathVariable Integer mes) {
        List<SantoDTO> santos = santoService.buscarPorData(dia, mes);
        return ResponseEntity.ok(santos);
    }

    @PostMapping
    public ResponseEntity<Santo> criar(@RequestBody Santo santo) {
        Santo novoSanto = santoService.criar(santo);
        return ResponseEntity.ok(novoSanto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Santo> atualizar(@PathVariable Long id, @RequestBody Santo santo) {
        Santo santoAtualizado = santoService.atualizar(id, santo);
        return ResponseEntity.ok(santoAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletar(@PathVariable Long id) {
        santoService.deletar(id);
        return ResponseEntity.ok(Map.of("mensagem", "Santo deletado com sucesso"));
    }
}