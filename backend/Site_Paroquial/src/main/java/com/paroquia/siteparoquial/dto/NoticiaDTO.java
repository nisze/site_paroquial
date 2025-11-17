package com.paroquia.siteparoquial.dto;
public class NoticiaDTO {
    private Long id; private String titulo; private String conteudo; private String resumo; private String autor; private java.time.LocalDate dataPublicacao;
    private String tipo; private Boolean ativo; private String imagemUrl;
    public NoticiaDTO() {}
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; } public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getConteudo() { return conteudo; } public void setConteudo(String conteudo) { this.conteudo = conteudo; }
    public String getResumo() { return resumo; } public void setResumo(String resumo) { this.resumo = resumo; }
    public String getAutor() { return autor; } public void setAutor(String autor) { this.autor = autor; }
    public java.time.LocalDate getDataPublicacao() { return dataPublicacao; } public void setDataPublicacao(java.time.LocalDate dataPublicacao) { this.dataPublicacao = dataPublicacao; }
    public String getTipo() { return tipo; } public void setTipo(String tipo) { this.tipo = tipo; }
    public Boolean getAtivo() { return ativo; } public void setAtivo(Boolean ativo) { this.ativo = ativo; }
    public String getImagemUrl() { return imagemUrl; } public void setImagemUrl(String imagemUrl) { this.imagemUrl = imagemUrl; }
}