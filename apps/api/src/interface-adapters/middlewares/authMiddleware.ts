import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { tenantStorage } from "../../core/context/TenantContext";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  // 1. Defesa Rígida: Verifica se o cabeçalho Authorization foi enviado
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Acesso negado: Token de autenticação obrigatório." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2. Validação estrita do Token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // 3. Recupera o contexto do Tenant ativo no AsyncLocalStorage
    const context = tenantStorage.getStore();
    
    // Se o contexto existir (rotas envelopadas), fazemos a validação cruzada anti-fraude
    if (context?.tenantId && decoded.tenantId !== context.tenantId) {
      return res
        .status(403)
        .json({ error: "Operação ilegal: Tentativa de acesso cross-tenant detectada e bloqueada!" });
    }

    // 4. Injeta os dados decodificados do usuário na requisição para consumo seguro nos controllers
    (req as any).user = decoded; 

    return next();
    
  } catch (err) {
    return res.status(401).json({ error: "Sessão inválida: Token corrompido ou expirado." });
  }
};