# ==========================================
# Dockerfile para Backend Spring Boot
# ==========================================
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app

# Copiar arquivos do Maven
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Dar permissão de execução ao mvnw (necessário no Linux)
RUN chmod +x ./mvnw

# Baixar dependências
RUN ./mvnw dependency:go-offline -B

# Copiar código fonte
COPY src src

# Build da aplicação
RUN ./mvnw package -DskipTests

# ==========================================
# Imagem final (runtime)
# ==========================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copiar JAR da etapa de build
COPY --from=build /app/target/*.jar app.jar

# Expor porta
EXPOSE 8080

# Variáveis de ambiente padrão
ENV SPRING_PROFILES_ACTIVE=prod
ENV DATABASE_URL=jdbc:h2:mem:paroquia
ENV FRONTEND_URL=http://localhost:4200

# Executar aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
