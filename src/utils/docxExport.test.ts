import { describe, it, expect, vi } from 'vitest';
import { generateClinicalTreatmentDOCX } from '@/utils/docxExport';
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
  premedications: {
    antiemetics: [],
    infusionReactionProphylaxis: [],
    gastroprotection: [],
    organProtection: [],
    other: [],
  },
};

describe('docxExport.generateClinicalTreatmentDOCX', () => {
  it('generates DOCX successfully with valid data', async () => {
    // Mock the DOM methods for DOCX generation
    const mockLink = {
      click: vi.fn(),
    };
    const mockCreateElement = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
    const mockAppendChild = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any);
    const mockRemoveChild = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any);
    
    // Mock URL methods
    const mockCreateObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('mock-url');
    const mockRevokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    await expect(
      generateClinicalTreatmentDOCX({
        ...baseData,
        orientation: 'portrait',
      })
    ).resolves.not.toThrow();

    // Verify DOM manipulation happened
    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockAppendChild).toHaveBeenCalled();
    expect(mockRemoveChild).toHaveBeenCalled();
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();

    // Restore mocks
    mockCreateElement.mockRestore();
    mockAppendChild.mockRestore();
    mockRemoveChild.mockRestore();
    mockCreateObjectURL.mockRestore();
    mockRevokeObjectURL.mockRestore();
  });
});