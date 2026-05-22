# Build stage
FROM node:22.12.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
COPY .env .env

RUN npm run build

# Runtime stage - Nginx para servir arquivos estáticos
FROM nginx:alpine

# Copiar assets buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Criar usuário non-root para segurança rígida
RUN addgroup -g 1001 -S nginx-custom && \
    adduser -S nginx-custom -u 1001

# Change ownership and permissions de forma estrita para evitar falhas de socket
RUN chown -R nginx-custom:nginx-custom /usr/share/nginx/html && \
    chown -R nginx-custom:nginx-custom /var/cache/nginx && \
    chown -R nginx-custom:nginx-custom /var/log/nginx && \
    chown -R nginx-custom:nginx-custom /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx-custom:nginx-custom /var/run/nginx.pid && \
    mkdir -p /var/lib/nginx/tmp && \
    chown -R nginx-custom:nginx-custom /var/lib/nginx

USER nginx-custom

EXPOSE 3001

# Healthcheck blindado usando curl ou wget nativo do alpine
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3001/ || exit 1

CMD ["nginx", "-g", "daemon off;"]