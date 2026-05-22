import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { tenantMiddleware } from "../middlewares/tenantMiddleware";
import { createAdminRouter } from "./admin.router";
import { createAccidentRouter } from "./accident.router";

export function createProtectedApiRouter() {
  const router = express.Router();
  router.use(authMiddleware);
  router.use(tenantMiddleware);

  router.use(createAdminRouter());
  router.use(createAccidentRouter());

  return router;
}
