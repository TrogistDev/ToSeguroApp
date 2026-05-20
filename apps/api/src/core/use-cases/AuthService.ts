// apps/api/src/core/use-cases/AuthService.ts
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { prisma } from '../../infrastructure/database/prismaClient';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {
  constructor(private userRepo: UserRepository) {}

  // 1. Login Tradicional - Descoberta Dinâmica por E-mail
  async authenticate(email: string, passwordRaw: string) {
    // Busca o usuário globalmente pelo e-mail e traz os dados do Tenant acoplados
    const user = await prisma.user.findUnique({
      where: { email },
      include: { tenant: true } // Traz o relacionamento mapeado no schema.prisma
    });

    // Se o usuário não existe ou não tem passwordHash (ex: conta exclusiva Google OAuth)
    if (!user || !user.passwordHash) {
      throw new Error("Credenciais inválidas. Verifique os dados digitados.");
    }

    // Validação rígida da senha com bcrypt
    const isMatch = await bcrypt.compare(passwordRaw, user.passwordHash);
    if (!isMatch) {
      throw new Error("Credenciais inválidas. Verifique os dados digitados.");
    }

    const token = this.generateToken(user);

    return {
      token,
      tenantSlug: user.tenant.slug, // Devolvemos o slug dinâmico para o front-end salvar na Store
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        role: user.role
      }
    };
  }

  // 2. Google OAuth Flow - Identificação baseada no cadastro prévio
  async loginWithGoogle(googleToken: string) {
    try {
      // Valida o token direto com a API do Google usando a biblioteca oficial
      const ticket = await googleClient.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new Error("Token do Google inválido ou sem e-mail associado.");
      }

      const googleEmail = payload.email;

      // REQUISITO CRÍTICO: Busca o usuário pelo e-mail verificado e traz o Tenant implícito
      const user = await prisma.user.findUnique({
        where: { email: googleEmail },
        include: { tenant: true }
      });
      
      if (!user) {
        throw new Error("Acesso negado: Este e-mail do Google não está cadastrado ou autorizado no sistema.");
      }

      // Emite o JWT legítimo contendo os escopos de isolamento
      const token = this.generateToken(user);

      return {
        token,
        tenantSlug: user.tenant.slug, // Informa o front-end sobre o Tenant mapeado
        user: {
          id: user.id,
          email: user.email,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          role: user.role
        }
      };
    } catch (error: any) {
      console.error("Erro na validação do Google OAuth:", error.message);
      throw new Error(error.message || "Falha na autenticação via Google.");
    }
  }

  /**
   * Centraliza a assinatura do token blindando o payload.
   * Mapeia estritamente 'id', 'tenantId' e 'role' para consumo seguro nos middlewares e controllers.
   */
  private generateToken(user: any) {
    if (!process.env.JWT_SECRET) {
      throw new Error("Erro de Infraestrutura: Chave secreta JWT_SECRET não definida no ambiente.");
    }

    return jwt.sign(
      { 
        id: user.id,        // Mapeado como id para bater com o middleware de autenticação
        tenantId: user.tenantId, 
        role: user.role     // Injeção explícita da ROLE para validação do RBAC (ADMIN/USER)
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
  }
}