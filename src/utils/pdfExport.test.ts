import { describe, it, expect } from 'vitest';
import { generateClinicalTreatmentPDF } from '@/utils/pdfExport';
import type { TreatmentData } from '@/types/clinicalTreatment';

const baseData: TreatmentData = {
  patient: {
    cnp: '1234567890123',
    weight: 70,
    height: 175,
    age: 60,
    sex: 'male',
    bsa: 1.9,
    creatinineClearance: 90,
    cycleNumber: 1,
    treatmentDate: '2025-01-01',
  },
  regimen: {
    id: 'test-reg',
    name: 'Test Regimen',
    description: 'desc',
    category: 'adjuvant',
    drugs: [],
    schedule: 'q21',
    cycles: 6,
  },
  calculatedDrugs: [],
  emetogenicRisk: {
    level: 'low',
    justification: 'test',
    acuteRisk: '10-30%',
    delayedRisk: '10-30%',
  },
  premedications: {
    antiemetics: [],
    infusionReactionProphylaxis: [],
    gastroprotection: [],
    organProtection: [],
    other: [],
  },
};

describe('pdfExport.generateClinicalTreatmentPDF', () => {
  it('throws a clear error when elementId is missing from DOM', async () => {
    await expect(
      generateClinicalTreatmentPDF({
        ...baseData,
        elementId: 'missing-element',
        orientation: 'portrait',
      })
    ).rejects.toThrow(/Protocol element not found/);
  });
});
