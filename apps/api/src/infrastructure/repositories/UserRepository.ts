// apps/api/src/infrastructure/repositories/UserRepository.ts
import { prisma } from '../../infrastructure/database/prismaClient';

export interface UserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  passwordHash: string;
  tenantId: string;
}

export class UserRepository {
  // Busca o usuário de forma estrita pelo e-mail na base de dados global
  async findByEmail(email: string): Promise<UserDTO | null> {
    if (!email) return null;
    
    return prisma.user.findUnique({
      where: { email },
    }) as Promise<UserDTO | null>;
  }

  // Criação de novos usuários pelo Administrador
  async create(data: Omit<UserDTO, 'id'>): Promise<UserDTO> {
    return prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        passwordHash: data.passwordHash,
        tenantId: data.tenantId,
      },
    }) as Promise<UserDTO>;
  }
}