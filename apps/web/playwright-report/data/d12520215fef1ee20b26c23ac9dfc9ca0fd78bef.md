# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accidentReport.spec.ts >> Fluxo do Formulário de Relato de Sinistro (AccidentReportForm) >> Deve renderizar o Passo 1 corretamente e validar campos obrigatórios
- Location: tests\e2e\accidentReport.spec.ts:11:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h2:has-text("Relatar Sinistro")')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h2:has-text("Relatar Sinistro")')

```

```yaml
- banner:
  - text: AS AccidentPro
  - navigation:
    - button "ES"
    - button "EN"
- main:
  - heading "AccidentPro" [level=2]
  - paragraph: Acesso restrito. Identifique-se para gerenciar os sinistros da sua organização.
  - text: Subdomínio / Tenant Slug
  - 'textbox "ex: acme"'
  - text: Credenciais E-mail
  - textbox "seu-email@empresa.com"
  - text: Senha
  - textbox "••••••••"
  - button "Entrar no Sistema"
  - text: Ou
  - button "Continuar con Google. Se abre en una pestaña nueva.":
    - img
    - text: Continuar con Google
  - iframe
- contentinfo: © 2026 AccidentPro SaaS - Multi-tenant Secure System
```

# Test source

```ts
  1  | // apps/web/tests/e2e/accidentReport.spec.ts
  2  | import { test, expect } from '@playwright/test';
  3  | 
  4  | test.describe('Fluxo do Formulário de Relato de Sinistro (AccidentReportForm)', () => {
  5  |   
  6  |   test.beforeEach(async ({ page }) => {
  7  |     // Acessa a página do formulário local (ajuste a rota se necessário, ex: /report)
  8  |     await page.goto('/'); 
  9  |   });
  10 | 
  11 |   test('Deve renderizar o Passo 1 corretamente e validar campos obrigatórios', async ({ page }) => {
  12 |     // 1. Verifica se o cabeçalho do formulário está visível
  13 |     const header = page.locator('h2:has-text("Relatar Sinistro")');
> 14 |     await expect(header).toBeVisible();
     |                          ^ Error: expect(locator).toBeVisible() failed
  15 | 
  16 |     // 2. Verifica se o badge indica "Passo 1 de 3"
  17 |     const stepBadge = page.locator('span:has-text("Passo 1 de 3")');
  18 |     await expect(stepBadge).toBeVisible();
  19 | 
  20 |     // 3. Valida que o botão "Siguiente" inicia desabilitado devido às travas rígidas de validação
  21 |     const nextButton = page.locator('button:has-text("Siguiente")');
  22 |     await expect(nextButton).toBeDisabled();
  23 | 
  24 |     // 4. Preenche os campos de Nome e Apellido
  25 |     await page.locator('label:has-text("Nombre") + input').fill('Gustavo');
  26 |     await page.locator('label:has-text("Apellido") + input').fill('Developer');
  27 | 
  28 |     // O botão deve continuar desabilitado porque falta a localização (Autocomplete)
  29 |     await expect(nextButton).toBeDisabled();
  30 |   });
  31 | });
```