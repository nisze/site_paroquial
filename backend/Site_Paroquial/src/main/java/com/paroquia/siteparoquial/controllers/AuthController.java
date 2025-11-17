package com.paroquia.siteparoquial.controllers;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        String usuario = credentials.get("usuario");
        String senha = credentials.get("senha");
        
        // Validação simples (em produção, use banco de dados e hash)
        if ("admin".equals(usuario) && "admin123".equals(senha)) {
            return Map.of(
                "success", true,
                "token", "fake-jwt-token-" + UUID.randomUUID(),
                "usuario", usuario,
                "role", "ADMIN"
            );
        }
        
        return Map.of(
            "success", false,
            "mensagem", "Usuário ou senha inválidos"
        );
    }

    @PostMapping("/validate")
    public Map<String, Object> validate(@RequestBody Map<String, String> tokenData) {
        String token = tokenData.get("token");
        
        // Validação simples do token
        if (token != null && token.startsWith("fake-jwt-token-")) {
            return Map.of(
                "valid", true,
                "usuario", "admin",
                "role", "ADMIN"
            );
        }
        
        return Map.of("valid", false);
    }
}