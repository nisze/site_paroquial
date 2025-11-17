package com.paroquia.siteparoquial.controllers;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class HelloController {

    @GetMapping("/status")
    public String status() {
        return "{\"status\":\"online\",\"app\":\"Sistema Paroquial\",\"versao\":\"1.0\"}";
    }
}