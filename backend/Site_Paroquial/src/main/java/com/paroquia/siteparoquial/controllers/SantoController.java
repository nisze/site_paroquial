package com.paroquia.siteparoquial.controllers;

import com.paroquia.siteparoquial.dto.SantoDTO;
import com.paroquia.siteparoquial.services.SantoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/santos")
@CrossOrigin(origins = "*")
public class SantoController {

    @Autowired
    private SantoService santoService;

    @GetMapping
    public List<SantoDTO> listarSantos() {
        return santoService.listarTodos();
    }

    @GetMapping("/hoje")
    public ResponseEntity<SantoDTO> santoDoDia() {
        LocalDate hoje = LocalDate.now();
        int dia = hoje.getDayOfMonth();
        int mes = hoje.getMonthValue();
        
        SantoDTO santo = santoService.buscarPorDia(dia, mes);
        
        if (santo != null) {
            return ResponseEntity.ok(santo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/dia/{dia}/mes/{mes}")
    public ResponseEntity<SantoDTO> santoPorData(@PathVariable int dia, @PathVariable int mes) {
        SantoDTO santo = santoService.buscarPorDia(dia, mes);
        
        if (santo != null) {
            return ResponseEntity.ok(santo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}