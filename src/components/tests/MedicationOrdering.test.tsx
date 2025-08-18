import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CompactClinicalTreatmentSheet } from '../CompactClinicalTreatmentSheet';
import { TreatmentData } from '@/types/clinicalTreatment';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const keys: Record<string, string> = {
        'compactSheet.pevGroups': 'PEV Groups',
        'compactSheet.pevNumber': 'PEV',
        'compactSheet.medications': 'Medications',
        'compactSheet.solvent': 'Solvent',
        'compactSheet.given': 'Given ☐',
        'compactSheet.na': 'N/A'
      };
      return keys[key] || key;
    }
  })
}));

describe('Medication Ordering in PDF', () => {
  const mockTreatmentData: TreatmentData = {
    patient: { 
      cnp: '123', 
      weight: 70, 
      height: 175, 
      age: 45, 
      sex: 'M', 
      bsa: 1.85, 
      creatinineClearance: 90, 
      cycleNumber: 1, 
      treatmentDate: '2024-01-15' 
    },
    regimen: {
      id: 'test',
      name: 'Test Regimen',
      drugs: [],
      category: 'test',
      schedule: 'q21d',
      cycles: 6
    },
    calculatedDrugs: [],
    emetogenicRisk: {
      level: 'moderate' as const,
      justification: 'Test',
      acuteRisk: 'Moderate',
      delayedRisk: 'Low'
    },
    premedications: {
      antiemetics: [],
      infusionReactionProphylaxis: [],
      gastroprotection: [],
      organProtection: [],
      other: []
    },
    solventGroups: {
      groups: [
        {
          id: 'pev-1',
          solvent: 'Normal Saline 0.9%',
          medications: [
            { name: 'Granisetron', dosage: '1 mg', unit: 'mg', route: 'IV', timing: '30 min before', category: 'antiemetic', indication: 'CINV', isRequired: true, isStandard: true, solvent: null },
            { name: 'Dexamethasone', dosage: '12 mg', unit: 'mg', route: 'IV', timing: '30 min before', category: 'corticosteroid', indication: 'CINV', isRequired: true, isStandard: true, solvent: null },
            { name: 'Omeprazole', dosage: '40 mg', unit: 'mg', route: 'IV', timing: '30 min before', category: 'PPI', indication: 'GI protection', isRequired: false, isStandard: true, solvent: null }
          ]
        }
      ],
      individual: [
        { name: 'Ondansetron', dosage: '8 mg', unit: 'mg', route: 'IV', timing: '30 min before', category: 'antiemetic', indication: 'CINV', isRequired: true, isStandard: true, solvent: 'Normal Saline 0.9%' }
      ]
    }
  };

  it('should maintain medication order as specified in UI', () => {
    const { container } = render(
      <CompactClinicalTreatmentSheet treatmentData={mockTreatmentData} />
    );

    // Check that PEV group medications appear in the same order
    const medicationCells = container.querySelectorAll('td');
    const medicationTexts = Array.from(medicationCells)
      .map(cell => cell.textContent)
      .filter(text => text && (text.includes('Granisetron') || text.includes('Dexamethasone') || text.includes('Omeprazole')));

    // Should find the medication combination in order
    const combinedText = medicationTexts.join(' ');
    expect(combinedText).toMatch(/Granisetron.*Dexamethasone.*Omeprazole/);
  });

  it('should display individual medications after groups', () => {
    const { container } = render(
      <CompactClinicalTreatmentSheet treatmentData={mockTreatmentData} />
    );

    // Check that individual medications appear after PEV groups
    const rows = container.querySelectorAll('tbody tr');
    
    // First row should be the PEV group
    expect(rows[0]?.textContent).toContain('1 PEV');
    expect(rows[0]?.textContent).toContain('Granisetron');
    
    // Second row should be individual medication as separate PEV
    expect(rows[1]?.textContent).toContain('2 PEV');
    expect(rows[1]?.textContent).toContain('Ondansetron');
  });

  it('should not sort medications alphabetically', () => {
    // Create data with medications in non-alphabetical order
    const customData = {
      ...mockTreatmentData,
      solventGroups: {
        groups: [{
          id: 'pev-1',
          solvent: 'Normal Saline 0.9%',
          medications: [
            { name: 'Zoledronic acid', dosage: '4 mg', unit: 'mg', route: 'IV', timing: '30 min before', category: 'bisphosphonate', indication: 'Bone protection', isRequired: false, isStandard: true, solvent: null },
            { name: 'Aprepitant', dosage: '125 mg', unit: 'mg', route: 'PO', timing: '1 hour before', category: 'NK1 antagonist', indication: 'CINV', isRequired: true, isStandard: true, solvent: null },
            { name: 'Metoclopramide', dosage: '10 mg', unit: 'mg', route: 'IV', timing: '30 min before', category: 'prokinetic', indication: 'CINV', isRequired: false, isStandard: true, solvent: null }
          ]
        }],
        individual: []
      }
    };

    const { container } = render(
      <CompactClinicalTreatmentSheet treatmentData={customData} />
    );

    const medicationCell = container.querySelector('td:nth-child(2)'); // Medications column
    const medicationText = medicationCell?.textContent || '';
    
    // Should maintain Z-A-M order, not sort to A-M-Z
    expect(medicationText).toMatch(/Zoledronic acid.*Aprepitant.*Metoclopramide/);
  });
});