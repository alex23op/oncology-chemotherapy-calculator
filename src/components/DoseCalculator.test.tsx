import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DoseCalculatorEnhanced } from '@/components/DoseCalculatorEnhanced';
import { SmartNavProvider } from '@/context/SmartNavContext';
import i18n from '@/i18n';

const wrap = (ui: React.ReactNode) => render(<SmartNavProvider>{ui}</SmartNavProvider>);

const mockRegimen = {
  id: 'reg-1',
  name: 'Test Regimen',
  description: 'desc',
  category: 'adjuvant' as const,
  drugs: [
    { name: 'DrugA', dosage: '100', unit: 'mg/m²', route: 'IV', day: 'Day 1', drugClass: 'chemotherapy' as const },
  ],
  schedule: 'q21',
  cycles: 6,
};

describe('DoseCalculator Edit/Save buttons', () => {
  it('renders two Edit/Save buttons that share state', async () => {
    await i18n.changeLanguage('en');

    const { findAllByRole } = wrap(
      <DoseCalculatorEnhanced
        regimen={mockRegimen}
        bsa={1.8}
        weight={70}
        height={175}
        age={60}
        sex="male"
        creatinineClearance={90}
      />
    );

    const editButtons = await findAllByRole('button', { name: /edit/i });
    expect(editButtons.length).toBeGreaterThanOrEqual(2);

    await userEvent.click(editButtons[0]);
    const saveButtons = await findAllByRole('button', { name: /save/i });
    expect(saveButtons.length).toBeGreaterThanOrEqual(2);
  });
});
