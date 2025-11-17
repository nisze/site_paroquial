package com.paroquia.siteparoquial.controllers;

import com.paroquia.siteparoquial.dto.NoticiaDTO;
import com.paroquia.siteparoquial.services.NoticiaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/noticias")
@CrossOrigin(origins = "*")
public class NoticiaController {

    @Autowired
    private NoticiaService noticiaService;

    @GetMapping
    public List<NoticiaDTO> listarNoticias() {
        return noticiaService.listarTodos();
    }
}