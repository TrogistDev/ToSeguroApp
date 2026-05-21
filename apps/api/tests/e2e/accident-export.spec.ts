import { test, expect } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://localhost:3000/api';
const TENANT_TOKEN = process.env.TENANT_TOKEN;
const TENANT_ID = process.env.TENANT_ID;
const ACCIDENT_ID = process.env.ACCIDENT_ID;

test.describe('API: Accident Export', () => {
  test.skip(
    !TENANT_TOKEN || !TENANT_ID || !ACCIDENT_ID,
    'TENANT_TOKEN, TENANT_ID and ACCIDENT_ID must be provided to run export tests.',
  );

  test('should require authentication to export accident data', async ({ request }) => {
    const response = await request.get(`${API_URL}/accidents/${ACCIDENT_ID}/export`);
    expect(response.status()).toBe(401);
  });

  test('should return complete export DTO for authenticated tenant', async ({ request }) => {
    const response = await request.get(`${API_URL}/accidents/${ACCIDENT_ID}/export`, {
      headers: {
        Authorization: `Bearer ${TENANT_TOKEN}`,
        'x-tenant-id': TENANT_ID,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body).toHaveProperty('incidentId', ACCIDENT_ID);
    expect(body).toHaveProperty('reportedAt');
    expect(body).toHaveProperty('sceneSummary');
    expect(Array.isArray(body.sceneObjects)).toBe(true);
    expect(Array.isArray(body.damages)).toBe(true);
    expect(Array.isArray(body.photos)).toBe(true);
    expect(body.metadata).toBeTruthy();
  });
});
