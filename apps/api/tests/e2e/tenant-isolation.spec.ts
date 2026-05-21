import { test, expect } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://localhost:3000/api';
const TENANT_A_TOKEN = process.env.TENANT_A_TOKEN;
const TENANT_B_TOKEN = process.env.TENANT_B_TOKEN;
const TENANT_A_ID = process.env.TENANT_A_ID;
const TENANT_B_ID = process.env.TENANT_B_ID;

test.describe('Security: Multi-tenant Isolation Audit', () => {
  test.skip(
    !TENANT_A_TOKEN || !TENANT_B_TOKEN || !TENANT_A_ID || !TENANT_B_ID,
    'Set TENANT_A_TOKEN, TENANT_B_TOKEN, TENANT_A_ID and TENANT_B_ID to run this test.',
  );

  test('CRITICAL: should prevent cross-tenant data leakage', async ({ request }) => {
    const responseA = await request.get(`${API_URL}/accidents`, {
      headers: {
        Authorization: `Bearer ${TENANT_A_TOKEN}`,
        'x-tenant-id': TENANT_A_ID,
      },
    });

    expect(responseA.status()).toBe(200);
    const dataA = await responseA.json();

    const responseB = await request.get(`${API_URL}/accidents`, {
      headers: {
        Authorization: `Bearer ${TENANT_B_TOKEN}`,
        'x-tenant-id': TENANT_B_ID,
      },
    });

    expect([200, 403]).toContain(responseB.status());

    if (responseB.status() === 200) {
      const dataB = await responseB.json();
      const leakedAccident = dataB.find((acc: any) =>
        dataA.some((a: any) => a.id === acc.id),
      );
      expect(leakedAccident).toBeUndefined();
    }
  });
});
