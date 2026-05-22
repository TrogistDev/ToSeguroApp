import express from "express";
import { AccidentController } from "../controllers/AccidentController";
import { AccidentRepository } from "../../infrastructure/repositories/AccidentRepository";
import { ExportAccidentUseCase } from "../../core/use-cases/ExportAccidentUseCase";

export function createAccidentRouter() {
  const router = express.Router();
  const accidentRepo = new AccidentRepository();
  const exportAccidentUseCase = new ExportAccidentUseCase(accidentRepo);
  const accidentController = new AccidentController(
    accidentRepo,
    exportAccidentUseCase,
  );

  router.post("/accidents", accidentController.store);
  router.get("/accidents", accidentController.getAll);
  router.get("/accidents/presigned-url", accidentController.getPresignedUrl);
  router.get(
    "/accidents/photo-url",
    accidentController.getPhotoUrl.bind(accidentController),
  );
  router.get(
    "/accidents/:id/export",
    accidentController.getExport.bind(accidentController),
  );

  return router;
}
