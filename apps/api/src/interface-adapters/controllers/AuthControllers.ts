// apps/api/src/interface-adapters/controllers/AuthController.ts
import { Request, Response } from "express";
import { AuthService } from "../../core/use-cases/AuthService";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import bcrypt from "bcrypt";
import { CreateUserUseCase } from "../../core/use-cases/CreateUserUseCase";
import { EmailService } from "../../infrastructure/external-services/emailService";

export class AuthController {
  private createUserUseCase = new CreateUserUseCase();
  // Passamos o repositório para o serviço cuidar do ciclo de vida dos dados
  private authService = new AuthService(new UserRepository());
  private emailService = new EmailService(); // ✅ Instanciação segura na camada de infraestrutura/adaptadores

  // 1. Login Tradicional - Descoberta Dinâmica de Tenant por E-mail
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    // Defesa estrita na entrada de dados: tenantSlug removido da validação obrigatória
    if (!email || !password) {
      return res.status(400).json({
        error: "Email e senha são campos obrigatórios.",
      });
    }

    try {
      // O AuthService agora é encarregado de buscar o usuário pelo e-mail,
      // validar a senha e extrair o Tenant implícito dele na base
      const authResult = await this.authService.authenticate(email, password);

      // Retorna os dados, incluindo o slug descoberto internamente para o front se situar
      return res.json({
        token: authResult.token,
        user: authResult.user,
        tenantSlug: authResult.tenantSlug,
      });
    } catch (error: any) {
      // Retornos de segurança sem dar pistas se o e-mail ou a senha estão errados (Prevenção de Enumeração)
      console.log("========================================");
      console.error("🔥 ERRO DO PRISMA NO TERMINAL DA API:", error);
      console.log("========================================");
      return res
        .status(401)
        .json({ error: error.message || "Credenciais inválidas." });
    }
  }

  // 2. Google OAuth Flow - Sem barreira de Tenant no clique do Frontend
  async googleLogin(req: Request, res: Response) {
    const { googleToken } = req.body;

    if (!googleToken) {
      return res.status(400).json({
        error: "O token de autenticação do Google é obrigatório.",
      });
    }

    try {
      // O fluxo decodifica o token obtido do Google client, extrai o e-mail,
      // valida na base de dados global se o usuário existe e traz seu Tenant associado
      const authResult = await this.authService.loginWithGoogle(googleToken);

      return res.json({
        token: authResult.token,
        user: authResult.user,
        tenantSlug: authResult.tenantSlug,
      });
    } catch (error: any) {
      console.log("========================================");
      console.error("🔥 ERRO DO PRISMA NO TERMINAL DA API:", error);
      console.log("========================================");
      // Se o usuário não existir no banco de dados, devolvemos 403 (Acesso Proibido)
      return res
        .status(403)
        .json({ error: error.message || "Falha na autenticação via Google." });
    }
  }

  // 3. Registro de Usuário por Administrador
  async createByAdmin(req: Request, res: Response) {
    const { email, firstName, lastName, role } = req.body;

    const adminTenantId = (req as any).user?.tenantId;
    const adminRole = (req as any).user?.role;

    if (adminRole !== "ADMIN") {
      return res
        .status(403)
        .json({
          error:
            "Acesso negado: Apenas administradores podem executar esta ação.",
        });
    }

    if (!email || !firstName || !lastName || !role) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios." });
    }

    try {
      // Executa a criação no banco de dados isolado por Tenant
      const user = await this.createUserUseCase.execute({
        email,
        firstName,
        lastName,
        role,
        tenantId: adminTenantId, // ← remova passwordHash aqui!
      });
      // ✅ Disparo assíncrono em background: não bloqueia a resposta HTTP da API

      // 🔐 Defesa Rígida: 'tempPassword' REMOVIDA do retorno JSON para o administrador
      return res.status(201).json({
        message:
          "Usuário pré-autorizado criado com sucesso. O e-mail de acesso foi enviado ao destinatário.",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error: any) {
      console.log("========================================");
      console.error("🔥 ERRO DO PRISMA NO TERMINAL DA API:", error);
      console.log("========================================");
      return res.status(400).json({ error: error.message });
    }
  }
}
