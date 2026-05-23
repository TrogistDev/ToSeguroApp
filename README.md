# ToSeguroApp

ToSeguroApp é um projeto de relatório de acidentes com arquitetura frontend + backend. A aplicação inclui:

- `apps/api`: API em Node.js + Express + TypeScript
- `apps/web`: frontend em React + Vite + TypeScript
- `apps/docker-compose.yml`: configuração Docker para executar frontend, backend e banco de dados PostgreSQL

## Estrutura principal

- `apps/api`: servidor API, rotas, uso de Prisma, autenticação e geração de relatórios de acidentes
- `apps/web`: interface do usuário, formulários de cadastro de acidentes, login e painel administrativo

## Tecnologias

- Node.js + Express
- TypeScript
- React + Vite
- PostgreSQL
- Docker Compose
- Playwright para testes E2E

## Como executar localmente

### 1. Backend

```bash
cd apps/api
npm install
npm run dev
```

A API padrão roda em `http://localhost:3000`.

### 2. Frontend

```bash
cd apps/web
npm install
npm run dev
```

O frontend Vite normalmente roda em `http://localhost:3001`.

## Executando com Docker Compose

No diretório `apps`, use o compose para levantar frontend, backend e banco de dados:

```bash
cd apps
docker compose up --build
```

## Variáveis de ambiente

A API utiliza `dotenv` para carregar variáveis de ambiente. O frontend utiliza `VITE_API_URL` em produção.

Exemplos de variáveis importantes:

- `VITE_API_URL`
- `AWS_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_BUCKET_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

## Testes

### Backend E2E

```bash
cd apps/api
npm run test:e2e
```

### Frontend E2E

```bash
cd apps/web
npm run test:e2e
```

## Observações

- O serviço Docker Compose está em `apps/docker-compose.yml`.
- Caso use o frontend em modo de desenvolvimento, configure `VITE_API_URL` se necessário.
