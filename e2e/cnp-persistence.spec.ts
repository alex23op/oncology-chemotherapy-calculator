import { test, expect } from '@playwright/test';

async function fillPatientData(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: /1\.\s*Patient data/i }).click();
  await page.getByLabel('Weight').fill('70');
  await page.getByLabel('Height').fill('175');
  await page.getByLabel('Age').fill('60');
  const sexLabel = page.locator('label:has-text("Sex")');
  const sexContainer = sexLabel.locator('..');
  await sexContainer.getByRole('combobox').click();
  await page.getByRole('option').getByText('Male', { exact: true }).click();
  await page.getByLabel('Serum Creatinine').fill('1.0');
}

async function selectFirstRegimen(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: /2\.\s*Regimen selection/i }).click();
  await page.getByRole('button', { name: /^Select$/i }).first().click();
  await page.getByRole('button', { name: /Calculate Doses/i }).first().click();
}

test.describe('CNP persistence prevention', () => {
  test('CNP should not persist between page reloads', async ({ page }) => {
    await page.goto('/');

    // Complete steps and enter CNP
    await fillPatientData(page);
    await selectFirstRegimen(page);
    await page.getByRole('button', { name: /4\.\s*Dose calculation/i }).click();
    
    // Enter CNP
    const cnpInput = page.getByLabel(/CNP/i);
    await cnpInput.fill('1960101123456');
    await expect(cnpInput).toHaveValue('1960101123456');

    // Reload page
    await page.reload();

    // Navigate back to dose calculation
    await fillPatientData(page);
    await selectFirstRegimen(page);
    await page.getByRole('button', { name: /4\.\s*Dose calculation/i }).click();

    // CNP field should be empty
    const cnpInputAfterReload = page.getByLabel(/CNP/i);
    await expect(cnpInputAfterReload).toHaveValue('');
  });

  test('CNP should not persist when switching to different regimen', async ({ page }) => {
    await page.goto('/');

    // Complete steps and enter CNP for first regimen
    await fillPatientData(page);
    await selectFirstRegimen(page);
    await page.getByRole('button', { name: /4\.\s*Dose calculation/i }).click();
    
    // Enter CNP
    const cnpInput = page.getByLabel(/CNP/i);
    await cnpInput.fill('1960101123456');
    await expect(cnpInput).toHaveValue('1960101123456');

    // Go back to regimen selection and select a different regimen
    await page.getByRole('button', { name: /2\.\s*Regimen selection/i }).click();
    
    // Try to select a different regimen (if available)
    const selectButtons = page.getByRole('button', { name: /^Select$/i });
    const buttonCount = await selectButtons.count();
    
    if (buttonCount > 1) {
      // Select the second regimen
      await selectButtons.nth(1).click();
      await page.getByRole('button', { name: /Calculate Doses/i }).first().click();
      
      // Navigate to dose calculation
      await page.getByRole('button', { name: /4\.\s*Dose calculation/i }).click();
      
      // CNP field should be empty for the new regimen
      const cnpInputNewRegimen = page.getByLabel(/CNP/i);
      await expect(cnpInputNewRegimen).toHaveValue('');
    }
  });

  test('Other fields should still persist but CNP should not', async ({ page }) => {
    await page.goto('/');

    // Complete steps
    await fillPatientData(page);
    await selectFirstRegimen(page);
    await page.getByRole('button', { name: /4\.\s*Dose calculation/i }).click();
    
    // Enter CNP and other data
    await page.getByLabel(/CNP/i).fill('1960101123456');
    
    // Fill in other fields that should persist
    const clinicalNotesTextarea = page.getByLabel(/clinical notes/i);
    if (await clinicalNotesTextarea.isVisible()) {
      await clinicalNotesTextarea.fill('Test clinical notes');
    }

    // Reload page
    await page.reload();

    // Navigate back to dose calculation
    await fillPatientData(page);
    await selectFirstRegimen(page);
    await page.getByRole('button', { name: /4\.\s*Dose calculation/i }).click();

    // CNP should be empty
    await expect(page.getByLabel(/CNP/i)).toHaveValue('');
    
    // But clinical notes should persist (if they were saved)
    const clinicalNotesAfterReload = page.getByLabel(/clinical notes/i);
    if (await clinicalNotesAfterReload.isVisible()) {
      await expect(clinicalNotesAfterReload).toHaveValue('Test clinical notes');
    }
  });
});