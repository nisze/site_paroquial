# Arquitetura do Backend - Sistema Paroquial

## Padrão de Arquitetura: MVC em Camadas

### 1. Camada de Apresentação (Controllers)
**Localização:** `src/main/java/com/paroquia/siteparoquial/controllers/`

**Responsabilidade:** Receber requisições HTTP, validar entrada, chamar services e retornar respostas.

**Controllers criados:**
- `HelloController.java` - Endpoints de status
- `EventoController.java` - API pública de eventos  
- `LiturgiaController.java` - API pública de liturgia
- `NoticiaController.java` - API pública de notícias
- `AdminEventoController.java` - CRUD administrativo de eventos
- `AdminNoticiaController.java` - CRUD administrativo de notícias
- `AdminPastoralController.java` - CRUD administrativo de pastorais
- `AdminSantoController.java` - CRUD administrativo de santos
- `AuthController.java` - Autenticação de administradores

### 2. Camada de Negócio (Services)
**Localização:** `src/main/java/com/paroquia/siteparoquial/services/`

**Responsabilidade:** Lógica de negócio, validações, transformações e orquestração.

**Services criados:**
- `EventoService.java` - Regras de negócio para eventos
- `NoticiaService.java` - Regras de negócio para notícias
- `PastoralService.java` - Regras de negócio para pastorais
- `SantoService.java` - Regras de negócio para santos

### 3. Camada de Dados (Repositories)
**Localização:** `src/main/java/com/paroquia/siteparoquial/repositories/`

**Responsabilidade:** Acesso ao banco de dados usando Spring Data JPA.

**Repositories criados:**
- `EventoRepository.java` - Interface JPA para eventos
- `NoticiaRepository.java` - Interface JPA para notícias
- `PastoralRepository.java` - Interface JPA para pastorais
- `SantoRepository.java` - Interface JPA para santos

### 4. Camada de Modelo (Entities)
**Localização:** `src/main/java/com/paroquia/siteparoquial/entities/`

**Responsabilidade:** Representar tabelas do banco de dados.

**Entities criadas:**
- `Evento.java` - Tabela `eventos`
- `Noticia.java` - Tabela `noticias`
- `Pastoral.java` - Tabela `pastorais`
- `Santo.java` - Tabela `santos`

### 5. Objetos de Transferência (DTOs)
**Localização:** `src/main/java/com/paroquia/siteparoquial/dto/`

**Responsabilidade:** Transferir dados entre camadas, proteger entities da exposição direta.

**DTOs criados:**
- `EventoDTO.java` - Dados de evento para API
- `NoticiaDTO.java` - Dados de notícia para API
- `PastoralDTO.java` - Dados de pastoral para API
- `SantoDTO.java` - Dados de santo para API

## Fluxo de Dados

```
Cliente (Frontend Angular)
    ↓
Controller (Recebe requisição HTTP)
    ↓
Service (Aplica lógica de negócio)
    ↓
Repository (Acessa banco de dados)
    ↓
Entity (Representa tabela do banco)
    ↓
Repository (Retorna dados)
    ↓
Service (Converte para DTO se necessário)
    ↓
Controller (Retorna resposta JSON)
    ↓
Cliente (Frontend Angular)
```

## Banco de Dados

### Atual: H2 (Em Memória)
- **Vantagens:** Sem instalação, rápido, perfeito para desenvolvimento
- **Desvantagens:** Dados são perdidos ao reiniciar

### Migração para PostgreSQL:
1. Adicionar dependência no `pom.xml`:
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

2. Descomentar configuração PostgreSQL em `application.properties`
3. Criar banco `paroquia` no PostgreSQL
4. Reiniciar aplicação

**As tabelas serão criadas automaticamente pelo Hibernate!**

## Tabelas do Banco de Dados

### eventos
- id (BIGSERIAL PRIMARY KEY)
- titulo (VARCHAR NOT NULL)
- descricao (TEXT)
- data (DATE NOT NULL)
- hora (TIME)
- local (VARCHAR)
- data_criacao (TIMESTAMP)
- data_atualizacao (TIMESTAMP)

### noticias
- id (BIGSERIAL PRIMARY KEY)
- titulo (VARCHAR NOT NULL)
- conteudo (TEXT)
- resumo (VARCHAR)
- autor (VARCHAR)
- data_publicacao (DATE)
- data_criacao (TIMESTAMP)

### pastorais
- id (BIGSERIAL PRIMARY KEY)
- nome (VARCHAR NOT NULL)
- descricao (TEXT)
- coordenador (VARCHAR)
- contato (VARCHAR)
- horario (VARCHAR)
- data_criacao (TIMESTAMP)

### santos
- id (BIGSERIAL PRIMARY KEY)
- nome (VARCHAR NOT NULL)
- biografia (TEXT)
- oracao (TEXT)
- dia (INTEGER)
- mes (INTEGER)
- festa_liturgica (VARCHAR)
- data_criacao (TIMESTAMP)

## Tecnologias Utilizadas

- **Spring Boot 3.5.5** - Framework principal
- **Spring Data JPA** - ORM e persistência
- **Hibernate 6.6** - Implementação JPA
- **H2 Database** - Banco em memória (desenvolvimento)
- **PostgreSQL** - Banco de produção (opcional)
- **Maven** - Gerenciamento de dependências
- **Java 21** - Linguagem de programação

## Padrões de Projeto Utilizados

1. **MVC (Model-View-Controller)** - Separação em camadas
2. **DTO (Data Transfer Object)** - Transferência de dados
3. **Repository Pattern** - Abstração de acesso a dados
4. **Dependency Injection** - Inversão de controle
5. **RESTful API** - Arquitetura de APIs

## Segurança

- CORS habilitado para todas as origens (desenvolvimento)
- Autenticação básica no `AuthController`
- Em produção: implementar Spring Security + JWT

## Como Rodar

1. Instalar Java 21
2. Abrir projeto no IntelliJ IDEA
3. Aguardar Maven baixar dependências
4. Executar `SiteParoquialApplication.java`
5. Acessar `http://localhost:8080`

## Para Produção

1. Configurar PostgreSQL
2. Atualizar `application.properties`
3. Implementar Spring Security
4. Configurar variáveis de ambiente
5. Fazer build: `mvn clean package`
6. Executar JAR: `java -jar target/site-paroquial-0.0.1-SNAPSHOT.jar`