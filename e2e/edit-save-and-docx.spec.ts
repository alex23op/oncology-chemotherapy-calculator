import { test, expect } from '@playwright/test';

// Helper function to fill patient data
async function fillPatientData(page) {
  await page.fill('input[aria-label*="weight"], input[placeholder*="weight"], input[placeholder*="greutate"]', '70');
  await page.fill('input[aria-label*="height"], input[placeholder*="height"], input[placeholder*="înălțime"]', '175');
  await page.fill('input[aria-label*="age"], input[placeholder*="age"], input[placeholder*="vârstă"]', '60');
  await page.selectOption('select[aria-label*="sex"], select[aria-label*="Sex"]', { label: 'Male' });
}

// Helper function to select the first regimen and calculate doses
async function selectFirstRegimen(page) {
  // Wait for and click the first regimen button
  const firstRegimenButton = page.locator('button:has-text("Calculate"), button:has-text("Calculează")').first();
  await firstRegimenButton.waitFor({ state: 'visible', timeout: 10000 });
  await firstRegimenButton.click();
}

// Helper function to go to the doses step
async function goToDoses(page) {
  const dosesStep = page.locator('h2:has-text("Dose"), h2:has-text("Doze")');
  await dosesStep.waitFor({ state: 'visible', timeout: 10000 });
}

// Helper function to extract DOCX content (mock for testing - in real scenario you'd need a DOCX parser)
async function validateDocxDownload(page) {
  // Listen for download event
  const downloadPromise = page.waitForEvent('download');
  
  // Click the export button
  await page.click('button:has-text("Export DOCX"), button:has-text("Exportă DOCX")');
  
  // Wait for download
  const download = await downloadPromise;
  
  // Verify filename contains .docx extension
  expect(download.suggestedFilename()).toMatch(/\.docx$/);
  
  return download;
}

test('edits via both buttons, reflects in views, exports DOCX in both orientations and persists selection', async ({ page }) => {
  await page.goto('/');

  // Fill patient data
  await fillPatientData(page);

  // Select regimen
  await selectFirstRegimen(page);

  // Go to doses
  await goToDoses(page);

  // Edit chemotherapy drug details using the first "Edit" button
  const firstEditButton = page.locator('button:has-text("Edit"), button:has-text("Editare")').first();
  await firstEditButton.click();

  // Edit unit count and user notes
  await page.fill('input[placeholder*="unit"], input[placeholder*="unități"]', '2');
  await page.selectOption('select[aria-label*="unit type"], select[aria-label*="tip unitate"]', 'fiole');
  await page.fill('textarea[placeholder*="notes"], textarea[placeholder*="note"]', 'Test user notes');

  // Save changes
  const saveButton = page.locator('button:has-text("Save"), button:has-text("Salvare")').first();
  await saveButton.click();

  // Edit using the second "Edit" button to verify both work
  const secondEditButton = page.locator('button:has-text("Edit"), button:has-text("Editare")').nth(1);
  await secondEditButton.click();

  // Make additional changes
  await page.fill('textarea[placeholder*="notes"], textarea[placeholder*="note"]', 'Updated notes via second edit');

  // Save changes
  await saveButton.click();

  // Generate the clinical treatment sheet
  const generateButton = page.locator('button:has-text("Generate"), button:has-text("Generează")');
  if (await generateButton.isVisible()) {
    await generateButton.click();
  }

  // Verify the updated values are reflected in the generated sheet
  await expect(page.locator('text=2 fiole')).toBeVisible();
  await expect(page.locator('text=Updated notes via second edit')).toBeVisible();

  // Test DOCX export in portrait orientation
  await page.selectOption('select[aria-label*="orientation"], select[aria-label*="orientare"]', 'portrait');
  const portraitDownload = await validateDocxDownload(page);

  // Test DOCX export in landscape orientation
  await page.selectOption('select[aria-label*="orientation"], select[aria-label*="orientare"]', 'landscape');
  const landscapeDownload = await validateDocxDownload(page);

  // Verify both downloads occurred
  expect(portraitDownload.suggestedFilename()).toMatch(/\.docx$/);
  expect(landscapeDownload.suggestedFilename()).toMatch(/\.docx$/);

  // Verify orientation persistence - reload page and check that landscape is still selected
  await page.reload();
  
  // Navigate back to review step if needed
  const reviewStep = page.locator('h2:has-text("Review"), h2:has-text("Revizuire")');
  if (await reviewStep.isVisible()) {
    await reviewStep.click();
  }

  // Check that landscape orientation is persisted
  const orientationSelect = page.locator('select[aria-label*="orientation"], select[aria-label*="orientare"]');
  await expect(orientationSelect).toHaveValue('landscape');
});