import { test, expect } from '@playwright/test';

test.describe('i18n Raw Keys Detection', () => {
  test('should not display raw i18n keys in the UI', async ({ page }) => {
    // Navigate to the main page
    await page.goto('/');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Get all visible text content
    const bodyText = await page.textContent('body');
    
    // Pattern to detect potential i18n keys (word.word with no spaces)
    const keyPattern = /\b[a-zA-Z0-9_-]+\.[a-zA-Z0-9_.-]+\b/g;
    const suspiciousTexts = bodyText?.match(keyPattern) || [];
    
    // Filter out false positives (URLs, file paths, etc.)
    const likelyI18nKeys = suspiciousTexts.filter(text => {
      // Skip URLs and file extensions
      if (text.includes('http') || text.includes('www.') || text.match(/\.(com|org|net|jpg|png|svg|css|js)$/)) {
        return false;
      }
      
      // Skip version numbers and semantic versioning
      if (/^\d+\.\d+/.test(text)) {
        return false;
      }
      
      // Skip obvious technical identifiers (classes, etc.)
      if (text.startsWith('_') || text.includes('__')) {
        return false;
      }
      
      return true;
    });
    
    // Log any suspicious texts for debugging
    if (likelyI18nKeys.length > 0) {
      console.log('Suspicious texts that look like i18n keys:', likelyI18nKeys);
    }
    
    expect(likelyI18nKeys).toEqual([]);
  });
  
  test('should not display raw i18n keys after navigating through wizard steps', async ({ page }) => {
    await page.goto('/');
    
    // Fill in patient data
    await page.fill('input[placeholder*="prenume"]', 'Test Patient');
    await page.fill('input[placeholder*="CNP"]', '1234567890123');
    await page.fill('input[placeholder*="observație"]', 'TEST123');
    await page.fill('input[type="number"][placeholder*="greutate"]', '70');
    await page.fill('input[type="number"][placeholder*="înălțime"]', '175');
    await page.fill('input[type="number"][placeholder*="vârstă"]', '45');
    
    // Select sex
    await page.click('button[role="combobox"]');
    await page.click('div[role="option"]:has-text("Masculin"), div[role="option"]:has-text("Male")');
    
    // Wait a bit for auto-calculation
    await page.waitForTimeout(1000);
    
    // Check for raw i18n keys in the current state
    let bodyText = await page.textContent('body');
    let keyPattern = /\b[a-zA-Z0-9_-]+\.[a-zA-Z0-9_.-]+\b/g;
    let suspiciousTexts = bodyText?.match(keyPattern) || [];
    let likelyI18nKeys = suspiciousTexts.filter(text => {
      return !text.includes('http') && 
             !text.includes('www.') && 
             !text.match(/\.(com|org|net|jpg|png|svg|css|js)$/) &&
             !/^\d+\.\d+/.test(text) &&
             !text.startsWith('_') &&
             !text.includes('__');
    });
    
    expect(likelyI18nKeys, `Raw i18n keys found after patient form: ${likelyI18nKeys.join(', ')}`).toEqual([]);
    
    // Try to navigate to regimen selection (if possible)
    const regimenStep = page.locator('text="Regimen selection", text="Selectare regim"').first();
    if (await regimenStep.isVisible()) {
      await regimenStep.click();
      await page.waitForTimeout(500);
      
      bodyText = await page.textContent('body');
      suspiciousTexts = bodyText?.match(keyPattern) || [];
      likelyI18nKeys = suspiciousTexts.filter(text => {
        return !text.includes('http') && 
               !text.includes('www.') && 
               !text.match(/\.(com|org|net|jpg|png|svg|css|js)$/) &&
               !/^\d+\.\d+/.test(text) &&
               !text.startsWith('_') &&
               !text.includes('__');
      });
      
      expect(likelyI18nKeys, `Raw i18n keys found in regimen selection: ${likelyI18nKeys.join(', ')}`).toEqual([]);
    }
  });
});