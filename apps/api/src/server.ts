// apps/api/src/server.ts
import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { authMiddleware } from "./interface-adapters/middlewares/authMiddleware";
import { tenantMiddleware } from "./interface-adapters/middlewares/tenantMiddleware";
import { AccidentController } from "./interface-adapters/controllers/AccidentController";
import { AccidentRepository } from "./infrastructure/repositories/AccidentRepository";
import { ExportAccidentUseCase } from "../src/core/use-cases/ExportAccidentUseCase.js";
import { AuthController } from "./interface-adapters/controllers/AuthControllers"; // <-- Corrigido para o singular 'AuthController'
console.log("🔍 Verificando Variáveis AWS:", {
  region: process.env.AWS_REGION,
  key: process.env.AWS_ACCESS_KEY_ID ? "CARREGADA" : "AUSENTE",
  secret: process.env.AWS_SECRET_ACCESS_KEY ? "CARREGADA" : "AUSENTE",
  bucket: process.env.AWS_BUCKET_NAME,
});

const app = express();

// Middlewares de Segurança Globais - Ajustado para permitir pop-ups cruzados (Google OAuth)
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// --- Rotas Públicas (Abertas) ---
const authController = new AuthController();
app.post("/api/auth/login", (req, res) => authController.login(req, res));
app.post("/api/auth/google", (req, res) =>
  authController.googleLogin(req, res),
);
app.post("/api/auth/admin-create", authMiddleware, (req, res) =>
  authController.createByAdmin(req, res),
);

// --- Repositórios e Casos de Uso ---
const accidentRepo = new AccidentRepository();
const exportAccidentUseCase = new ExportAccidentUseCase(accidentRepo);
const accidentController = new AccidentController(
  accidentRepo,
  exportAccidentUseCase,
);

// ORDEM CORRETA: Primeiro autentica o token, depois isola o contexto do Tenant
const protectedRoutes = express.Router();
protectedRoutes.use(authMiddleware);
protectedRoutes.use(tenantMiddleware);

// Endpoints de Negócio (Agora 100% Blindados)
// app.post("/api/accidents", accidentController.store);
protectedRoutes.post("/accidents", accidentController.store);
protectedRoutes.get("/accidents", accidentController.getAll);
protectedRoutes.get(
  "/accidents/presigned-url",
  accidentController.getPresignedUrl,
);
protectedRoutes.get(
  "/accidents/photo-url",
  accidentController.getPhotoUrl.bind(accidentController),
);
protectedRoutes.get(
  "/accidents/:id/export",
  accidentController.getExport.bind(accidentController),
);
app.use("/api", protectedRoutes);

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
