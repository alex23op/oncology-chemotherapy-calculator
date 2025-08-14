import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PremedProtocolSelector } from './PremedProtocolSelector';
import { Premedication } from '@/types/regimens';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      const translations: Record<string, string> = {
        'premedSelector.title': 'Premedication Protocol Selector',
        'premedSelector.tabs.solvents': 'Solvents',
        'premedSelector.noneSelected': 'No premedications selected',
        'premedSelector.solvent': 'Solvent',
      };
      return translations[key] || key;
    }
  })
}));

const mockPremedication: Premedication = {
  name: 'Ondansetron',
  dosage: '8',
  unit: 'mg',
  route: 'IV',
  timing: '30 minutes before chemotherapy',
  category: 'antiemetic',
  indication: 'Prevention of acute CINV',
  isRequired: true,
  isStandard: true,
};

describe('PremedProtocolSelector - Solvent Selection', () => {
  const defaultProps = {
    drugNames: ['paclitaxel'],
    selectedPremedications: [mockPremedication],
    onPremedSelectionsChange: vi.fn(),
    weight: 70
  };

  it('displays solvents tab', () => {
    const { getByText } = render(<PremedProtocolSelector {...defaultProps} />);
    expect(getByText('Solvents')).toBeInTheDocument();
  });
});