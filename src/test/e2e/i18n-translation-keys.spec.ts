import { test, expect } from '@playwright/test';

test.describe('i18n Translation Keys', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('verifies translations in UnifiedProtocolSelector', async ({ page }) => {
    // Navigate to step that shows UnifiedProtocolSelector
    await page.click('text=Continue to Regimen Selection');
    await page.click('text=Continue to Supportive Care');
    
    // Check English translations
    await expect(page.locator('text=Recommended Protocols')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Evidence-based recommendations')).toBeVisible();
    
    // Switch to Romanian
    await page.click('[data-testid="language-toggle"]');
    await page.click('text=Română');
    
    // Check Romanian translations
    await expect(page.locator('text=Protocoale Recomandate')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Recomandări bazate pe dovezi')).toBeVisible();
  });

  test('verifies translations in CancerTypeSelector', async ({ page }) => {
    // Navigate to regimen selection step
    await page.click('text=Continue to Regimen Selection');
    
    // Check English translations
    await expect(page.locator('text=Filter by Treatment Setting')).toBeVisible();
    await expect(page.locator('text=All')).toBeVisible();
    await expect(page.locator('text=Neoadjuvant')).toBeVisible();
    
    // Switch to Romanian
    await page.click('[data-testid="language-toggle"]');
    await page.click('text=Română');
    
    // Check Romanian translations
    await expect(page.locator('text=Filtrați după mediul de tratament')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Toate')).toBeVisible();
    await expect(page.locator('text=Neoadjuvant')).toBeVisible();
  });

  test('checks for missing translation keys', async ({ page }) => {
    // Create console log listener to catch missing translation keys
    const missingKeys: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'warning' && msg.text().includes('Missing i18n key')) {
        missingKeys.push(msg.text());
      }
    });

    // Navigate through all main steps to trigger translation key usage
    await page.click('text=Continue to Regimen Selection');
    await page.click('text=Continue to Supportive Care');
    await page.click('text=Continue to Dose Calculation');
    
    // Switch languages to test both sets of translations
    await page.click('[data-testid="language-toggle"]');
    await page.click('text=Română');
    
    // Wait a bit for any async translations to load
    await page.waitForTimeout(2000);
    
    // Assert no missing translation keys were found
    expect(missingKeys.length).toBe(0);
    if (missingKeys.length > 0) {
      console.log('Missing translation keys found:', missingKeys);
    }
  });

  test('validates key format correctness', async ({ page }) => {
    // Check that no raw translation keys with invalid formats are displayed
    const invalidKeyPatterns = [
      /.*:\s*$/,  // Keys ending with ':'
      /.*\.\s*$/, // Keys ending with '.'
      /.*\.\..*/, // Keys with double dots
    ];

    // Navigate through the application
    await page.click('text=Continue to Regimen Selection');
    await page.click('text=Continue to Supportive Care');
    
    const bodyText = await page.textContent('body');
    
    for (const pattern of invalidKeyPatterns) {
      const matches = bodyText?.match(pattern);
      expect(matches).toBeFalsy();
      if (matches) {
        console.log(`Found invalid key format: ${matches[0]}`);
      }
    }
  });

  test('checks subtype translations for multi-category cancers', async ({ page }) => {
    // Navigate to regimen selection
    await page.click('text=Continue to Regimen Selection');
    
    // Click on a cancer type that has subtypes (like GI)
    await page.click('text=Gastrointestinal Cancer');
    
    // Check that subtype selector appears with proper translations
    await expect(page.locator('text=Subtype')).toBeVisible();
    await expect(page.locator('text=Select subtype')).toBeVisible();
    
    // Switch to Romanian and check translations
    await page.click('[data-testid="language-toggle"]');
    await page.click('text=Română');
    
    await expect(page.locator('text=Subtip')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Selectați subtipul')).toBeVisible();
  });

  test('validates fallback behavior for missing keys', async ({ page }) => {
    // This test would need to be run in development mode
    // to see the safe translation utility in action
    
    // For now, we'll just verify that the app doesn't crash
    // when encountering potentially missing keys
    await page.goto('/');
    
    // Navigate through all steps
    await page.click('text=Continue to Regimen Selection');
    await page.click('text=Continue to Supportive Care');
    await page.click('text=Continue to Dose Calculation');
    await page.click('text=Continue to Review');
    
    // Ensure the page is still functional
    await expect(page.locator('h1, h2, h3')).toBeVisible();
  });
});