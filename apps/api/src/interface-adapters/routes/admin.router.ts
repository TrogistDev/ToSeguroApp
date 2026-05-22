import express from "express";
import { AuthController } from "../controllers/AuthControllers";

export function createAdminRouter() {
  const router = express.Router();
  const authController = new AuthController();

  router.post("/auth/admin-create", (req, res) =>
    authController.createByAdmin(req, res),
  );

  return router;
}
