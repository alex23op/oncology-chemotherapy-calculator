import { test } from '@playwright/test';
import { execFileSync } from 'node:child_process';

// Ensures i18n key consistency is validated in Playwright runs too
// Fails the suite if the script reports inconsistencies
// Run manually as: node scripts/check-i18n.js [--fix]

test('i18n keys consistency via check-i18n script', async () => {
  try {
    const output = execFileSync('node', ['scripts/check-i18n.js'], { encoding: 'utf8' });
    // Optionally log output for debug in CI
    console.log(output);
  } catch (err: any) {
    const stdout = (err && err.stdout ? String(err.stdout) : '').trim();
    const stderr = (err && err.stderr ? String(err.stderr) : '').trim();
    throw new Error(
      `check-i18n failed.\n\nSTDOUT:\n${stdout}\n\nSTDERR:\n${stderr}`
    );
  }
});
