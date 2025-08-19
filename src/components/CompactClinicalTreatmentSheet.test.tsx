import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CompactClinicalTreatmentSheetOptimized } from './CompactClinicalTreatmentSheetOptimized';
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
  premedications: { antiemetics: [{ name: 'Ondansetron', dosage: '8 mg', route: 'IV', timing: '30 min', category: 'Antiemetics', indication: 'CINV', solvent: 'Soluție NaCl 0.9% 250ml', class: '5-HT3 Antagonist', unit: 'mg', isRequired: true, isStandard: true }], infusionReactionProphylaxis: [], gastroprotection: [], organProtection: [], other: [] },
  solventGroups: {
    groups: [
      {
        id: 'group-1',
        solvent: 'Soluție NaCl 0.9% 250ml',
        medications: [{
          name: 'Dexametazonă',
          dosage: '8 mg',
          route: 'IV',
          timing: '30 min',
          category: 'Antiemetics',
          indication: 'CINV',
          class: 'Corticosteroid',
          unit: 'mg',
          isRequired: true,
          isStandard: true,
          solvent: null
        }]
      }
    ],
    individual: [
      { name: 'Difenhidramină', dosage: '25 mg', route: 'IV', timing: '15 min', category: 'Antiemetics', indication: 'Allergy prophylaxis', solvent: 'Soluție glucoză 5% 250ml', class: 'Antihistamine', unit: 'mg', isRequired: true, isStandard: true }
    ]
  }
};

describe('CompactClinicalTreatmentSheet - PEV Display', () => {
  it('displays PEV groups with sequential numbering', () => {
    const { getByText } = render(<CompactClinicalTreatmentSheetOptimized treatmentData={mockTreatmentData} />);
    expect(getByText('1 PEV')).toBeInTheDocument();
    expect(getByText('2 PEV')).toBeInTheDocument();
  });

  it('displays individual medications as separate PEVs', () => {
    const { getByText } = render(<CompactClinicalTreatmentSheetOptimized treatmentData={mockTreatmentData} />);
    expect(getByText('Difenhidramină')).toBeInTheDocument();
  });

  it('displays PEV section header', () => {
    const { getByText } = render(<CompactClinicalTreatmentSheetOptimized treatmentData={mockTreatmentData} />);
    expect(getByText('compactSheet.pevGroups')).toBeInTheDocument();
  });
});