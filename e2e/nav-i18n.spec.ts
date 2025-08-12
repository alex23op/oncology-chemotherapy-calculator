import { test, expect } from '@playwright/test';

// NOTE: Ensure the dev server is running at baseURL before running these tests.

test.describe('Wizard navigation and i18n', () => {
  test('can switch steps via progress bar and toggle language', async ({ page }) => {
    await page.goto('/');

    // Patient step should be visible by default
    await expect(page.getByText(/Patient/i)).toBeVisible();

    // Open language select and switch to Romanian
    await page.getByRole('button', { name: /language/i }).click();
    await page.getByRole('option').getByText(/Romanian|Română/i).click();

    // Step buttons exist and are clickable
    await page.getByRole('button', { name: /2\..*Regimen|Selectare regim/i }).click();
    await page.getByRole('button', { name: /3\..*Support|Îngrijiri/i }).click();
    await page.getByRole('button', { name: /4\..*Dose|Calcul doze/i }).click();
    await page.getByRole('button', { name: /1\..*Patient|Date pacient/i }).click();
  });
});
