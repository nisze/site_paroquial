package com.paroquia.siteparoquial.dto;
public class SantoDTO {
    private Long id; private String nome; private String biografia; private String oracao; private Integer dia; private Integer mes; private String festaLiturgica; private String imagemUrl;
    public SantoDTO() {}
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; } public void setNome(String nome) { this.nome = nome; }
    public String getBiografia() { return biografia; } public void setBiografia(String biografia) { this.biografia = biografia; }
    public String getOracao() { return oracao; } public void setOracao(String oracao) { this.oracao = oracao; }
    public Integer getDia() { return dia; } public void setDia(Integer dia) { this.dia = dia; }
    public Integer getMes() { return mes; } public void setMes(Integer mes) { this.mes = mes; }
    public String getFestaLiturgica() { return festaLiturgica; } public void setFestaLiturgica(String festaLiturgica) { this.festaLiturgica = festaLiturgica; }
    public String getImagemUrl() { return imagemUrl; } public void setImagemUrl(String imagemUrl) { this.imagemUrl = imagemUrl; }
}