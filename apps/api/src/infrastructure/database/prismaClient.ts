// apps/api/src/infrastructure/database/prismaClient.ts
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from "dotenv"

dotenv.config();
// Força o Node a buscar o arquivo index exato do cliente gerado pelo Prisma v7
import { PrismaClient } from './generated-client/client'; 

if (!process.env.DATABASE_URL) {
  throw new Error("A variável de ambiente DATABASE_URL não foi definida.");
}

const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL 
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });