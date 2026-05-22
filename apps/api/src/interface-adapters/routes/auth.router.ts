import express from "express";
import { AuthController } from "../controllers/AuthControllers";

export function createAuthRouter() {
  const authController = new AuthController();
  const router = express.Router();

  router.post("/login", (req, res) => authController.login(req, res));
  router.post("/google", (req, res) => authController.googleLogin(req, res));

  return router;
}
