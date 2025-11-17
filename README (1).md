# Sistema Paroquial - Nossa Senhora Aparecida

<div align="center">

![Demo do Sistema](docs/paroquia.gif)

**Plataforma web completa para gestão e comunicação paroquial**

[![Angular](https://img.shields.io/badge/Angular-20-red?logo=angular)](https://angular.io/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-green?logo=springboot)](https://spring.io/projects/spring-boot)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://www.docker.com/)

</div>

---

## Sobre o Projeto

O **Sistema Paroquial** é uma solução web desenvolvida para facilitar a comunicação e gestão de atividades em paróquias católicas. A plataforma oferece funcionalidades como consulta de horários de missas, calendário litúrgico, leitura da Bíblia Sagrada, notícias paroquiais, informações sobre grupos e pastorais, e muito mais.

### Principais Funcionalidades

- **Calendário Litúrgico** - Acompanhe as celebrações e santos do dia
- **Bíblia Online** - Pesquisa avançada nas Escrituras Sagradas (API Almeida)
- **Horários de Missas** - Consulta de horários e localização
- **Notícias Paroquiais** - Sistema de notícias com imagens e categorias
- **Grupos e Pastorais** - Informações sobre ministérios e atividades
- **Liturgia Diária** - Leituras do dia integradas
- **Design Responsivo** - Funciona perfeitamente em mobile e desktop
- **Painel Administrativo** - Gestão completa de conteúdo

---

## Tecnologias Utilizadas

### Frontend
- **Angular 20** - Framework web moderno
- **TypeScript 5.9** - Linguagem tipada
- **SCSS** - Estilização avançada
- **Bootstrap 5** - Framework CSS responsivo
- **Font Awesome 6** - Biblioteca de ícones
- **RxJS 7** - Programação reativa

### Backend
- **Spring Boot 3.5** - Framework Java enterprise
- **Java 21** - LTS mais recente
- **Spring Data JPA** - Persistência de dados
- **H2 Database** - Banco em memória (desenvolvimento)
- **PostgreSQL** - Banco relacional (produção - estrutura preparada)
- **Flyway** - Migrations e versionamento do banco
- **Maven** - Gerenciamento de dependências
- **JSoup** - Web scraping para liturgia diária

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers
- **Nginx** - Servidor web para frontend
- **Git** - Controle de versão

---

## Executando com Docker

### Pré-requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado
- Git instalado

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/nisze/shrimp-church.git
cd shrimp-church
```

2. **Inicie os containers**
```bash
docker compose up -d --build
```

3. **Aguarde o build** (primeira execução ~5-10 minutos)

4. **Acesse a aplicação**
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8081
- **H2 Console**: http://localhost:8081/h2-console

### Comandos Úteis

```bash
# Parar os containers
docker compose down

# Ver logs em tempo real
docker compose logs -f

# Ver logs de um serviço específico
docker compose logs -f backend
docker compose logs -f frontend

# Reiniciar um serviço
docker compose restart backend

# Rebuild completo
docker compose up -d --build --force-recreate

# Remover tudo (containers, volumes, imagens)
docker compose down -v --rmi all
```

---

## Executando em Desenvolvimento

### Backend (Spring Boot)

```bash
cd backend/Site_Paroquial
./mvnw spring-boot:run
```

Acesse: http://localhost:8080

### Frontend (Angular)

```bash
cd frontend/site-paroquial
npm install
npm start
```

Acesse: http://localhost:4200

---

## Estrutura do Projeto

```
shrimp-church/
├── backend/
│   └── Site_Paroquial/          # Aplicação Spring Boot
│       ├── src/
│       ├── pom.xml
│       └── Dockerfile
├── frontend/
│   └── site-paroquial/          # Aplicação Angular
│       ├── src/
│       │   ├── app/
│       │   │   ├── pages/       # Páginas da aplicação
│       │   │   ├── shared/      # Componentes compartilhados
│       │   │   └── services/    # Serviços e APIs
│       │   └── assets/          # Imagens e recursos
│       ├── package.json
│       ├── Dockerfile
│       └── nginx.conf
├── docs/                        # Documentação do projeto
├── docker-compose.yml
└── README.md
```

---

## Equipe de Desenvolvimento

Este projeto foi desenvolvido como trabalho acadêmico do 5º semestre por:

<table>
  <tr>
    <td align="center">
      <b>Denise Korgiski de Oliveira</b>
    </td>
    <td align="center">
      <b>João Vinicius Fonseca Diniz</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <b>Luiz Antonio Pereira Lima</b>
    </td>
    <td align="center">
      <b>Leandro Nicolas Silveira Gonçalves</b>
    </td>
  </tr>
</table>

---

## Documentação Adicional

- [PRD - Product Requirements Document](docs/markdown/PRD-FINAL-ATUALIZADO-2025.md)
- [Documentação Técnica Completa](docs/markdown/DOCUMENTACAO-TECNICA-COMPLETA.md)
- [Manual do Usuário](docs/markdown/MANUAL-USUARIO-PADRE.md)
- [Aspectos Legais e Compliance](docs/markdown/ASPECTOS-LEGAIS-COMPLIANCE.md)
- [Guia Docker Detalhado](README-DOCKER.md)

---

## Funcionalidades Detalhadas

### Módulo Bíblia
- Pesquisa avançada por palavra-chave
- Filtros por testamento (AT/NT)
- Busca exata ou por palavras
- Cache local de versículos populares
- Navegação por livros e capítulos
- Interface inspirada em Bíblias tradicionais

### Sistema de Notícias
- Categorização de notícias (Avisos, Eventos, Pastoral, etc.)
- Upload e gerenciamento de imagens
- Editor visual de conteúdo
- Sistema de destaque para notícias importantes
- Listagem paginada e filtros

### Grupos e Pastorais
- Cadastro de grupos paroquiais
- Informações de contato e horários
- Descrição detalhada de cada ministério
- Sistema de categorização

### Horários de Missas
- Grade completa de horários semanais
- Informações de localização
- Missas especiais e eventos
- Integração com Google Maps

### Calendário Litúrgico
- Santos do dia
- Cor litúrgica
- Tempo litúrgico (Advento, Quaresma, etc.)
- Festas móveis e fixas

---

## Segurança e Boas Práticas

- Validação de dados no frontend e backend
- CORS configurado adequadamente
- Autenticação administrativa implementada (mock para desenvolvimento)
- Proteção contra SQL Injection via JPA/Hibernate
- Variáveis de ambiente para configurações sensíveis
- Docker multi-stage builds para otimização
- Nginx configurado com boas práticas
- Schema SQL versionado com Flyway migrations

---

## Diferenciais do Projeto

- **Interface Moderna e Intuitiva** - Design responsivo e acessível
- **Performance Otimizada** - Cache inteligente e lazy loading
- **Fácil Deploy** - Docker ready para produção
- **Escalável** - Arquitetura preparada para crescimento
- **Manutenível** - Código limpo e bem documentado
- **Integração Externa** - API da Bíblia e web scraping para liturgia

---

## Roadmap Futuro

- [ ] Autenticação JWT completa com Spring Security
- [ ] Sistema de permissões granulares (roles e permissions)
- [ ] Notificações push para eventos
- [ ] App mobile nativo (iOS/Android)
- [ ] Sistema de doações online
- [ ] Transmissão ao vivo de missas
- [ ] Pedidos de oração online
- [ ] Chat com pastoral
- [ ] Integração com redes sociais
- [ ] Migração completa para PostgreSQL em produção

---

## Contato e Suporte

Para dúvidas, sugestões ou reportar problemas:

- Entre em contato com a equipe de desenvolvimento
- Abra uma [issue no GitHub](https://github.com/nisze/shrimp-church/issues)
- Consulte a [documentação completa](docs/)

---

<div align="center">

**Desenvolvido pela equipe do 5º Semestre**

*Projeto Acadêmico - 2025*

</div>