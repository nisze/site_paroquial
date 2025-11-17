package com.paroquia.siteparoquial.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pastorais")
public class Pastoral {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(length = 5000)
    private String descricao;

    private String coordenador;
    private String contato;
    private String horario;

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

    public Pastoral() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public String getCoordenador() { return coordenador; }
    public void setCoordenador(String coordenador) { this.coordenador = coordenador; }
    public String getContato() { return contato; }
    public void setContato(String contato) { this.contato = contato; }
    public String getHorario() { return horario; }
    public void setHorario(String horario) { this.horario = horario; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
    public String getImagemUrl() { return imagemUrl; }
    public void setImagemUrl(String imagemUrl) { this.imagemUrl = imagemUrl; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
}