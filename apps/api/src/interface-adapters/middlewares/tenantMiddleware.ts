// apps/api/src/interface-adapters/middlewares/tenantIsolationMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { tenantStorage } from "../../core/context/TenantContext";

/**
 * MIDDLEWARE DE ISOLAMENTO MULTI-TENANT (CORE SECURITY)
 * * Primeira linha de defesa contra vazamento de dados (Cross-Tenant Data Leaks).
 * Garante que o tenantId esteja disponível em toda a árvore de execução assíncrona (AsyncLocalStorage).
 */
export const tenantMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 1. Extração segura: Prioridade máxima para o Tenant extraído do JWT pelo AuthMiddleware.
    // Fallback secundário para o Header x-tenant-id (útil para integrações/webhooks públicos).
    const authenticatedTenantId = (req as any).user?.tenantId;
    const headerTenantId = req.headers["x-tenant-id"] as string;

    const tenantId = authenticatedTenantId || headerTenantId;

    // 2. Validação Rígida de Presença de Contexto
    if (!tenantId) {
      return res.status(403).json({
        error: "Acesso Proibido",
        message: "Não foi possível estabelecer o contexto de isolamento corporativo (Tenant ID ausente).",
      });
    }

    // 3. Mutação Segura do Objeto Request (Para controllers que não usam o AsyncLocalStorage)
    (req as any).tenantId = tenantId;
console.log("🔍 Debug Tenant Middleware:", {
  authenticatedTenantId: (req as any).user?.tenantId,
  headerTenantId: req.headers["x-tenant-id"],
  finalTenantId: tenantId
});
    // 4. Injeção no Contexto Assíncrono Isolado (AsyncLocalStorage)
    // Isola de forma determinística qualquer operação de banco ou log abaixo desta árvore
    tenantStorage.run({ tenantId }, () => {
      return next();
    });
    
  } catch (error) {
    console.error("[SECURITY CRITICAL] Error in Tenant Isolation Middleware:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Erro crítico ao estabelecer barreira de isolamento do cliente.",
    });
  }
};