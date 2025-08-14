import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CompactClinicalTreatmentSheet } from './CompactClinicalTreatmentSheet';
import { TreatmentData } from '@/types/clinicalTreatment';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key })
}));

vi.mock('@/utils/dateFormat', () => ({
  formatDate: (date: string) => date
}));

const mockTreatmentData: TreatmentData = {
  patient: { cnp: '123', weight: 70, height: 175, age: 45, sex: 'M', bsa: 1.85, creatinineClearance: 90, cycleNumber: 1, treatmentDate: '2024-01-15' },
  regimen: { id: 'test', name: 'Test', description: 'Test', category: 'adjuvant', drugs: [], schedule: 'Q3W', cycles: 4 },
  calculatedDrugs: [],
  emetogenicRisk: { level: 'moderate', justification: 'Test', acuteRisk: 'Moderate', delayedRisk: 'Low' },
  premedications: { antiemetics: [{ name: 'Ondansetron', dosage: '8 mg', route: 'IV', timing: '30 min', category: 'Antiemetics', indication: 'CINV', solvent: 'Normal Saline 0.9%' }], infusionReactionProphylaxis: [], gastroprotection: [], organProtection: [], other: [] }
};

describe('CompactClinicalTreatmentSheet - Solvent Display', () => {
  it('displays solvent header instead of category header', () => {
    const { getByText } = render(<CompactClinicalTreatmentSheet treatmentData={mockTreatmentData} />);
    expect(getByText('compactSheet.solvent')).toBeInTheDocument();
  });
});