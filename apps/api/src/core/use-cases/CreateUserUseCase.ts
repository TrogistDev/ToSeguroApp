// apps/api/src/core/use-cases/CreateUserUseCase.ts
import { prisma } from '../../infrastructure/database/prismaClient';

interface CreateUserDTO {
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
  passwordHash: string;
  tenantId: string;
}

export class CreateUserUseCase {
  async execute(data: CreateUserDTO) {
    // 1. Defesa: Verifica se o e-mail já existe de forma global no sistema
    const userExists = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (userExists) {
      throw new Error("Este e-mail já está cadastrado no sistema.");
    }

    // 2. Cria o usuário estritamente vinculado ao Tenant do administrador
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        passwordHash: data.passwordHash,
        tenantId: data.tenantId,
        isFirstLogin: true // Força o fluxo de troca de senha no primeiro acesso se necessário
      }
    });

    return {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    };
  }
}