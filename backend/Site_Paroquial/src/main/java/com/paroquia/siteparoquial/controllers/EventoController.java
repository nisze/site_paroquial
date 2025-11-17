package com.paroquia.siteparoquial.controllers;

import com.paroquia.siteparoquial.dto.EventoDTO;
import com.paroquia.siteparoquial.services.EventoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/eventos")
@CrossOrigin(origins = "*")
public class EventoController {

    @Autowired
    private EventoService eventoService;

    @GetMapping
    public List<EventoDTO> listarEventos() {
        return eventoService.listarTodos();
    }
}