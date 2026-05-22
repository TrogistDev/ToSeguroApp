import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { UserRepository } from "../../infrastructure/repositories/UserRepository";

import { prisma } from "../../infrastructure/database/prismaClient";

export class AuthService {
  constructor(private userRepo: UserRepository) {}

  // =========================================
  // LOGIN TRADICIONAL
  // =========================================
  async authenticate(
    email: string,
    passwordRaw: string
  ) {

    const user = await prisma.user.findUnique({
      where: {
        email,
      },

      include: {
        tenant: true,
      },
    });

    if (!user || !user.passwordHash) {
      throw new Error(
        "Credenciais inválidas."
      );
    }

    const isMatch = await bcrypt.compare(
      passwordRaw,
      user.passwordHash
    );

    if (!isMatch) {
      throw new Error(
        "Credenciais inválidas."
      );
    }

    const token = this.generateToken(user);

    return {
      token,

      tenantSlug: user.tenant.slug,

      user: {
        id: user.id,
        email: user.email,
        name:
          `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        role: user.role,
      },
    };
  }

  // =========================================
  // LOGIN GOOGLE
  // =========================================
  async loginWithGoogle(email: string) {

    console.log("🔍 BUSCANDO USUÁRIO:", email);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },

      include: {
        tenant: true,
      },
    });

    if (!user) {
      throw new Error(
        "Usuário Google não autorizado."
      );
    }

    const token = this.generateToken(user);

    return {
      token,

      tenantSlug: user.tenant.slug,

      user: {
        id: user.id,
        email: user.email,
        name:
          `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        role: user.role,
      },
    };
  }

  // =========================================
  // JWT
  // =========================================
  private generateToken(user: any) {

    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET não configurada."
      );
    }

    return jwt.sign(
      {
        id: user.id,

        tenantId: user.tenantId,

        role: user.role,

        email: user.email,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "8h",
      }
    );
  }
}