import { Request, Response, NextFunction } from "express";
import { tenantStorage } from "../../core/context/TenantContext";

export const tenantMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authenticatedTenantId = (req as any).user?.tenantId;
    const headerTenantId = req.headers["x-tenant-id"] as string;

    const tenantId = authenticatedTenantId || headerTenantId;

    if (!tenantId) {
      return res.status(403).json({
        error: "Acesso Proibido",
        message: "Não foi possível estabelecer o contexto de isolamento corporativo (Tenant ID ausente).",
        debug: { headerReceived: req.headers["x-tenant-id"] }
      });
    }

    (req as any).tenantId = tenantId;

    console.log("🔍 Debug Tenant Middleware:", {
      authenticatedTenantId,
      headerTenantId,
      finalTenantId: tenantId
    });

    // Executa a árvore assíncrona garantindo o encadeamento do Next
    return tenantStorage.run({ tenantId }, () => {
      next();
    });
    
  } catch (error) {
    console.error("[SECURITY CRITICAL] Error in Tenant Isolation Middleware:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Erro crítico ao estabelecer barreira de isolamento do cliente.",
    });
  }
};