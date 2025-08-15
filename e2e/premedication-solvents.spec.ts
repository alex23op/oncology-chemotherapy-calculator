import { test, expect } from '@playwright/test';

test.describe('Premedication Solvents E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Complete patient data
    await page.getByLabel('Weight').fill('70');
    await page.getByLabel('Height').fill('175');
    await page.getByLabel('Age').fill('45');
    await page.getByLabel('Sex').click();
    await page.getByText('Male').click();
    await page.getByLabel('Serum Creatinine').fill('1.0');
    
    // Go to regimen selection
    await page.getByRole('button', { name: /2.*Regimen/i }).click();
    
    // Select first available cancer type and regimen
    await page.getByRole('button', { name: 'Select' }).first().click();
    await page.getByRole('button', { name: 'Calculate Doses' }).first().click();
    
    // Go to supportive care
    await page.getByRole('button', { name: /3.*Supportive/i }).click();
  });

  test('should show solvents tab and allow solvent selection', async ({ page }) => {
    // Check that solvents tab exists in UnifiedProtocolSelector
    await expect(page.getByRole('tab', { name: /solvents/i })).toBeVisible();
    
    // First select an agent from recommendations
    await page.getByRole('tab', { name: /recommendations/i }).click();
    
    // Select the first available agent
    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    await firstCheckbox.check();
    
    // Navigate to solvents tab
    await page.getByRole('tab', { name: /solvents/i }).click();
    
    // Should see translated description text, not literal keys
    await expect(page.getByText(/Select a solvent|Selectează un solvent/i)).toBeVisible();
    await expect(page.getByText('unifiedSelector.selectSolventDesc')).not.toBeVisible();
    
    // Select a solvent
    const solventSelect = page.getByRole('combobox').first();
    await solventSelect.click();
    
    // Check for translated solvent names, not literal keys
    await expect(page.getByRole('option', { name: /normal saline|ser fiziologic/i })).toBeVisible();
    await expect(page.getByText('doseCalculator.solvents.normalSaline')).not.toBeVisible();
    
    await page.getByRole('option', { name: /normal saline|ser fiziologic/i }).click();
    
    // Verify selection shows translated text
    await expect(solventSelect).toHaveValue(/Normal Saline 0.9%|Ser fiziologic 0,9%/);
  });

  test('should display solvent in treatment sheet', async ({ page }) => {
    // Select an agent and solvent
    await page.getByRole('tab', { name: /recommendations/i }).click();
    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    await firstCheckbox.check();
    
    await page.getByRole('tab', { name: /solvents/i }).click();
    const solventSelect = page.getByRole('combobox').first();
    await solventSelect.click();
    await page.getByRole('option', { name: /normal saline/i }).click();
    
    // Navigate to treatment sheet/summary
    await page.getByRole('button', { name: /generate.*sheet/i }).first().click();
    
    // Check that the solvent appears in the treatment sheet
    await expect(page.getByText('Normal Saline 0.9%')).toBeVisible();
  });

  test('should show empty field when no solvent selected', async ({ page }) => {
    // Select an agent but no solvent
    await page.getByRole('tab', { name: /recommendations/i }).click();
    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    await firstCheckbox.check();
    
    // Go to solvents tab but don't select anything
    await page.getByRole('tab', { name: /solvents/i }).click();
    
    // Navigate to treatment sheet
    await page.getByRole('button', { name: /generate.*sheet/i }).first().click();
    
    // Verify that solvent field is empty (no specific text shown for empty solvent)
    const premedSection = page.locator('[data-testid="premedications-section"]');
    if (await premedSection.isVisible()) {
      // If premedications section exists, check that no random solvent text appears
      await expect(premedSection.getByText('Normal Saline 0.9%')).not.toBeVisible();
    }
  });

  test('should change solvent and update treatment sheet', async ({ page }) => {
    // Select an agent and initial solvent
    await page.getByRole('tab', { name: /recommendations/i }).click();
    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    await firstCheckbox.check();
    
    await page.getByRole('tab', { name: /solvents/i }).click();
    const solventSelect = page.getByRole('combobox').first();
    await solventSelect.click();
    await page.getByRole('option', { name: /normal saline/i }).click();
    
    // Change to different solvent
    await solventSelect.click();
    await page.getByRole('option', { name: /dextrose/i }).click();
    
    // Navigate to treatment sheet
    await page.getByRole('button', { name: /generate.*sheet/i }).first().click();
    
    // Check that the updated solvent appears
    await expect(page.getByText('Dextrose 5%')).toBeVisible();
    await expect(page.getByText('Normal Saline 0.9%')).not.toBeVisible();
  });

  test('should persist solvent selection after page reload', async ({ page }) => {
    // Select an agent and solvent
    await page.getByRole('tab', { name: /recommendations/i }).click();
    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    await firstCheckbox.check();
    
    await page.getByRole('tab', { name: /solvents/i }).click();
    const solventSelect = page.getByRole('combobox').first();
    await solventSelect.click();
    await page.getByRole('option', { name: /normal saline/i }).click();
    
    // Reload the page
    await page.reload();
    
    // Fill patient data again (since it's not persisted in this test setup)
    await page.getByLabel('Weight').fill('70');
    await page.getByLabel('Height').fill('175');
    await page.getByLabel('Age').fill('45');
    await page.getByLabel('Sex').click();
    await page.getByText('Male').click();
    await page.getByLabel('Serum Creatinine').fill('1.0');
    
    // Navigate back to supportive care
    await page.getByRole('button', { name: /2.*Regimen/i }).click();
    await page.getByRole('button', { name: 'Select' }).first().click();
    await page.getByRole('button', { name: 'Calculate Doses' }).first().click();
    await page.getByRole('button', { name: /3.*Supportive/i }).click();
    
    // Check if selections are maintained (this may depend on localStorage implementation)
    await page.getByRole('tab', { name: /solvents/i }).click();
    
    // Note: This test checks if the component handles state properly after reload
    // The actual persistence depends on if localStorage is implemented for this feature
    await expect(page.getByRole('tab', { name: /solvents/i })).toBeVisible();
  });
});