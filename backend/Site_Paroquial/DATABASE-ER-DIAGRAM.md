# 📊 Diagrama Entidade-Relacionamento
## Sistema Paroquial - PostgreSQL

```
┌─────────────────┐
│    USUARIOS     │
├─────────────────┤
│ id (PK)         │
│ nome            │
│ email (UNIQUE)  │
│ senha           │
│ role            │──┐
│ ativo           │  │ Criado por (1:N)
└─────────────────┘  │
                     │
┌─────────────────┐  │
│   COMUNIDADES   │  │
├─────────────────┤  │
│ id (PK)         │  │
│ nome (UNIQUE)   │──┼─┐
│ nome_completo   │  │ │ Pertence a (1:N)
│ padroeiro       │  │ │
│ endereco        │  │ │
└─────────────────┘  │ │
                     │ │
┌─────────────────┐  │ │
│     SANTOS      │  │ │
├─────────────────┤  │ │
│ id (PK)         │  │ │
│ nome            │  │ │
│ titulo          │  │ │
│ biografia       │  │ │
│ dia             │  │ │
│ mes             │  │ │
│ imagem_url      │  │ │
└─────────────────┘  │ │
        │            │ │
        │ 1:N        │ │
        ▼            │ │
┌──────────────────┐ │ │
│ SANTO_PADROEIRO  │ │ │
├──────────────────┤ │ │
│ santo_id (FK)    │ │ │
│ padroeiro_de     │ │ │
└──────────────────┘ │ │
                     │ │
┌─────────────────┐  │ │
│    EVENTOS      │  │ │
├─────────────────┤  │ │
│ id (PK)         │  │ │
│ titulo          │  │ │
│ data_inicio     │  │ │
│ tipo            │  │ │
│ comunidade_resp │──┘ │
│ imagem_url      │    │
│ criado_por      │────┘
└─────────────────┘

┌─────────────────┐
│    NOTICIAS     │
├─────────────────┤
│ id (PK)         │
│ titulo          │
│ conteudo        │
│ tipo            │
│ prioridade      │
│ comunidade_orig │────┐
│ imagem_url      │    │
│ destaque        │    │ Pertence a
└─────────────────┘    │
                       │
┌─────────────────┐    │
│   PASTORAIS     │    │
├─────────────────┤    │
│ id (PK)         │    │
│ nome (UNIQUE)   │    │
│ coordenador     │    │
│ imagem_url      │    │
│ destaque        │    │
└─────────────────┘    │
                       │
┌──────────────────────┐│
│ INFORMACOES_PERM     ││
├──────────────────────┤│
│ id (PK)              ││
│ tipo                 ││
│ dia_semana           ││
│ horario              ││
│ comunidade           │┘
│ destaque             │
└──────────────────────┘

┌─────────────────┐
│CONTATOS_WHATSAPP│
├─────────────────┤
│ id (PK)         │
│ telefone (UNIQ) │
│ comunidade      │────┘
│ grupos_interesse│
└─────────────────┘
```

## 🔗 Relacionamentos

### Diretos (Foreign Keys):
- **santo_padroeiro.santo_id** → santos.id (1:N)

### Lógicos (sem FK, flexibilidade):
- eventos.comunidade_responsavel → comunidades.nome
- eventos.criado_por → usuarios.email
- noticias.comunidade_origem → comunidades.nome
- noticias.criado_por → usuarios.email
- informacoes_permanentes.comunidade → comunidades.nome
- contatos_whatsapp.comunidade → comunidades.nome

## 💡 Por que alguns relacionamentos são lógicos?

1. **Flexibilidade**: Permite soft deletes sem quebrar integridade
2. **Histórico**: Mantém dados mesmo se comunidade for desativada
3. **Performance**: Menos JOINs obrigatórios
4. **Simplicidade**: Mais fácil de consultar

## 📈 Índices Criados

### Performance de Busca:
- **GIN** (Generalized Inverted Index):
  - santos.nome, santos.biografia → Busca textual
  - noticias.titulo → Busca de notícias

### Performance de Filtros:
- Índices compostos: eventos(data_inicio, ativo)
- Índices parciais: WHERE ativo = TRUE, WHERE destaque = TRUE
- Índices simples: Por tipo, comunidade, data

## 📊 Estatísticas Estimadas

| Tabela | Registros Esperados |
|--------|---------------------|
| usuarios | 10-50 |
| comunidades | 7 (fixo) |
| santos | 365+ |
| eventos | 100-500/ano |
| noticias | 200-1000/ano |
| pastorais | 15-30 |
| informacoes_permanentes | 50-100 |
| contatos_whatsapp | 500-2000 |

## 🎯 Queries Mais Comuns (Otimizadas)

1. **Liturgia do dia**: SELECT * FROM buscar_santo_do_dia(16, 11)
2. **Próximos eventos**: SELECT * FROM v_proximos_eventos
3. **Notícias vigentes**: SELECT * FROM v_noticias_vigentes
4. **Horários de missa**: SELECT * FROM v_horarios_missa WHERE comunidade = 'Matriz'
5. **Buscar santo**: SELECT * FROM santos WHERE nome ILIKE '%francisco%' (usa GIN)

