# Build stage
FROM node:22.12.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/ 
# Adicionada a flag para contornar o conflito do mailtrap/nodemailer
RUN npm ci --legacy-peer-deps
COPY . .
ENV DATABASE_URL="postgresql://mock_user:mock_pass@localhost:5432/mock_db?schema=public"

RUN npx prisma generate --schema=./prisma/schema.prisma
RUN echo '{"type": "commonjs"}' > ./src/infrastructure/database/generated-client/package.json
RUN npm run build
RUN cp -r ./src/infrastructure/database/generated-client ./dist/infrastructure/database/generated-client
# Runtime stage
FROM node:22.12.0-alpine
WORKDIR /app

RUN apk add --no-cache dumb-init

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY package*.json ./

# Adicionada a flag também na instalação limpa de produção
RUN npm ci --only=production --legacy-peer-deps && \
    npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma


RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]