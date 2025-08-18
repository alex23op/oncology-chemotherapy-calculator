import { test, expect } from '@playwright/test';

test.describe('Dose Calculation Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('complete dose calculation workflow', async ({ page }) => {
    // Step 1: Fill patient information
    await page.fill('[data-testid="patient-weight"]', '70');
    await page.fill('[data-testid="patient-height"]', '175');
    await page.fill('[data-testid="patient-age"]', '60');
    await page.selectOption('[data-testid="patient-sex"]', 'male');
    await page.fill('[data-testid="creatinine-clearance"]', '90');

    // Step 2: Select cancer type and regimen
    await page.click('[data-testid="cancer-selector"]');
    await page.click('text=Gastrointestinal Cancers');
    await page.click('text=Select');
    
    // Wait for regimens to load
    await page.waitForSelector('[data-testid="regimen-card"]');
    
    // Select FOLFOX regimen
    await page.click('text=mFOLFOX6');
    await page.click('text=Calculate doses');

    // Step 3: Verify dose calculations appear
    await expect(page.locator('[data-testid="dose-calculator"]')).toBeVisible();
    await expect(page.locator('text=Oxaliplatin')).toBeVisible();
    await expect(page.locator('text=5-Fluorouracil')).toBeVisible();
    
    // Verify BSA calculation appears
    await expect(page.locator('text=1.85 m²')).toBeVisible(); // Expected BSA for 175cm, 70kg
    
    // Step 4: Verify dose calculations
    const oxaliplatinDose = page.locator('[data-testid="calculated-dose-Oxaliplatin"]');
    await expect(oxaliplatinDose).toContainText('157.3 mg'); // 85 * 1.85
    
    // Step 5: Test dose adjustment
    await page.click('[data-testid="edit-doses"]');
    
    // Adjust Oxaliplatin dose
    const adjustmentInput = page.locator('[data-testid="dose-adjustment-Oxaliplatin"]');
    await adjustmentInput.fill('140');
    
    // Verify reduction percentage is calculated
    await expect(page.locator('[data-testid="reduction-percentage-Oxaliplatin"]')).toContainText('11%');
    
    // Step 6: Test solvent selection
    await page.click('[data-testid="solvent-selector-Oxaliplatin"]');
    await page.click('text=Glucoză 5% (D5W)');
    
    await page.click('[data-testid="volume-selector-Oxaliplatin"]');
    await page.click('text=500 mL');
    
    // Step 7: Add clinical notes
    await page.fill('[data-testid="clinical-notes"]', 'Patient has mild neuropathy from previous cycle');
    
    // Step 8: Test undo functionality
    await page.click('[data-testid="undo-button"]');
    await expect(adjustmentInput).toHaveValue('157.3');
    
    // Step 9: Save changes
    await page.click('[data-testid="save-doses"]');
    
    // Step 10: Generate treatment sheet
    await page.click('[data-testid="generate-treatment-sheet"]');
    
    // Verify treatment sheet appears
    await expect(page.locator('[data-testid="treatment-sheet"]')).toBeVisible();
    await expect(page.locator('text=Oxaliplatin')).toBeVisible();
    await expect(page.locator('text=157.3 mg')).toBeVisible();
    await expect(page.locator('text=500 mL D5W')).toBeVisible();
    
    // Step 11: Test PDF export
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid="export-pdf"]');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('treatment-sheet');
    expect(download.suggestedFilename()).toContain('.pdf');
  });

  test('dose limit warnings appear correctly', async ({ page }) => {
    // Setup patient with conditions that trigger warnings
    await page.fill('[data-testid="patient-weight"]', '70');
    await page.fill('[data-testid="patient-height"]', '175');
    await page.fill('[data-testid="patient-age"]', '75'); // Elderly patient
    await page.selectOption('[data-testid="patient-sex"]', 'male');
    await page.fill('[data-testid="creatinine-clearance"]', '45'); // Reduced renal function

    // Select regimen with dose-sensitive drug
    await page.click('[data-testid="cancer-selector"]');
    await page.click('text=Breast Cancer');
    await page.click('text=Select');
    
    // Select AC regimen (contains Doxorubicin)
    await page.click('text=AC (Doxorubicin/Cyclophosphamide)');
    await page.click('text=Calculate doses');

    // Verify age-related dose reduction warning
    await expect(page.locator('[data-testid="age-warning"]')).toContainText('15% reduction for elderly patients');
    
    // Verify renal adjustment warning for cisplatin-containing regimens
    await page.click('[data-testid="cancer-selector"]');
    await page.click('text=Lung Cancer');
    await page.click('text=Select');
    await page.click('text=Cisplatin/Etoposide');
    await page.click('text=Calculate doses');
    
    await expect(page.locator('[data-testid="renal-warning"]')).toContainText('Reduce dose by 50%');
  });

  test('solvent validation works correctly', async ({ page }) => {
    // Setup patient
    await page.fill('[data-testid="patient-weight"]', '70');
    await page.fill('[data-testid="patient-height"]', '175');
    await page.fill('[data-testid="patient-age"]', '60');
    await page.selectOption('[data-testid="patient-sex"]', 'male');
    await page.fill('[data-testid="creatinine-clearance"]', '90');

    // Select FOLFOX regimen (contains Oxaliplatin)
    await page.click('[data-testid="cancer-selector"]');
    await page.click('text=Gastrointestinal Cancers');
    await page.click('text=Select');
    await page.click('text=mFOLFOX6');
    await page.click('text=Calculate doses');

    // Enter edit mode
    await page.click('[data-testid="edit-doses"]');
    
    // Try to select incompatible solvent for Oxaliplatin
    await page.click('[data-testid="solvent-selector-Oxaliplatin"]');
    
    // Verify only D5W is available (NS should not be selectable)
    await expect(page.locator('text=Normal Saline')).not.toBeVisible();
    await expect(page.locator('text=Glucoză 5% (D5W)')).toBeVisible();
    
    // Select valid solvent
    await page.click('text=Glucoză 5% (D5W)');
    
    // Try to select volume too small
    await page.click('[data-testid="volume-selector-Oxaliplatin"]');
    await page.click('text=100 mL');
    
    // Verify volume warning appears
    await expect(page.locator('[data-testid="volume-warning"]')).toContainText('Volumul minim pentru Oxaliplatin este 250 mL');
  });

  test('calculation history persistence', async ({ page }) => {
    // Complete a calculation
    await page.fill('[data-testid="patient-weight"]', '70');
    await page.fill('[data-testid="patient-height"]', '175');
    await page.fill('[data-testid="patient-age"]', '60');
    await page.selectOption('[data-testid="patient-sex"]', 'male');
    await page.fill('[data-testid="creatinine-clearance"]', '90');

    await page.click('[data-testid="cancer-selector"]');
    await page.click('text=Gastrointestinal Cancers');
    await page.click('text=Select');
    await page.click('text=mFOLFOX6');
    await page.click('text=Calculate doses');

    // Save the calculation
    await page.click('[data-testid="save-calculation"]');
    
    // Verify success toast
    await expect(page.locator('.sonner-toast')).toContainText('Calculul a fost salvat în istoric');
    
    // Reload page
    await page.reload();
    
    // Navigate back to dose calculator
    await page.fill('[data-testid="patient-weight"]', '70');
    await page.fill('[data-testid="patient-height"]', '175');
    await page.fill('[data-testid="patient-age"]', '60');
    await page.selectOption('[data-testid="patient-sex"]', 'male');
    await page.fill('[data-testid="creatinine-clearance"]', '90');
    
    await page.click('[data-testid="cancer-selector"]');
    await page.click('text=Gastrointestinal Cancers');
    await page.click('text=Select');
    await page.click('text=mFOLFOX6');
    await page.click('text=Calculate doses');
    
    // Verify history is visible
    await expect(page.locator('[data-testid="calculation-history"]')).toBeVisible();
    await expect(page.locator('text=mFOLFOX6')).toBeVisible();
  });

  test('accessibility compliance', async ({ page }) => {
    // Setup
    await page.fill('[data-testid="patient-weight"]', '70');
    await page.fill('[data-testid="patient-height"]', '175');
    await page.fill('[data-testid="patient-age"]', '60');
    await page.selectOption('[data-testid="patient-sex"]', 'male');
    await page.fill('[data-testid="creatinine-clearance"]', '90');

    await page.click('[data-testid="cancer-selector"]');
    await page.click('text=Gastrointestinal Cancers');
    await page.click('text=Select');
    await page.click('text=mFOLFOX6');
    await page.click('text=Calculate doses');

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="undo-button"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="redo-button"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="save-calculation"]')).toBeFocused();
    
    // Test ARIA labels
    await expect(page.locator('[data-testid="undo-button"]')).toHaveAttribute('aria-label', 'Undo last change');
    await expect(page.locator('[data-testid="redo-button"]')).toHaveAttribute('aria-label', 'Redo last change');
    
    // Test screen reader announcements
    await page.click('[data-testid="edit-doses"]');
    await expect(page.locator('[aria-live="polite"]')).toContainText('Edit mode activated');
    
    // Test alert announcements for dose warnings
    const adjustmentInput = page.locator('[data-testid="dose-adjustment-Oxaliplatin"]');
    await adjustmentInput.fill('200'); // Exceeds limit
    
    await expect(page.locator('[role="alert"]')).toBeVisible();
    await expect(page.locator('[role="alert"]')).toContainText('depășește limita');
  });

  test('error handling and recovery', async ({ page }) => {
    // Test handling of invalid input
    await page.fill('[data-testid="patient-weight"]', 'invalid');
    await page.fill('[data-testid="patient-height"]', '175');
    await page.fill('[data-testid="patient-age"]', '60');
    
    // Should show validation error
    await expect(page.locator('[data-testid="weight-error"]')).toContainText('Please enter a valid weight');
    
    // Test network error simulation
    await page.route('**/api/**', route => route.abort());
    
    // Attempt operation that requires network
    await page.click('[data-testid="export-pdf"]');
    
    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Network error occurred');
    
    // Test recovery
    await page.unroute('**/api/**');
    await page.click('[data-testid="retry-button"]');
    
    // Should recover successfully
    await expect(page.locator('[data-testid="error-message"]')).not.toBeVisible();
  });

  test('responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Test mobile-specific navigation
    await page.fill('[data-testid="patient-weight"]', '70');
    await page.fill('[data-testid="patient-height"]', '175');
    await page.fill('[data-testid="patient-age"]', '60');
    await page.selectOption('[data-testid="patient-sex"]', 'male');
    await page.fill('[data-testid="creatinine-clearance"]', '90');

    await page.click('[data-testid="cancer-selector"]');
    await page.click('text=Gastrointestinal Cancers');
    await page.click('text=Select');
    await page.click('text=mFOLFOX6');
    await page.click('text=Calculate doses');

    // Verify mobile action bar appears
    await expect(page.locator('[data-testid="mobile-action-bar"]')).toBeVisible();
    
    // Test mobile-specific interactions
    await page.click('[data-testid="mobile-edit-button"]');
    await expect(page.locator('[data-testid="dose-calculator"]')).toHaveClass(/editing-mode/);
    
    // Test touch gestures for mobile
    const drugCard = page.locator('[data-testid="drug-card-Oxaliplatin"]');
    await drugCard.click();
    
    // Verify responsive layout
    await expect(drugCard).toHaveCSS('flex-direction', 'column');
  });
});