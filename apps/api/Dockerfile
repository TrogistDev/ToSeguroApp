# Build stage
FROM node:22.12.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Copia o schema do prisma antes para cachear as dependências corretamente
COPY prisma ./prisma/ 
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM node:22.12.0-alpine
WORKDIR /app

RUN apk add --no-cache dumb-init

# Criar usuário non-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY package*.json ./

# Instala dependências de produção e força a geração do Prisma Client
RUN npm ci --only=production && \
    npm cache clean --force

# Copiar build e a pasta do prisma do estágio anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Gerar o Prisma Client nativo dentro do container de produção antes de mudar o owner
RUN npx prisma generate

# Mudar permissões para o utilizador seguro
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]