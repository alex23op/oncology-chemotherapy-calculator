import { describe, it, expect } from 'vitest';
import i18n from '@/i18n';

describe('i18n localization', () => {
  it('switches between en and ro for wizard patient step', async () => {
    await i18n.changeLanguage('en');
    const enText = i18n.t('wizard.steps.patient');
    await i18n.changeLanguage('ro');
    const roText = i18n.t('wizard.steps.patient');
    expect(typeof enText).toBe('string');
    expect(typeof roText).toBe('string');
    expect(enText).not.toEqual(roText);
  });
});
