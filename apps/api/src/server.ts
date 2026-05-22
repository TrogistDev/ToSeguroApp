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
import { ExportAccidentUseCase } from "./core/use-cases/ExportAccidentUseCase.js";
import { AuthController } from "./interface-adapters/controllers/AuthControllers";

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

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3001",
  "http://13.60.56.153:3001",
  "http://ec2-13-60-56-153.eu-north-1.compute.amazonaws.com:3001"
];

app.use(cors({
  origin: (origin, callback) => {
    // Permite requests sem origem (como ferramentas de API ou curl)
    if (!origin) return callback(null, true);
    
    // Verifica se a origem está na lista ou se é o nosso servidor AWS
    if (allowedOrigins.includes(origin) || origin.includes("ec2-13-60-56-153.eu-north-1.compute.amazonaws.com")) {
      callback(null, true);
    } else {
      console.log("❌ Bloqueado por CORS: Origem recebida:", origin);
      callback(new Error("Bloqueado por política estrita de CORS do ToSeguro"));
    }
  },
  credentials: true
}));

app.use(express.json());

// --- Endpoint de Infraestrutura NATIVO (Bypass de logs e middlewares) ---
app.get("/health", (req, res) => {
  return res.status(200).json({ 
    status: "healthy", 
    timestamp: new Date().toISOString() 
  });
});

const authController = new AuthController();

// --- 🔓 Rotas de Autenticação Públicas (Grupo Isolado) ---
const publicAuthRoutes = express.Router();
publicAuthRoutes.post("/login", (req, res) => authController.login(req, res));
publicAuthRoutes.post("/google", (req, res) => authController.googleLogin(req, res));

// Aplica o prefixo /api/auth nas rotas públicas de login
app.use("/api/auth", publicAuthRoutes);


// --- 🔒 Rotas de Negócio e Gestão (100% Blindadas com Auth e Tenant) ---
const protectedRoutes = express.Router();
protectedRoutes.use(authMiddleware);
protectedRoutes.use(tenantMiddleware);

// Endpoint de Admin movido para dentro do contexto seguro de Tenant de forma rígida
protectedRoutes.post("/auth/admin-create", (req, res) => authController.createByAdmin(req, res));

// Endpoints de Sinistros
const accidentRepo = new AccidentRepository();
const exportAccidentUseCase = new ExportAccidentUseCase(accidentRepo);
const accidentController = new AccidentController(accidentRepo, exportAccidentUseCase);

protectedRoutes.post("/accidents", accidentController.store);
protectedRoutes.get("/accidents", accidentController.getAll);
protectedRoutes.get("/accidents/presigned-url", accidentController.getPresignedUrl);
protectedRoutes.get("/accidents/photo-url", accidentController.getPhotoUrl.bind(accidentController));
protectedRoutes.get("/accidents/:id/export", accidentController.getExport.bind(accidentController));

// Aplica o prefixo /api nas rotas que exigem token e tenant id
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