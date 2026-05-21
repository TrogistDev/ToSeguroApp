import { prisma } from '../../infrastructure/database/prismaClient';
import bcrypt from 'bcrypt';
import { generateSecureResetToken, hashToken } from '../utils/secureToken';
import { EmailService } from '../../infrastructure/external-services/emailService';

interface CreateUserDTO {
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
  tenantId: string;
}

export class CreateUserUseCase {
  private readonly emailService = new EmailService();

  async execute(data: CreateUserDTO) {
    const { email, firstName, lastName, role, tenantId } = data;

    // Verifica duplicidade
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) throw new Error("Este e-mail já está cadastrado.");

    // Cria usuário sem senha inicial (obriga reset no primeiro acesso)
    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        role,
        tenantId,
        isFirstLogin: true,
        passwordHash: null, // ← Sim, explícito
      },
    });

    // Gera e armazena token único (SHA-256 no DB)
    const rawToken = generateSecureResetToken(64);
    await prisma.passwordResetToken.create({
      data: {
        userId: newUser.id,
        tokenHash: hashToken(rawToken),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1h
        used: false,
      },
    });

    // Envia email com link de reset (não a senha!)
    await this.emailService.sendPasswordResetEmail(email, rawToken);

    return {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
  }
}
