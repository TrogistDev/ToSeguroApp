// apps/web/tests/e2e/accidentReport.spec.ts
import { test, expect } from '@playwright/test';

const BACKEND_API = process.env.API_URL || 'http://localhost:3000/api';

test.describe('Fluxo do Formulário de Relato de Sinistro (AccidentReportForm)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Deve renderizar o passo 1 e avançar para o passo 2', async ({ page }) => {
    await expect(page.locator('h2:has-text("Relatar Sinistro")')).toBeVisible();
    await expect(page.locator('span:has-text("Passo 1 de 3")')).toBeVisible();

    await page.fill('input[placeholder="Su nombre"]', 'Gustavo');
    await page.fill('input[placeholder="Apellido"]', 'Developer');
    await page.selectOption('select', { label: 'Colisión' });
    await page.fill('input[placeholder="Digite o endereço ou use GPS"]', 'Av. Paulista, 1000');

    await page.click('button:has-text("Continuar")');
    await expect(page.locator('span:has-text("Passo 2 de 3")')).toBeVisible();
  });

  test('Deve submeter relatório e exibir alerta de sucesso', async ({ page }) => {
    await page.fill('input[placeholder="Su nombre"]', 'Gustavo');
    await page.fill('input[placeholder="Apellido"]', 'Developer');
    await page.selectOption('select', { label: 'Colisión' });
    await page.fill('input[placeholder="Digite o endereço ou use GPS"]', 'Av. Paulista, 1000');

    await page.click('button:has-text("Continuar")');
    await page.click('button:has-text("Siguiente")');
    await expect(page.locator('span:has-text("Passo 3 de 3")')).toBeVisible();

    await page.route(`${BACKEND_API}/accidents`, (route) => {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'fake-accident-id' }),
      });
    });

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Sinistro relatado com sucesso');
      await dialog.accept();
    });

    await page.click('button:has-text("Finalizar reporte")');
    await expect(page.locator('span:has-text("Passo 1 de 3")')).toBeVisible();
  });
});