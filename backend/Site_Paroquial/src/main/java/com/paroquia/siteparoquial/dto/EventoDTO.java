package com.paroquia.siteparoquial.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class EventoDTO {
    private Long id;
    private String titulo;
    private String descricao;
    private LocalDate data;
    private LocalTime hora;
    private String local;
    private String tipo;
    private Boolean ativo;
    private String imagemUrl;

    public EventoDTO() {}

    public EventoDTO(Long id, String titulo, String descricao, LocalDate data, LocalTime hora, String local, String tipo, Boolean ativo, String imagemUrl) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.data = data;
        this.hora = hora;
        this.local = local;
        this.tipo = tipo;
        this.ativo = ativo;
        this.imagemUrl = imagemUrl;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
    public LocalTime getHora() { return hora; }
    public void setHora(LocalTime hora) { this.hora = hora; }
    public String getLocal() { return local; }
    public void setLocal(String local) { this.local = local; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
    public String getImagemUrl() { return imagemUrl; }
    public void setImagemUrl(String imagemUrl) { this.imagemUrl = imagemUrl; }
}