-- ========================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS
-- Sistema Paroquial Nossa Senhora Aparecida
-- PostgreSQL 14+
-- ========================================

-- Extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para busca textual eficiente

-- ========================================
-- 1. TABELA: USUARIOS
-- ========================================
CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL, -- Hash BCrypt
    role VARCHAR(20) NOT NULL DEFAULT 'VISUALIZADOR',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    ultimo_acesso TIMESTAMP,
    
    CONSTRAINT chk_role CHECK (role IN ('ADMIN', 'SECRETARIO', 'COORDENADOR', 'VISUALIZADOR'))
);

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_ativo ON usuarios(ativo);

-- ========================================
-- 2. TABELA: COMUNIDADES
-- ========================================
CREATE TABLE comunidades (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    nome_completo VARCHAR(200),
    padroeiro VARCHAR(100),
    endereco TEXT,
    telefone VARCHAR(20),
    email VARCHAR(100),
    responsavel VARCHAR(100),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_comunidades_ativo ON comunidades(ativo);

-- Inserir 7 comunidades da paróquia
INSERT INTO comunidades (nome, nome_completo, padroeiro) VALUES
('Matriz', 'Igreja Matriz Nossa Senhora Aparecida', 'Nossa Senhora Aparecida'),
('Imaculada Conceição', 'Comunidade Imaculada Conceição', 'Nossa Senhora da Imaculada Conceição'),
('Nossa Senhora das Graças', 'Comunidade Nossa Senhora das Graças', 'Nossa Senhora das Graças'),
('Sant''Ana', 'Comunidade Sant''Ana', 'Santa Ana'),
('Santa Cruz e São Roque', 'Comunidade Santa Cruz e São Roque', 'Santa Cruz e São Roque'),
('Sagrado Coração de Jesus', 'Comunidade Sagrado Coração de Jesus', 'Sagrado Coração de Jesus'),
('Bom Pastor', 'Comunidade Bom Pastor', 'Bom Pastor');

-- ========================================
-- 3. TABELA: SANTOS
-- ========================================
CREATE TABLE santos (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    titulo VARCHAR(300),
    biografia TEXT,
    oracao TEXT,
    dia INTEGER NOT NULL,
    mes INTEGER NOT NULL,
    festa_liturgica VARCHAR(100),
    data_nascimento DATE,
    data_morte DATE,
    canonizado_por VARCHAR(200),
    imagem_url VARCHAR(500),
    fonte VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    
    CONSTRAINT chk_dia CHECK (dia BETWEEN 1 AND 31),
    CONSTRAINT chk_mes CHECK (mes BETWEEN 1 AND 12)
);

-- Índices para busca eficiente
CREATE INDEX idx_santos_dia_mes ON santos(mes, dia);
CREATE INDEX idx_santos_nome ON santos USING gin(nome gin_trgm_ops);
CREATE INDEX idx_santos_biografia ON santos USING gin(biografia gin_trgm_ops);

-- Tabela auxiliar para padroeiros (relação many-to-many)
CREATE TABLE santo_padroeiro (
    santo_id BIGINT NOT NULL REFERENCES santos(id) ON DELETE CASCADE,
    padroeiro_de VARCHAR(200) NOT NULL,
    PRIMARY KEY (santo_id, padroeiro_de)
);

CREATE INDEX idx_santo_padroeiro_santo ON santo_padroeiro(santo_id);

-- ========================================
-- 4. TABELA: EVENTOS
-- ========================================
CREATE TABLE eventos (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    hora_inicio TIME,
    hora_fim TIME,
    tipo VARCHAR(50) NOT NULL,
    local VARCHAR(300),
    comunidade_responsavel VARCHAR(100),
    responsavel_contato VARCHAR(100),
    telefone_contato VARCHAR(20),
    observacoes TEXT,
    imagem_url VARCHAR(500),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    criado_por VARCHAR(100),
    
    CONSTRAINT chk_evento_tipo CHECK (tipo IN (
        'FESTA_RELIGIOSA', 'MISSA_ESPECIAL', 'NOVENA', 'RETIRO', 
        'REUNIAO', 'CURSO', 'ACAO_SOCIAL', 'CELEBRACAO', 
        'PROCISSAO', 'ADORACAO', 'CASAMENTO', 'BATIZADO', 
        'PRIMEIRA_COMUNHAO', 'CRISMA', 'OUTRO'
    )),
    CONSTRAINT chk_evento_datas CHECK (data_fim IS NULL OR data_fim >= data_inicio)
);

CREATE INDEX idx_eventos_data_inicio ON eventos(data_inicio);
CREATE INDEX idx_eventos_tipo ON eventos(tipo);
CREATE INDEX idx_eventos_ativo ON eventos(ativo);
CREATE INDEX idx_eventos_comunidade ON eventos(comunidade_responsavel);
CREATE INDEX idx_eventos_proximos ON eventos(data_inicio, ativo) WHERE ativo = TRUE;

-- ========================================
-- 5. TABELA: NOTICIAS
-- ========================================
CREATE TABLE noticias (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(300) NOT NULL,
    resumo VARCHAR(500),
    conteudo TEXT,
    tipo VARCHAR(50) NOT NULL,
    prioridade VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
    data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_expiracao TIMESTAMP,
    comunidade_origem VARCHAR(100),
    autor VARCHAR(100),
    imagem_url VARCHAR(500),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    destaque BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    criado_por VARCHAR(100),
    
    CONSTRAINT chk_noticia_tipo CHECK (tipo IN (
        'AVISO_GERAL', 'EVENTO', 'LITURGIA', 'PASTORAL', 
        'SOCIAL', 'FORMACAO', 'URGENTE', 'COMUNICADO_OFICIAL'
    )),
    CONSTRAINT chk_noticia_prioridade CHECK (prioridade IN (
        'BAIXA', 'NORMAL', 'ALTA', 'URGENTE'
    ))
);

CREATE INDEX idx_noticias_ativo ON noticias(ativo);
CREATE INDEX idx_noticias_destaque ON noticias(destaque) WHERE destaque = TRUE;
CREATE INDEX idx_noticias_tipo ON noticias(tipo);
CREATE INDEX idx_noticias_data_pub ON noticias(data_publicacao DESC);
CREATE INDEX idx_noticias_titulo ON noticias USING gin(titulo gin_trgm_ops);

-- ========================================
-- 6. TABELA: PASTORAIS
-- ========================================
CREATE TABLE pastorais (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    descricao_curta VARCHAR(500),
    descricao TEXT,
    coordenador VARCHAR(100),
    telefone_contato VARCHAR(20),
    email_contato VARCHAR(100),
    local_reuniao VARCHAR(200),
    horario_reuniao VARCHAR(100),
    imagem_url VARCHAR(500),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    destaque BOOLEAN NOT NULL DEFAULT FALSE,
    ordem_exibicao INTEGER DEFAULT 1,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP,
    criado_por VARCHAR(100),
    
    CONSTRAINT uq_pastoral_nome UNIQUE(nome)
);

CREATE INDEX idx_pastorais_ativo ON pastorais(ativo);
CREATE INDEX idx_pastorais_destaque ON pastorais(destaque) WHERE destaque = TRUE;
CREATE INDEX idx_pastorais_ordem ON pastorais(ordem_exibicao);

-- ========================================
-- 7. TABELA: INFORMACOES_PERMANENTES
-- (Horários de Missa, Catequese, Grupos, etc)
-- ========================================
CREATE TABLE informacoes_permanentes (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(50) NOT NULL,
    dia_semana VARCHAR(20), -- 'Segunda', 'Terça', etc
    horario TIME,
    local VARCHAR(200),
    responsavel VARCHAR(100),
    telefone_contato VARCHAR(20),
    observacoes TEXT,
    comunidade VARCHAR(100),
    ordem_exibicao INTEGER DEFAULT 1,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    destaque BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    criado_por VARCHAR(100),
    atualizado_em TIMESTAMP,
    atualizado_por VARCHAR(100),
    
    CONSTRAINT chk_info_tipo CHECK (tipo IN (
        'MISSA', 'CATEQUESE', 'GRUPO_ORACAO', 'GRUPO_JOVENS', 
        'CORAL', 'PASTORAL', 'CONSELHO', 'SECRETARIA', 
        'CONFISSAO', 'ADORACAO', 'CURSO', 'REUNIAO_FIXA', 
        'ATIVIDADE_INFANTIL', 'ACAO_SOCIAL', 'OUTRO'
    ))
);

CREATE INDEX idx_info_tipo ON informacoes_permanentes(tipo);
CREATE INDEX idx_info_comunidade ON informacoes_permanentes(comunidade);
CREATE INDEX idx_info_ativo ON informacoes_permanentes(ativo);
CREATE INDEX idx_info_destaque ON informacoes_permanentes(destaque) WHERE destaque = TRUE;

-- ========================================
-- 8. TABELA: CONTATOS_WHATSAPP
-- (Para envio de mensagens automáticas)
-- ========================================
CREATE TABLE contatos_whatsapp (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    comunidade VARCHAR(100),
    grupos_interesse TEXT[], -- Array de interesses: ['liturgia', 'eventos', 'pastorais']
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    aceite_termos BOOLEAN NOT NULL DEFAULT FALSE,
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultima_mensagem TIMESTAMP,
    
    CONSTRAINT uq_whatsapp_telefone UNIQUE(telefone)
);

CREATE INDEX idx_whatsapp_ativo ON contatos_whatsapp(ativo);
CREATE INDEX idx_whatsapp_comunidade ON contatos_whatsapp(comunidade);

-- ========================================
-- 9. VIEWS ÚTEIS
-- ========================================

-- View: Próximos eventos
CREATE VIEW v_proximos_eventos AS
SELECT 
    e.*,
    CASE 
        WHEN e.data_inicio = CURRENT_DATE THEN 'Hoje'
        WHEN e.data_inicio = CURRENT_DATE + INTERVAL '1 day' THEN 'Amanhã'
        ELSE TO_CHAR(e.data_inicio, 'DD/MM/YYYY')
    END as data_formatada
FROM eventos e
WHERE e.ativo = TRUE 
  AND e.data_inicio >= CURRENT_DATE
ORDER BY e.data_inicio, e.hora_inicio;

-- View: Notícias ativas e não expiradas
CREATE VIEW v_noticias_vigentes AS
SELECT n.*
FROM noticias n
WHERE n.ativo = TRUE
  AND (n.data_expiracao IS NULL OR n.data_expiracao > CURRENT_TIMESTAMP)
ORDER BY 
    n.prioridade DESC,
    n.destaque DESC,
    n.data_publicacao DESC;

-- View: Horários de missa por comunidade
CREATE VIEW v_horarios_missa AS
SELECT 
    i.comunidade,
    i.dia_semana,
    i.horario,
    i.local,
    i.observacoes
FROM informacoes_permanentes i
WHERE i.tipo = 'MISSA'
  AND i.ativo = TRUE
ORDER BY 
    i.comunidade,
    CASE i.dia_semana
        WHEN 'Segunda' THEN 1
        WHEN 'Terça' THEN 2
        WHEN 'Quarta' THEN 3
        WHEN 'Quinta' THEN 4
        WHEN 'Sexta' THEN 5
        WHEN 'Sábado' THEN 6
        WHEN 'Domingo' THEN 7
    END,
    i.horario;

-- ========================================
-- 10. FUNÇÕES ÚTEIS
-- ========================================

-- Função: Buscar santo do dia
CREATE OR REPLACE FUNCTION buscar_santo_do_dia(p_dia INTEGER, p_mes INTEGER)
RETURNS TABLE (
    id BIGINT,
    nome VARCHAR(200),
    titulo VARCHAR(300),
    biografia TEXT,
    oracao TEXT,
    festa_liturgica VARCHAR(100),
    padroeiros TEXT[]
) AS \$\$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.nome,
        s.titulo,
        s.biografia,
        s.oracao,
        s.festa_liturgica,
        ARRAY_AGG(sp.padroeiro_de) as padroeiros
    FROM santos s
    LEFT JOIN santo_padroeiro sp ON s.id = sp.santo_id
    WHERE s.dia = p_dia AND s.mes = p_mes
    GROUP BY s.id, s.nome, s.titulo, s.biografia, s.oracao, s.festa_liturgica;
END;
\$\$ LANGUAGE plpgsql;

-- Função: Contar eventos por tipo
CREATE OR REPLACE FUNCTION contar_eventos_por_tipo()
RETURNS TABLE (tipo VARCHAR, total BIGINT) AS \$\$
BEGIN
    RETURN QUERY
    SELECT e.tipo, COUNT(*) as total
    FROM eventos e
    WHERE e.ativo = TRUE
    GROUP BY e.tipo
    ORDER BY total DESC;
END;
\$\$ LANGUAGE plpgsql;

-- ========================================
-- 11. TRIGGERS
-- ========================================

-- Trigger: Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION atualizar_updated_at()
RETURNS TRIGGER AS \$\$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;

CREATE TRIGGER trg_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_updated_at();

CREATE TRIGGER trg_santos_updated_at
    BEFORE UPDATE ON santos
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_updated_at();

CREATE TRIGGER trg_pastorais_updated_at
    BEFORE UPDATE ON pastorais
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_updated_at();

CREATE TRIGGER trg_comunidades_updated_at
    BEFORE UPDATE ON comunidades
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_updated_at();

-- ========================================
-- 12. DADOS INICIAIS
-- ========================================

-- Usuário administrador padrão (senha: admin123)
INSERT INTO usuarios (nome, email, senha, role) VALUES
('Administrador', 'admin@paroquia.com', '\\\', 'ADMIN');

-- Algumas informações permanentes de exemplo (Matriz)
INSERT INTO informacoes_permanentes (titulo, tipo, dia_semana, horario, comunidade, ativo, destaque) VALUES
('Missa na Matriz', 'MISSA', 'Quarta', '19:30:00', 'Matriz', TRUE, TRUE),
('Missa na Matriz', 'MISSA', 'Quinta', '07:00:00', 'Matriz', TRUE, TRUE),
('Missa na Matriz', 'MISSA', 'Sexta', '19:30:00', 'Matriz', TRUE, TRUE),
('Missa na Matriz', 'MISSA', 'Sábado', '12:00:00', 'Matriz', TRUE, TRUE),
('Missa na Matriz', 'MISSA', 'Domingo', '11:00:00', 'Matriz', TRUE, TRUE),
('Missa na Matriz', 'MISSA', 'Domingo', '19:00:00', 'Matriz', TRUE, TRUE);

-- ========================================
-- 13. COMENTÁRIOS NAS TABELAS
-- ========================================
COMMENT ON TABLE usuarios IS 'Usuários do sistema com autenticação JWT';
COMMENT ON TABLE comunidades IS '7 comunidades da Paróquia Nossa Senhora Aparecida';
COMMENT ON TABLE santos IS 'Santos católicos com datas de festa litúrgica';
COMMENT ON TABLE eventos IS 'Eventos especiais da paróquia (festas, novenas, etc)';
COMMENT ON TABLE noticias IS 'Notícias e comunicados paroquiais';
COMMENT ON TABLE pastorais IS 'Pastorais e grupos da paróquia';
COMMENT ON TABLE informacoes_permanentes IS 'Horários fixos: missas, catequese, reuniões';
COMMENT ON TABLE contatos_whatsapp IS 'Contatos para envio de mensagens automáticas';

-- ========================================
-- FIM DO SCRIPT
-- ========================================
