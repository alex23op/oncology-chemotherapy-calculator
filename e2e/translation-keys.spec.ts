import { test, expect } from '@playwright/test';

test.describe('Translation Keys Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Complete basic patient data to enable navigation
    await page.getByLabel('Weight').fill('70');
    await page.getByLabel('Height').fill('175'); 
    await page.getByLabel('Age').fill('45');
    await page.getByLabel('Sex').click();
    await page.getByText('Male').click();
    await page.getByLabel('Serum Creatinine').fill('1.0');
    
    // Navigate to supportive care
    await page.getByRole('button', { name: /2.*Regimen/i }).click();
    await page.getByRole('button', { name: 'Select' }).first().click();
    await page.getByRole('button', { name: 'Calculate Doses' }).first().click();
    await page.getByRole('button', { name: /3.*Supportive/i }).click();
  });

  test('should not display literal i18n keys anywhere in UnifiedProtocolSelector', async ({ page }) => {
    // Test all tabs for literal translation keys
    const literalKeys = [
      'unifiedSelector.selectSolventDesc',
      'unifiedSelector.solvent', 
      'unifiedSelector.noAgentsForSolvents',
      'doseCalculator.solvents.normalSaline',
      'doseCalculator.solvents.dextrose5',
      'doseCalculator.solvents.ringer',
      'doseCalculator.solvents.waterForInjection',
      'unifiedSelector.tabs.solvents',
      'unifiedSelector.tabs.recommendations',
      'unifiedSelector.tabs.categories',
      'unifiedSelector.tabs.selected'
    ];

    // Check each tab
    const tabs = ['recommendations', 'categories', 'solvents', 'selected'];
    
    for (const tab of tabs) {
      await page.getByRole('tab', { name: new RegExp(tab, 'i') }).click();
      
      // Check that no literal keys appear
      for (const key of literalKeys) {
        await expect(page.getByText(key)).not.toBeVisible();
      }
      
      // Wait briefly for content to load
      await page.waitForTimeout(100);
    }
  });

  test('should display translated solvent options when dropdown is opened', async ({ page }) => {
    // Select an agent first
    await page.getByRole('tab', { name: /recommendations/i }).click();
    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    await firstCheckbox.check();
    
    // Go to solvents tab
    await page.getByRole('tab', { name: /solvents/i }).click();
    
    // Open solvent dropdown
    const solventSelect = page.getByRole('combobox').first();
    await solventSelect.click();
    
    // Check that we see translated names, not literal keys
    const expectedTranslations = [
      /normal saline|ser fiziologic/i,
      /dextrose.*5|glucoză.*5/i,
      /ringer/i,
      /water for injection|apă pentru preparate injectabile/i
    ];
    
    for (const translation of expectedTranslations) {
      await expect(page.getByText(translation)).toBeVisible();
    }
    
    // Ensure literal keys are not present
    const literalSolventKeys = [
      'doseCalculator.solvents.normalSaline',
      'doseCalculator.solvents.dextrose5', 
      'doseCalculator.solvents.ringer',
      'doseCalculator.solvents.waterForInjection'
    ];
    
    for (const key of literalSolventKeys) {
      await expect(page.getByText(key)).not.toBeVisible();
    }
  });

  test('should handle language switching without showing literal keys', async ({ page }) => {
    // Switch to Romanian
    await page.getByRole('button', { name: /language/i }).click();
    await page.getByRole('option').getByText(/Romanian|Română/i).click();
    
    // Check solvents tab in Romanian
    await page.getByRole('tab', { name: /solvenți/i }).click();
    
    // Should see Romanian translations, not literal keys
    await expect(page.getByText(/nu ați selectat agenți/i)).toBeVisible();
    await expect(page.getByText('unifiedSelector.noAgentsForSolvents')).not.toBeVisible();
    
    // Select an agent and check solvent options in Romanian
    await page.getByRole('tab', { name: /recomandări/i }).click();
    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    await firstCheckbox.check();
    
    await page.getByRole('tab', { name: /solvenți/i }).click();
    await expect(page.getByText(/selectează un solvent/i)).toBeVisible();
    await expect(page.getByText('unifiedSelector.selectSolventDesc')).not.toBeVisible();
    
    // Open dropdown and check Romanian solvent names
    const solventSelect = page.getByRole('combobox').first();
    await solventSelect.click();
    
    await expect(page.getByText(/ser fiziologic/i)).toBeVisible();
    await expect(page.getByText(/glucoză/i)).toBeVisible();
    await expect(page.getByText(/apă pentru preparate injectabile/i)).toBeVisible();
    
    // No literal keys should be visible
    await expect(page.getByText('doseCalculator.solvents.normalSaline')).not.toBeVisible();
  });
  
  test('should not show literal keys in print/PDF content', async ({ page }) => {
    // Select an agent and solvent
    await page.getByRole('tab', { name: /recommendations/i }).click();
    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    await firstCheckbox.check();
    
    await page.getByRole('tab', { name: /solvents/i }).click();
    const solventSelect = page.getByRole('combobox').first();
    await solventSelect.click();
    await page.getByRole('option', { name: /normal saline|ser fiziologic/i }).click();
    
    // Generate treatment sheet
    await page.getByRole('button', { name: /4.*dose/i }).click();
    await page.getByLabel('CNP').fill('1234567890123');
    await page.getByRole('button', { name: /generate.*sheet/i }).first().click();
    
    // Wait for sheet to generate
    await page.waitForTimeout(1000);
    
    // Check that print content shows translated text, not literal keys
    const printContent = page.locator('[data-testid="treatment-sheet"], .treatment-sheet, .clinical-sheet');
    if (await printContent.isVisible()) {
      // Should see "Solvent" or "Solvent" column header, not the literal key
      await expect(printContent.getByText(/solvent/i)).toBeVisible();
      await expect(printContent.getByText('compactSheet.solvent')).not.toBeVisible();
      await expect(printContent.getByText('unifiedSelector.solvent')).not.toBeVisible();
      
      // Should see actual solvent name
      await expect(printContent.getByText(/normal saline|ser fiziologic/i)).toBeVisible();
    }
  });
});