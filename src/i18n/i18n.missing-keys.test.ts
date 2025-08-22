import { describe, it, expect, beforeEach } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('i18n Missing Keys Detection', () => {
  it('should not have missing keys in locale files', async () => {
    try {
      const { stdout, stderr } = await execAsync('node scripts/check-i18n.js');
      
      // If the script exits successfully, there should be no issues
      expect(stdout).toContain('✔ i18n keys are consistent');
      expect(stderr).toBe('');
    } catch (error: any) {
      // If the script fails, it means there are missing keys
      console.error('i18n check failed:', error.stdout);
      throw new Error(`i18n inconsistencies found. Run 'npm run check:i18n --fix' to resolve.\n\n${error.stdout}`);
    }
  });

  it('should not have keys used in source code but missing from locales', async () => {
    try {
      const { stdout, stderr } = await execAsync('node scripts/check-i18n.js --scan-usage');
      
      expect(stdout).toContain('✔ i18n keys are consistent');
      expect(stdout).toContain('✔ All keys used in source code are present in locale files');
      expect(stderr).toBe('');
    } catch (error: any) {
      console.error('i18n usage check failed:', error.stdout);
      throw new Error(`i18n keys used in code but missing from locales. Run 'node scripts/check-i18n.js --scan-usage --fix' to resolve.\n\n${error.stdout}`);
    }
  });
});