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

const mockTreatmentDataWithPEVs: TreatmentData = {
  patient: { cnp: '123', weight: 70, height: 175, age: 45, sex: 'M', bsa: 1.85, creatinineClearance: 90, cycleNumber: 1, treatmentDate: '2024-01-15' },
  regimen: { id: 'test', name: 'Test Regimen', description: 'Test', category: 'adjuvant', drugs: [], schedule: 'Q3W', cycles: 4 },
  calculatedDrugs: [],
  emetogenicRisk: { level: 'moderate', justification: 'Test', acuteRisk: 'Moderate', delayedRisk: 'Low' },
  premedications: { antiemetics: [], infusionReactionProphylaxis: [], gastroprotection: [], organProtection: [], other: [] },
  solventGroups: {
    groups: [
      {
        id: 'group-1',
        solvent: 'Normal Saline 0.9%',
        medications: [
          { name: 'Dexametazonă', dosage: '8 mg', route: 'IV', timing: '30 min', category: 'Antiemetics', indication: 'CINV', class: 'Corticosteroid', unit: 'mg', isRequired: true, isStandard: true, solvent: null },
          { name: 'Granisetron', dosage: '1 mg', route: 'IV', timing: '30 min', category: 'Antiemetics', indication: 'CINV', class: '5-HT3 Antagonist', unit: 'mg', isRequired: true, isStandard: true, solvent: null }
        ]
      },
      {
        id: 'group-2',
        solvent: 'Glucoză 250 ml',
        medications: [
          { name: 'Omeprazol', dosage: '40 mg', route: 'IV', timing: '15 min', category: 'GI Protection', indication: 'Gastroprotection', class: 'PPI', unit: 'mg', isRequired: true, isStandard: true, solvent: null }
        ]
      }
    ],
    individual: [
      { name: 'Difenhidramină', dosage: '25 mg', route: 'IV', timing: '15 min', category: 'Antiemetics', indication: 'Allergy prophylaxis', solvent: 'Normal Saline 0.9%', class: 'Antihistamine', unit: 'mg', isRequired: true, isStandard: true }
    ]
  }
};

const mockTreatmentDataWithoutPEVs: TreatmentData = {
  patient: { cnp: '123', weight: 70, height: 175, age: 45, sex: 'M', bsa: 1.85, creatinineClearance: 90, cycleNumber: 1, treatmentDate: '2024-01-15' },
  regimen: { id: 'test', name: 'Test Regimen', description: 'Test', category: 'adjuvant', drugs: [], schedule: 'Q3W', cycles: 4 },
  calculatedDrugs: [],
  emetogenicRisk: { level: 'moderate', justification: 'Test', acuteRisk: 'Moderate', delayedRisk: 'Low' },
  premedications: { 
    antiemetics: [{ name: 'Ondansetron', dosage: '8 mg', route: 'IV', timing: '30 min', category: 'Antiemetics', indication: 'CINV', solvent: 'Normal Saline 0.9%', class: '5-HT3 Antagonist', unit: 'mg', isRequired: true, isStandard: true }], 
    infusionReactionProphylaxis: [], 
    gastroprotection: [], 
    organProtection: [], 
    other: [] 
  }
};

describe('CompactClinicalTreatmentSheet - Unified PEV Display', () => {
  it('displays PEV groups with sequential numbering', () => {
    const { getByText } = render(<CompactClinicalTreatmentSheetOptimized treatmentData={mockTreatmentDataWithPEVs} />);
    
    // Check PEV numbers
    expect(getByText('1 PEV')).toBeInTheDocument();
    expect(getByText('2 PEV')).toBeInTheDocument();
    expect(getByText('3 PEV')).toBeInTheDocument(); // Individual medication becomes 3rd PEV
  });

  it('displays grouped medications correctly', () => {
    const { getByText } = render(<CompactClinicalTreatmentSheetOptimized treatmentData={mockTreatmentDataWithPEVs} />);
    
    // Check that grouped medications are displayed with + separator
    expect(getByText('Dexametazonă')).toBeInTheDocument();
    expect(getByText('Granisetron')).toBeInTheDocument();
    expect(getByText('NaCl 100 ml')).toBeInTheDocument();
  });

  it('displays individual medications as separate PEVs', () => {
    const { getByText } = render(<CompactClinicalTreatmentSheetOptimized treatmentData={mockTreatmentDataWithPEVs} />);
    
    // Check that individual medication appears as separate PEV
    expect(getByText('Difenhidramină')).toBeInTheDocument();
  });

  it('displays PEV section header when groups exist', () => {
    const { getByText } = render(<CompactClinicalTreatmentSheetOptimized treatmentData={mockTreatmentDataWithPEVs} />);
    expect(getByText('compactSheet.pevGroups')).toBeInTheDocument();
  });

  it('falls back to individual medication display when no PEVs exist', () => {
    const { getByText } = render(<CompactClinicalTreatmentSheetOptimized treatmentData={mockTreatmentDataWithoutPEVs} />);
    
    // Should show fallback section
    expect(getByText('compactSheet.premedSupport')).toBeInTheDocument();
    expect(getByText('Ondansetron')).toBeInTheDocument();
  });

  it('does not display individual medication section when PEVs are configured', () => {
    const { queryByText } = render(<CompactClinicalTreatmentSheetOptimized treatmentData={mockTreatmentDataWithPEVs} />);
    
    // Should not show the old individual medications section
    expect(queryByText('compactSheet.individualMeds')).not.toBeInTheDocument();
  });
});