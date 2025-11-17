package com.paroquia.siteparoquial.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "santos")
public class Santo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(length = 5000)
    private String biografia;

    @Column(length = 2000)
    private String oracao;

    private Integer dia;
    private Integer mes;

    @Column(name = "festa_liturgica")
    private String festaLiturgica;

    @Column(name = "imagem_url")
    private String imagemUrl;

    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
    }

    public Santo() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getBiografia() { return biografia; }
    public void setBiografia(String biografia) { this.biografia = biografia; }
    public String getOracao() { return oracao; }
    public void setOracao(String oracao) { this.oracao = oracao; }
    public Integer getDia() { return dia; }
    public void setDia(Integer dia) { this.dia = dia; }
    public Integer getMes() { return mes; }
    public void setMes(Integer mes) { this.mes = mes; }
    public String getFestaLiturgica() { return festaLiturgica; }
    public void setFestaLiturgica(String festaLiturgica) { this.festaLiturgica = festaLiturgica; }
    public String getImagemUrl() { return imagemUrl; }
    public void setImagemUrl(String imagemUrl) { this.imagemUrl = imagemUrl; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
}