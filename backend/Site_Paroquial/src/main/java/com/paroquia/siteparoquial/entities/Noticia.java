package com.paroquia.siteparoquial.entities;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "noticias")
public class Noticia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(length = 5000)
    private String conteudo;

    private String resumo;
    private String autor;

    @Column(name = "data_publicacao")
    private LocalDate dataPublicacao;

    private String tipo;
    private Boolean ativo;

    @Column(name = "imagem_url")
    private String imagemUrl;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
    }

    public Noticia() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getConteudo() { return conteudo; }
    public void setConteudo(String conteudo) { this.conteudo = conteudo; }
    public String getResumo() { return resumo; }
    public void setResumo(String resumo) { this.resumo = resumo; }
    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }
    public LocalDate getDataPublicacao() { return dataPublicacao; }
    public void setDataPublicacao(LocalDate dataPublicacao) { this.dataPublicacao = dataPublicacao; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
    public String getImagemUrl() { return imagemUrl; }
    public void setImagemUrl(String imagemUrl) { this.imagemUrl = imagemUrl; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
}