import { test, expect } from '@playwright/test';

const BACKEND_API = process.env.API_URL || 'http://localhost:3000/api';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Deve exibir o formulário de login e enviar credenciais com sucesso', async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    await page.route(`${BACKEND_API}/auth/login`, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          token: 'fake-jwt-token',
          tenantSlug: 'test-tenant',
          user: { id: 'user-1', email: 'test@example.com', name: 'Test User', role: 'USER' },
        }),
      });
    });

    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/sinistros\/novo|\/dashboard/);
  });
});
