package com.paroquia.siteparoquial.controllers;

import com.paroquia.siteparoquial.dto.PastoralDTO;
import com.paroquia.siteparoquial.services.PastoralService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/pastorais")
@CrossOrigin(origins = "*")
public class PastoralController {

    @Autowired
    private PastoralService pastoralService;

    @GetMapping
    public List<PastoralDTO> listarPastorais() {
        return pastoralService.listarTodos();
    }
}