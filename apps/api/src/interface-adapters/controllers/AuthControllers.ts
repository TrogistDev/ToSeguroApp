import { Request, Response } from "express";
import { AuthService } from "../../core/use-cases/AuthService";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { CreateUserUseCase } from "../../core/use-cases/CreateUserUseCase";
import { EmailService } from "../../infrastructure/external-services/emailService";

import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

export class AuthController {
  private createUserUseCase = new CreateUserUseCase();

  private authService = new AuthService(
    new UserRepository()
  );

  private emailService = new EmailService();

  // =========================================
  // LOGIN TRADICIONAL
  // =========================================
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email e senha são obrigatórios.",
      });
    }

    try {
      const authResult = await this.authService.authenticate(
        email,
        password
      );

      return res.json({
        token: authResult.token,
        user: authResult.user,
        tenantSlug: authResult.tenantSlug,
      });

    } catch (error: any) {

      console.log("========================================");
      console.error("🔥 LOGIN ERROR:", error);
      console.log("========================================");

      return res.status(401).json({
        error: error.message || "Credenciais inválidas.",
      });
    }
  }

  // =========================================
  // LOGIN GOOGLE
  // =========================================
  async googleLogin(req: Request, res: Response) {
    try {
      const { googleToken } = req.body;

      console.log("📥 GOOGLE TOKEN RECEBIDO");

      if (!googleToken) {
        return res.status(400).json({
          error: "Google token ausente",
        });
      }

      // =========================================
      // VALIDA TOKEN COM GOOGLE
      // =========================================
      const ticket = await googleClient.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      console.log("📦 PAYLOAD GOOGLE:", payload);
      if (!payload) {
        return res.status(401).json({
          error: "Payload Google inválido",
        });
      }

      const email = payload.email;

      if (!email) {
        return res.status(401).json({
          error: "E-mail Google não encontrado",
        });
      }

      // =========================================
      // BUSCA USUÁRIO NO SISTEMA
      // =========================================
      const authResult = await this.authService.loginWithGoogle(
        email
      );

      console.log("✅ LOGIN GOOGLE AUTORIZADO");

      return res.status(200).json({
        token: authResult.token,
        user: authResult.user,
        tenantSlug: authResult.tenantSlug,
      });

    } catch (error: any) {

      console.log("========================================");
      console.error("🔥 GOOGLE LOGIN ERROR:");
      console.error(error);
      console.log("========================================");

      return res.status(401).json({
        error: error.message || "Falha autenticação Google",
      });
    }
  }

  // =========================================
  // CRIAÇÃO ADMIN
  // =========================================
  async createByAdmin(req: Request, res: Response) {

    const {
      email,
      firstName,
      lastName,
      role,
    } = req.body;

    const adminTenantId = (req as any).user?.tenantId;

    const adminRole = (req as any).user?.role;

    if (adminRole !== "ADMIN") {
      return res.status(403).json({
        error:
          "Apenas administradores podem criar usuários.",
      });
    }

    if (
      !email ||
      !firstName ||
      !lastName ||
      !role
    ) {
      return res.status(400).json({
        error: "Todos os campos são obrigatórios.",
      });
    }

    try {

      const user =
        await this.createUserUseCase.execute({
          email,
          firstName,
          lastName,
          role,
          tenantId: adminTenantId,
        });

      return res.status(201).json({
        message:
          "Usuário criado com sucesso.",

        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });

    } catch (error: any) {

      console.log("========================================");
      console.error("🔥 CREATE USER ERROR:", error);
      console.log("========================================");

      return res.status(400).json({
        error: error.message,
      });
    }
  }
}