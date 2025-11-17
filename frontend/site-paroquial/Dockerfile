# ==========================================
# Dockerfile para Frontend Angular
# ==========================================
FROM node:20-alpine AS build

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação para produção
RUN npm run build

# ==========================================
# Imagem final (nginx)
# ==========================================
FROM nginx:alpine

# Copiar arquivos buildados
COPY --from=build /app/dist/site-paroquial/browser /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
