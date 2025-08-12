import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

// Helpers
async function fillPatientData(page: import('@playwright/test').Page) {
  await page.getByLabel('Weight').fill('70');
  await page.getByLabel('Height').fill('175');
  await page.getByLabel('Age').fill('60');
  // Sex select
  const sexLabel = page.locator('label:has-text("Sex")');
  const sexContainer = sexLabel.locator('..');
  await sexContainer.getByRole('combobox').click();
  await page.getByRole('option').getByText('Male', { exact: true }).click();
  await page.getByLabel('Serum Creatinine').fill('1.0');
}

async function selectFirstRegimen(page: import('@playwright/test').Page) {
  // Go to Regimen selection step
  await page.getByRole('button', { name: /2\.\s*Regimen selection/i }).click();
  // Open first cancer card
  await page.getByRole('button', { name: /^Select$/i }).first().click();
  // Click first "Calculate Doses"
  await page.getByRole('button', { name: /Calculate Doses/i }).first().click();
}

async function goToDoses(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: /4\.\s*Dose calculation/i }).click();
}

function extractPdfMediaBox(pdfBuffer: Buffer) {
  const txt = pdfBuffer.toString('latin1');
  const mediaBoxRegex = /\/MediaBox\s*\[\s*0\s+0\s+([0-9.]+)\s+([0-9.]+)\s*\]/i;
  const altRegex = /\/Page\s*<<[\s\S]*?\/MediaBox\s*\[\s*0\s+0\s+([0-9.]+)\s+([0-9.]+)\s*\][\s\S]*?>>/i;
  let m = txt.match(mediaBoxRegex) || txt.match(altRegex);
  if (!m) throw new Error('Could not find MediaBox in PDF');
  const w = parseFloat(m[1]);
  const h = parseFloat(m[2]);
  return { w, h };
}


