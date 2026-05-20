// apps/web/tests/e2e/accidentReport.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Fluxo do Formulário de Relato de Sinistro (AccidentReportForm)', () => {
  
  test.beforeEach(async ({ page }) => {
    // Acessa a página do formulário local (ajuste a rota se necessário, ex: /report)
    await page.goto('/'); 
  });

  test('Deve renderizar o Passo 1 corretamente e validar campos obrigatórios', async ({ page }) => {
    // 1. Verifica se o cabeçalho do formulário está visível
    const header = page.locator('h2:has-text("Relatar Sinistro")');
    await expect(header).toBeVisible();

    // 2. Verifica se o badge indica "Passo 1 de 3"
    const stepBadge = page.locator('span:has-text("Passo 1 de 3")');
    await expect(stepBadge).toBeVisible();

    // 3. Valida que o botão "Siguiente" inicia desabilitado devido às travas rígidas de validação
    const nextButton = page.locator('button:has-text("Siguiente")');
    await expect(nextButton).toBeDisabled();

    // 4. Preenche os campos de Nome e Apellido
    await page.locator('label:has-text("Nombre") + input').fill('Gustavo');
    await page.locator('label:has-text("Apellido") + input').fill('Developer');

    // O botão deve continuar desabilitado porque falta a localização (Autocomplete)
    await expect(nextButton).toBeDisabled();
  });
});