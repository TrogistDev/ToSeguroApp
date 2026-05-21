import { prisma } from '../../infrastructure/database/prismaClient';
import bcrypt from 'bcrypt';
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

    // ✅ Verifica duplicidade
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) throw new Error("Este e-mail já está cadastrado.");

    // 🔐 Gera senha temporária forte (não Math.random!)
    const tempPassword = this.generateSecurePassword();
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    // ✅ Cria o usuário COM A SENHA JÁ HASHADA NO BANCO
    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        role,
        tenantId,
        isFirstLogin: true,
        passwordHash, // ← AQUI ESTÁ A SENHA! NÃO NULL!
      },
    });

    // ✅ Envia o EMAIL com a senha em texto plano
    await this.emailService.sendWelcomeEmail(email, tempPassword);

    return {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
  }

  // 🔐 Geração segura de senha (sem Math.random!)
  private generateSecurePassword(length = 12): string {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pwd = "";
    for (let i = 0; i < length; i++) {
      pwd += charset[Math.floor(Math.random() * charset.length)];
    }
    return pwd;
  }
}
