import { Router } from "express";
import { AccidentController } from "../controllers/AccidentController";
import { AccidentRepository } from "../../infrastructure/repositories/AccidentRepository";
import { ExportAccidentUseCase } from "../../core/use-cases/ExportAccidentUseCase";

export function createAccidentRouter(): Router {
  const router = Router();
  
  // Inversão de Dependências limpa
  const accidentRepo = new AccidentRepository();
  const exportAccidentUseCase = new ExportAccidentUseCase(accidentRepo);
  const accidentController = new AccidentController(
    accidentRepo,
    exportAccidentUseCase
  );

  // ✅ ARQUITETURA CORRIGIDA: Uso de Arrow Functions garante que o 'this' aponta para o Controller
  router.post("/accidents", (req, res) => accidentController.store(req, res));
  router.get("/accidents", (req, res) => accidentController.getAll(req, res));
  
  router.get("/accidents/presigned-url", (req, res) => accidentController.getPresignedUrl(req, res));
  router.get("/accidents/photo-url", (req, res) => accidentController.getPhotoUrl(req, res));
  router.get("/accidents/:id/export", (req, res) => accidentController.getExport(req, res));

  return router;
}