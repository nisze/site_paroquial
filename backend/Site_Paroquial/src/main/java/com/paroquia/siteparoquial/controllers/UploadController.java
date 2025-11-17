package com.paroquia.siteparoquial.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class UploadController {

    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadImagem(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("erro", "Arquivo vazio"));
            }

            // Criar diretório se não existir
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Gerar nome único para o arquivo
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                : "";
            String filename = UUID.randomUUID().toString() + extension;

            // Salvar arquivo
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);

            // Retornar URL da imagem
            String imageUrl = "/uploads/" + filename;
            Map<String, String> response = new HashMap<>();
            response.put("url", imageUrl);
            response.put("filename", filename);
            
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("erro", "Erro ao salvar arquivo: " + e.getMessage()));
        }
    }
}