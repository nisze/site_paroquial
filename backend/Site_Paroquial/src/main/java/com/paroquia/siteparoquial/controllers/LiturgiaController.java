package com.paroquia.siteparoquial.controllers;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/liturgia")
@CrossOrigin(origins = "*")
public class LiturgiaController {

    @GetMapping("/hoje")
    public Map<String, Object> liturgiaHoje() {
        Map<String, Object> liturgia = new HashMap<>();
        liturgia.put("data", "2025-11-16");
        liturgia.put("cor", "Verde");
        liturgia.put("titulo", "Sábado da 32ª Semana do Tempo Comum");
        
        Map<String, String> evangelho = new HashMap<>();
        evangelho.put("livro", "Lucas");
        evangelho.put("capitulo", "18");
        evangelho.put("versiculo", "1-8");
        evangelho.put("texto", "Jesus contou aos discípulos uma parábola sobre a necessidade de orar sempre...");
        liturgia.put("evangelho", evangelho);
        
        return liturgia;
    }
}