// apps/api/src/core/context/TenantContext.ts
import { AsyncLocalStorage } from 'node:async_hooks';

export interface TenantStore {
  tenantId: string;
}

// Este storage é isolado por escopo de execução assíncrona e vive durante o ciclo de vida da request
export const tenantStorage = new AsyncLocalStorage<TenantStore>();