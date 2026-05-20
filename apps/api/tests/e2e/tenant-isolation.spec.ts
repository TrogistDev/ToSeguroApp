import { test, expect } from '@playwright/test';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

test.describe('Security: Multi-tenant Isolation Audit', () => {
  
  // Setup: Criamos um token de teste para o Tenant A e outro para o Tenant B
  let tokenTenantA: string;
  let tokenTenantB: string;

  test.beforeAll(async () => {
    // TODO: [REQUERIMENTO] Em um ambiente real, você usaria uma rota de 'test-setup' 
    // ou faria o login via API para obter estes tokens programaticamente.
    tokenTenantA = 'token_pre_gerado_para_tenant_A'; 
    tokenTenantB = 'token_pre_gerado_para_tenant_B';
  });

  test('CRITICAL: Should prevent cross-tenant data leakage', async ({ request }) => {
    // 1. Verificamos se o Tenant A consegue ver seus próprios acidentes
    const responseA = await request.get(`${API_URL}/accidents`, {
      headers: { 
        'Authorization': `Bearer ${tokenTenantA}`,
        'x-tenant-id': 'uuid-tenant-a' 
      }
    });
    expect(responseA.status()).toBe(200);
    const dataA = await responseA.json();

    // 2. Tentamos acessar o mesmo endpoint usando as credenciais do Tenant B
    const responseB = await request.get(`${API_URL}/accidents`, {
      headers: { 
        'Authorization': `Bearer ${tokenTenantB}`,
        'x-tenant-id': 'uuid-tenant-b' 
      }
    });

    // 3. VALIDAÇÃO DO ISOLAMENTO
    const dataB = await responseB.json();
    
    // O teste passa se nenhum ID de acidente pertencente ao Tenant A estiver presente na resposta do B
    const leakedAccident = dataB.find((acc: any) => 
      dataA.some((a: any) => a.id === acc.id)
    );

    expect(leakedAccident).toBeUndefined();
  });
});
