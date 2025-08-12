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

async function goToDoses(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: /4\.\s*Dose calculation/i }).click();
}


test.describe('Jump navigation across steps', () => {
  test('Start from Supportive care, complete missing steps, generate sheet', async ({ page }) => {
    await page.goto('/');

    // Jump to Supportive care
    await page.getByRole('button', { name: /3\.\s*Supportive care/i }).click();
    await expect(page.getByText('Select a cancer type and regimen to calculate doses.')).toBeVisible();

    // Complete missing steps
    await fillPatientData(page);
    await selectFirstRegimen(page);

    // Go to Dose calculation, enter CNP, generate
    await goToDoses(page);
    await page.getByLabel(/CNP/i).fill('1960101123456');
    await page.getByRole('button', { name: /Generate Sheet/i }).click();
    await expect(page.getByRole('heading', { name: /Clinical Treatment Sheet/i })).toBeVisible();
  });

  test('Start from Dose calculation, complete previous steps, generate sheet', async ({ page }) => {
    await page.goto('/');

    // Jump directly to Dose calculation
    await goToDoses(page);
    await expect(page.getByText('Select a cancer type and regimen to calculate doses.')).toBeVisible();

    // Complete missing steps
    await fillPatientData(page);
    await selectFirstRegimen(page);

    // Return to Dose calculation and generate
    await goToDoses(page);
    await page.getByLabel(/CNP/i).fill('1960101123456');
    await page.getByRole('button', { name: /Generate Sheet/i }).click();
    await expect(page.getByRole('heading', { name: /Clinical Treatment Sheet/i })).toBeVisible();
  });
});