test.describe('Edit/Save + Export PDF + Orientation persistence', () => {
  test('edits via both buttons, reflects in views, exports PDF in both orientations and persists selection', async ({ page, context }) => {
    await page.goto('/');

    // Step 1: patient data
    await page.getByRole('button', { name: /1\.\s*Patient data/i }).click();
    await fillPatientData(page);

    // Step 2: select regimen
    await selectFirstRegimen(page);

    // Step 4: go to dose calculation
    await goToDoses(page);

    // Enter CNP
    await page.getByLabel(/CNP/i).fill('1960101123456');

    // First Edit button (near "Chemotherapy Drugs")
    const firstEdit = page.getByRole('button', { name: /^Edit$/i }).first();
    await firstEdit.click();
    // After click, both should show Save
    await expect(page.getByRole('button', { name: /^Save$/i })).toHaveCount(2);

    // Modify first drug: Adjusted Dose, Diluent, Duration
    // Adjusted Dose
    const adjustedDoseInput = page.getByLabel('Adjusted Dose').first();
    await adjustedDoseInput.fill('123');

    // Diluent select in first drug card
    const firstDiluentLabel = page.locator('label:has-text("Diluent")').first();
    const diluentContainer = firstDiluentLabel.locator('..');
    await diluentContainer.getByRole('combobox').click();
    await page.getByRole('option').getByText('Dextrose 5%', { exact: true }).click();

    // Administration Duration
    const adminDuration = page.getByLabel('Administration Duration').first();
    await adminDuration.fill('45 min');

    // Save via any Save button (use the top one for determinism)
    await page.getByRole('button', { name: /^Save$/i }).first().click();

    // Verify non-edit view reflects changes
    await expect(page.getByText(/123\s*mg/i)).toBeVisible();
    await expect(page.getByText('Dextrose 5%')).toBeVisible();
    await expect(page.getByText('45 min')).toBeVisible();

    // Generate Sheet
    await page.getByRole('button', { name: /Generate Sheet/i }).click();
    await expect(page.getByRole('heading', { name: /Clinical Treatment Sheet/i })).toBeVisible();

    // Verify values appear in the sheet as well (digital view)
    await expect(page.getByText(/Final Dose:\s*123\s*mg/i)).toBeVisible();
    await expect(page.getByText(/Diluent:\s*Dextrose 5%/i)).toBeVisible();
    await expect(page.getByText(/Duration:\s*45\s*min/i)).toBeVisible();

    // Second Edit button (the one near Generate Sheet)
    const secondEdit = page.getByRole('button', { name: /^Edit$/i }).last();
    await secondEdit.click();
    await expect(page.getByRole('button', { name: /^Save$/i })).toHaveCount(2);

    // Update values
    await page.getByLabel('Adjusted Dose').first().fill('140');
    await firstDiluentLabel.locator('..').getByRole('combobox').click();
    await page.getByRole('option').getByText('Normal Saline 0.9%', { exact: true }).click();
    await page.getByLabel('Administration Duration').first().fill('60 min');

    // Save (use the bottom one this time)
    await page.getByRole('button', { name: /^Save$/i }).last().click();

    // Verify updated values (view and sheet)
    await expect(page.getByText(/140\s*mg/i)).toBeVisible();
    await expect(page.getByText('Normal Saline 0.9%')).toBeVisible();
    await expect(page.getByText('60 min')).toBeVisible();
    await expect(page.getByText(/Final Dose:\s*140\s*mg/i)).toBeVisible();
    await expect(page.getByText(/Diluent:\s*Normal Saline 0.9%/i)).toBeVisible();
    await expect(page.getByText(/Duration:\s*60\s*min/i)).toBeVisible();

    // Export PDF in Portrait
    // Ensure select shows/selects Portrait
    const orientationCombobox = page.locator('div:has-text("Clinical Treatment Sheet")').locator('..').getByRole('combobox').first();
    await orientationCombobox.click();
    await page.getByRole('option').getByText('Portrait', { exact: true }).click();

    const downloadPortrait = page.waitForEvent('download');
    await page.getByRole('button', { name: /Export PDF/i }).click();
    const filePortrait = await downloadPortrait;
    const pathPortrait = await filePortrait.path();
    expect(pathPortrait).toBeTruthy();
    const bufPortrait = await fs.readFile(pathPortrait!);
    const { w: wp, h: hp } = extractPdfMediaBox(bufPortrait as Buffer);
    console.log('Portrait PDF MediaBox:', wp, hp);
    expect(wp).toBeGreaterThan(0);
    expect(hp).toBeGreaterThan(0);
    expect(wp).toBeLessThan(hp); // Portrait => height > width

    // Export PDF in Landscape
    await orientationCombobox.click();
    await page.getByRole('option').getByText('Landscape', { exact: true }).click();

    const downloadLandscape = page.waitForEvent('download');
    await page.getByRole('button', { name: /Export PDF/i }).click();
    const fileLandscape = await downloadLandscape;
    const pathLandscape = await fileLandscape.path();
    expect(pathLandscape).toBeTruthy();
    const bufLandscape = await fs.readFile(pathLandscape!);
    const { w: wl, h: hl } = extractPdfMediaBox(bufLandscape as Buffer);
    console.log('Landscape PDF MediaBox:', wl, hl);
    expect(wl).toBeGreaterThan(0);
    expect(hl).toBeGreaterThan(0);
    expect(wl).toBeGreaterThan(hl); // Landscape => width > height

    // Orientation persisted in localStorage
    const stored = await page.evaluate(() => localStorage.getItem('pdfOrientation'));
    expect(stored).toBe('landscape');

    await page.reload();
    // After reload, the orientation select should show Landscape
    // Open combobox and ensure Landscape is current value by checking that selecting Portrait changes value
    // Simpler: check that the combobox button contains the text 'Landscape'
    const orientationTrigger = page.locator('div:has-text("Clinical Treatment Sheet")').locator('..').getByRole('combobox').first();
    await expect(orientationTrigger).toContainText('Landscape');
  });
});
