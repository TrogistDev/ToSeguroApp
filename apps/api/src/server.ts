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
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-tenant-id",
    ],
  }),
);

app.options("*", cors());

app.use(express.json());

// --- Endpoint de Infraestrutura NATIVO ---
app.get("/health", (req, res) => {
  return res.status(200).json({ 
    status: "healthy", 
    timestamp: new Date().toISOString() 
  });
});

const authController = new AuthController();

// --- 🔓 Rotas de Autenticação Públicas (Grupo Isolado) ---
const publicAuthRoutes = express.Router();

// ✅ CORREÇÃO: Removemos totalmente os setHeaders manuais de COOP que causavam o erro 401 invalid_client
publicAuthRoutes.post("/login", (req, res) => authController.login(req, res));
publicAuthRoutes.post("/google", (req, res) => authController.googleLogin(req, res));

// Aplica o prefixo /api/auth nas rotas públicas de login
app.use("/api/auth", publicAuthRoutes);


// --- 🔒 Rotas de Negócio e Gestão (100% Blindadas com Auth e Tenant) ---
const protectedRoutes = express.Router();
protectedRoutes.use(authMiddleware);
protectedRoutes.use(tenantMiddleware);

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