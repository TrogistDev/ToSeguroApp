// apps/api/src/server.ts
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createAuthRouter } from "./interface-adapters/routes/auth.router";
import { createProtectedApiRouter } from "./interface-adapters/routes/protected-api.router";

console.log("🔍 Verificando Variáveis AWS:", {
  region: process.env.AWS_REGION,
  key: process.env.AWS_ACCESS_KEY_ID ? "CARREGADA" : "AUSENTE",
  secret: process.env.AWS_SECRET_ACCESS_KEY ? "CARREGADA" : "AUSENTE",
  bucket: process.env.AWS_BUCKET_NAME,
});

const app = express();

// ✅ CORREÇÃO: Removemos o COOP rígido do Helmet global para não quebrar o SDK da Google no client-side
app.use(
  helmet({
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);

// ✅ CONFIGURAÇÃO DE CORS BLINDADA PARA PRODUÇÃO (Substitui apenas este bloco no server.ts)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3001",

  "http://13.60.56.153:3001",
  "http://13.60.56.153:3000",

  "http://ec2-13-60-56-153.eu-north-1.compute.amazonaws.com:3001",
  "http://ec2-13-60-56-153.eu-north-1.compute.amazonaws.com:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS BLOCKED:", origin);

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-tenant-id"],
  }),
);

app.use(express.json());

// --- Endpoint de Infraestrutura NATIVO ---
app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", createAuthRouter());
app.use("/api", createProtectedApiRouter());

const PORT = process.env.PORT || 3000;
try {
  console.log("⏳ Tentando inicializar o servidor Express...");

  const server = app.listen(PORT, () => {
    console.log("========================================");
    console.log(`🚀 RÍGIDO SERVER EXECUTANDO NA PORTA ${PORT}`);
    console.log("========================================");
  });

  server.on("error", (error: any) => {
    console.error("🔥 ERRO CRÍTICO AO SUBIR O SERVIDOR HTTP:", error);
  });
} catch (bootError) {
  console.error("💥 FALHA CRÍTICA NO BOOTSTRAP DO EXPRESS:", bootError);
}
