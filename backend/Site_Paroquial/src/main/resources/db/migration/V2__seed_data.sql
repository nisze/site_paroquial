-- ==============================================
-- V2__seed_data.sql
-- Dados iniciais para o sistema
-- ==============================================

-- Inserir 7 comunidades da paróquia
INSERT INTO comunidades (nome, nome_completo, padroeiro) VALUES
('Matriz', 'Igreja Matriz Nossa Senhora Aparecida', 'Nossa Senhora Aparecida'),
('Imaculada Conceição', 'Comunidade Imaculada Conceição', 'Nossa Senhora da Imaculada Conceição'),
('Nossa Senhora das Graças', 'Comunidade Nossa Senhora das Graças', 'Nossa Senhora das Graças'),
('Sant''Ana', 'Comunidade Sant''Ana', 'Santa Ana'),
('Santa Cruz e São Roque', 'Comunidade Santa Cruz e São Roque', 'Santa Cruz e São Roque'),
('Sagrado Coração de Jesus', 'Comunidade Sagrado Coração de Jesus', 'Sagrado Coração de Jesus'),
('Bom Pastor', 'Comunidade Bom Pastor', 'Bom Pastor');

-- Usuário administrador padrão
-- Senha: admin123 (hash BCrypt)
INSERT INTO usuarios (nome, email, senha, role) VALUES
('Administrador', 'admin@paroquia.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN');

-- Horários de missa da Matriz
INSERT INTO informacoes_permanentes (titulo, tipo, dia_semana, horario, comunidade, ativo, destaque) VALUES
('Missa na Matriz', 'MISSA', 'Quarta', '19:30:00', 'Matriz', TRUE, TRUE),
('Missa na Matriz', 'MISSA', 'Quinta', '07:00:00', 'Matriz', TRUE, TRUE),
('Missa na Matriz - 1ª do mês', 'MISSA', 'Sexta', '19:30:00', 'Matriz', TRUE, TRUE),
('Missa na Matriz - 1º do mês', 'MISSA', 'Sábado', '12:00:00', 'Matriz', TRUE, TRUE),
('Missa na Matriz', 'MISSA', 'Domingo', '11:00:00', 'Matriz', TRUE, TRUE),
('Missa na Matriz', 'MISSA', 'Domingo', '19:00:00', 'Matriz', TRUE, TRUE);
