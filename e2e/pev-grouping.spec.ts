import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Navigate to the app
  await page.goto('/');
  
  // Fill in patient data
  await page.fill('[data-testid="cnp-input"]', '1234567890123');
  await page.fill('[data-testid="weight-input"]', '70');
  await page.fill('[data-testid="height-input"]', '175');
  await page.fill('[data-testid="age-input"]', '45');
  await page.selectOption('[data-testid="sex-select"]', 'male');
  await page.fill('[data-testid="creatinine-input"]', '90');
  await page.fill('[data-testid="cycle-input"]', '1');
  await page.fill('[data-testid="treatment-date-input"]', '2024-01-15');

  // Calculate BSA
  await page.click('[data-testid="calculate-bsa-button"]');

  // Navigate to regimen selection
  await page.click('[data-testid="next-to-regimen"]');

  // Select cancer type and regimen
  await page.click('[data-testid="cancer-type-breast"]');
  await page.click('[data-testid="regimen-ac"]');

  // Navigate to supportive care
  await page.click('[data-testid="next-to-supportive-care"]');
});

test('should create PEV groups and display them correctly', async ({ page }) => {
  // Navigate to the grouping tab
  await page.click('[data-testid="grouping-tab"]');

  // Verify PEV grouping interface is visible
  await expect(page.getByText('Intravenous Infusions (PEV)')).toBeVisible();
  await expect(page.getByText('Add New PEV')).toBeVisible();

  // Add a new PEV group
  await page.click('button:has-text("Add New PEV")');
  
  // Verify group was created
  await expect(page.getByText('1 PEV')).toBeVisible();

  // Select solvent for the group
  await page.click('[data-testid="group-solvent-select"]');
  await page.click('[data-testid="solvent-normal-saline"]');

  // Go to recommendations tab and select some agents
  await page.click('[data-testid="recommendations-tab"]');
  await page.check('[data-testid="agent-dexamethasone"]');
  await page.check('[data-testid="agent-granisetron"]');

  // Go back to grouping tab
  await page.click('[data-testid="grouping-tab"]');

  // Verify medications appear in unassigned section
  await expect(page.getByText('Unassigned Medications')).toBeVisible();
  await expect(page.getByText('Dexamethasone')).toBeVisible();
  await expect(page.getByText('Granisetron')).toBeVisible();
});

test('should show validation errors for incomplete PEV groups', async ({ page }) => {
  // Navigate to grouping tab
  await page.click('[data-testid="grouping-tab"]');

  // Add a new PEV group but don't configure it
  await page.click('button:has-text("Add New PEV")');

  // Verify validation error appears
  await expect(page.getByText('Please fix the following issues:')).toBeVisible();
  await expect(page.getByText('1 PEV: No solvent selected')).toBeVisible();
  await expect(page.getByText('1 PEV: No medications assigned')).toBeVisible();
});

test('should display PEV groups in treatment sheet', async ({ page }) => {
  // Navigate to grouping tab
  await page.click('[data-testid="grouping-tab"]');

  // Add and configure a PEV group
  await page.click('button:has-text("Add New PEV")');
  
  // Select solvent
  await page.click('[data-testid="group-solvent-select"]');
  await page.click('[data-testid="solvent-normal-saline"]');

  // Go to recommendations and select agents
  await page.click('[data-testid="recommendations-tab"]');
  await page.check('[data-testid="agent-dexamethasone"]');
  await page.check('[data-testid="agent-granisetron"]');

  // Navigate to review and print
  await page.click('[data-testid="next-to-review"]');

  // Verify PEV groups section exists in treatment sheet
  await expect(page.getByText('Premedication and Supportive Prophylaxis - Solvent Administration')).toBeVisible();
  await expect(page.getByText('1 PEV')).toBeVisible();
  await expect(page.getByText('Dexamethasone')).toBeVisible();
  await expect(page.getByText('Granisetron')).toBeVisible();
  await expect(page.getByText('Normal Saline 0.9%')).toBeVisible();
});

test('should handle individual medications correctly', async ({ page }) => {
  // Go to recommendations and select an agent
  await page.click('[data-testid="recommendations-tab"]');
  await page.check('[data-testid="agent-dexamethasone"]');

  // Navigate to grouping tab
  await page.click('[data-testid="grouping-tab"]');

  // Leave medication in individual section (don't create groups)
  await expect(page.getByText('Individual Medications')).toBeVisible();

  // Navigate to review
  await page.click('[data-testid="next-to-review"]');

  // Verify individual medications section appears
  await expect(page.getByText('Individual Medications')).toBeVisible();
  await expect(page.getByText('Dexamethasone')).toBeVisible();
});

test('should generate PDF with PEV groups', async ({ page }) => {
  // Set up PEV group
  await page.click('[data-testid="grouping-tab"]');
  await page.click('button:has-text("Add New PEV")');
  
  // Select solvent
  await page.click('[data-testid="group-solvent-select"]');
  await page.click('[data-testid="solvent-normal-saline"]');

  // Select agents
  await page.click('[data-testid="recommendations-tab"]');
  await page.check('[data-testid="agent-dexamethasone"]');
  await page.check('[data-testid="agent-granisetron"]');

  // Navigate to review and generate PDF
  await page.click('[data-testid="next-to-review"]');
  
  // Set up PDF download listener
  const downloadPromise = page.waitForEvent('download');
  
  await page.click('[data-testid="export-pdf-button"]');
  
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain('treatment-protocol');
});

test('should persist PEV grouping after navigation', async ({ page }) => {
  // Create PEV group
  await page.click('[data-testid="grouping-tab"]');
  await page.click('button:has-text("Add New PEV")');
  
  // Select solvent
  await page.click('[data-testid="group-solvent-select"]');
  await page.click('[data-testid="solvent-normal-saline"]');

  // Select agents
  await page.click('[data-testid="recommendations-tab"]');
  await page.check('[data-testid="agent-dexamethasone"]');

  // Navigate away and back
  await page.click('[data-testid="solvents-tab"]');
  await page.click('[data-testid="grouping-tab"]');

  // Verify PEV group is still there
  await expect(page.getByText('1 PEV')).toBeVisible();
  await expect(page.getByText('Normal Saline 0.9%')).toBeVisible();
});

test('should delete PEV groups correctly', async ({ page }) => {
  // Create PEV group
  await page.click('[data-testid="grouping-tab"]');
  await page.click('button:has-text("Add New PEV")');
  
  // Select agents first
  await page.click('[data-testid="recommendations-tab"]');
  await page.check('[data-testid="agent-dexamethasone"]');
  
  // Go back to grouping
  await page.click('[data-testid="grouping-tab"]');

  // Delete the group
  await page.click('[data-testid="delete-group-button"]');

  // Verify group is deleted and medication moved to unassigned
  await expect(page.getByText('1 PEV')).not.toBeVisible();
  await expect(page.getByText('Unassigned Medications')).toBeVisible();
  await expect(page.getByText('Dexamethasone')).toBeVisible();
});