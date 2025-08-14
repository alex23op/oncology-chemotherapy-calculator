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
    // Select a premedication first
    await page.getByText('Individual Selection').click();
    await page.getByRole('checkbox').first().check();
    
    // Navigate to solvents tab
    await page.getByText('Solvents').click();
    
    // Verify solvent tab is displayed
    await expect(page.getByText('Select solvent for')).toBeVisible();
    
    // Select a solvent
    await page.getByRole('combobox').click();
    await page.getByText('Normal Saline 0.9%').click();
    
    // Verify solvent is selected
    await expect(page.getByDisplayValue('Normal Saline 0.9%')).toBeVisible();
  });

  test('should display solvent in treatment sheet instead of category', async ({ page }) => {
    // Select a premedication and set solvent
    await page.getByText('Individual Selection').click();
    await page.getByRole('checkbox').first().check();
    
    await page.getByText('Solvents').click();
    await page.getByRole('combobox').click();
    await page.getByText('Dextrose 5%').click();
    
    // Go to dose calculation
    await page.getByRole('button', { name: /4.*Dose/i }).click();
    
    // Enter required data
    await page.getByLabel('CNP *').fill('1234567890123');
    
    // Generate treatment sheet
    await page.getByRole('button', { name: 'Generate Sheet' }).click();
    
    // Verify solvent appears in treatment sheet
    await expect(page.getByText('Solvent')).toBeVisible();
    await expect(page.getByText('Dextrose 5%')).toBeVisible();
    
    // Verify category column is not present
    await expect(page.getByText('Category')).not.toBeVisible();
  });

  test('should show empty field when no solvent selected', async ({ page }) => {
    // Select a premedication without setting solvent
    await page.getByText('Individual Selection').click();
    await page.getByRole('checkbox').first().check();
    
    // Go to dose calculation
    await page.getByRole('button', { name: /4.*Dose/i }).click();
    
    // Enter required data
    await page.getByLabel('CNP *').fill('1234567890123');
    
    // Generate treatment sheet
    await page.getByRole('button', { name: 'Generate Sheet' }).click();
    
    // Verify N/A appears in solvent column
    await expect(page.getByText('Solvent')).toBeVisible();
    await expect(page.getByText('N/A')).toBeVisible();
  });

  test('should change solvent and update treatment sheet', async ({ page }) => {
    // Select a premedication and set initial solvent
    await page.getByText('Individual Selection').click();
    await page.getByRole('checkbox').first().check();
    
    await page.getByText('Solvents').click();
    await page.getByRole('combobox').click();
    await page.getByText('Normal Saline 0.9%').click();
    
    // Go to dose calculation and generate sheet
    await page.getByRole('button', { name: /4.*Dose/i }).click();
    await page.getByLabel('CNP *').fill('1234567890123');
    await page.getByRole('button', { name: 'Generate Sheet' }).click();
    
    // Verify initial solvent
    await expect(page.getByText('Normal Saline 0.9%')).toBeVisible();
    
    // Go back and change solvent
    await page.getByRole('button', { name: /3.*Supportive/i }).click();
    await page.getByText('Solvents').click();
    await page.getByRole('combobox').click();
    await page.getByText('Ringer Solution').click();
    
    // Return to dose calculation and verify change
    await page.getByRole('button', { name: /4.*Dose/i }).click();
    await page.getByRole('button', { name: 'Generate Sheet' }).click();
    
    // Verify updated solvent
    await expect(page.getByText('Ringer Solution')).toBeVisible();
    await expect(page.getByText('Normal Saline 0.9%')).not.toBeVisible();
  });

  test('should persist solvent selection after page reload', async ({ page }) => {
    // Select a premedication and set solvent
    await page.getByText('Individual Selection').click();
    await page.getByRole('checkbox').first().check();
    
    await page.getByText('Solvents').click();
    await page.getByRole('combobox').click();
    await page.getByText('Dextrose 5%').click();
    
    // Reload the page
    await page.reload();
    
    // Navigate back to supportive care and solvents tab
    await page.getByRole('button', { name: /3.*Supportive/i }).click();
    await page.getByText('Solvents').click();
    
    // Verify solvent selection persisted
    await expect(page.getByDisplayValue('Dextrose 5%')).toBeVisible();
  });

  test('should export PDF with correct solvent display', async ({ page }) => {
    // Set up premedication with solvent
    await page.getByText('Individual Selection').click();
    await page.getByRole('checkbox').first().check();
    
    await page.getByText('Solvents').click();
    await page.getByRole('combobox').click();
    await page.getByText('Normal Saline 0.9%').click();
    
    // Go to dose calculation and generate sheet
    await page.getByRole('button', { name: /4.*Dose/i }).click();
    await page.getByLabel('CNP *').fill('1234567890123');
    await page.getByRole('button', { name: 'Generate Sheet' }).click();
    
    // Set up PDF download listener
    const downloadPromise = page.waitForEvent('download');
    
    // Export PDF
    await page.getByRole('button', { name: 'Export PDF' }).click();
    
    // Verify download occurred
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.pdf');
    
    // Verify the content shows solvent in treatment sheet
    await expect(page.getByText('Solvent')).toBeVisible();
    await expect(page.getByText('Normal Saline 0.9%')).toBeVisible();
  });
});