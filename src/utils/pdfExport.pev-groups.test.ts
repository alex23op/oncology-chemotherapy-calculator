import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateClinicalTreatmentPDF, generateProtocolPDF } from '@/utils/pdfExport';
import type { TreatmentData, GroupedPremedications } from '@/types/clinicalTreatment';

// Mock jsPDF and html2canvas
vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => ({
    internal: {
      pageSize: {
        getWidth: () => 210,
        getHeight: () => 297
      }
    },
    setFontSize: vi.fn(),
    setFont: vi.fn(),
    text: vi.fn(),
    addImage: vi.fn(),
    addPage: vi.fn(),
    save: vi.fn()
  }))
}));

vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: () => 'data:image/png;base64,fake',
    width: 800,
    height: 600
  })
}));

const mockTreatmentDataWithPEVGroups: TreatmentData = {
  patient: {
    cnp: '1234567890123',
    weight: 70,
    height: 175,
    age: 60,
    sex: 'male',
    bsa: 1.9,
    creatinineClearance: 90,
    cycleNumber: 1,
    treatmentDate: '2025-01-01'
  },
  regimen: {
    id: 'folfox',
    name: 'FOLFOX',
    description: 'desc',
    category: 'adjuvant',
    drugs: [],
    schedule: 'q14',
    cycles: 6
  },
  calculatedDrugs: [],
  emetogenicRisk: {
    level: 'moderate',
    justification: 'test',
    acuteRisk: '30-90%',
    delayedRisk: '30-90%'
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
        id: '1',
        solvent: 'Normal Saline 100ml',
        medications: [
          {
            name: 'Dexamethasone',
            category: 'Corticosteroid',
            class: 'Corticosteroid',
            dosage: '8mg',
            unit: 'mg',
            route: 'IV',
            timing: '30 min before chemo',
            indication: 'Antiemetic',
            isRequired: true,
            isStandard: true
          },
          {
            name: 'Granisetron',
            category: '5-HT3 Antagonist',
            class: 'Serotonin Antagonist',
            dosage: '1mg',
            unit: 'mg',
            route: 'IV',
            timing: '30 min before chemo',
            indication: 'Antiemetic',
            isRequired: true,
            isStandard: true
          }
        ]
      }
    ],
    individual: [
      {
        name: 'Ranitidine',
        category: 'H2 Blocker',
        class: 'H2 Antagonist',
        dosage: '50mg',
        unit: 'mg',
        route: 'IV',
        timing: '30 min before chemo',
        indication: 'Gastroprotection',
        isRequired: false,
        isStandard: true,
        solvent: 'Normal Saline 100ml'
      }
    ]
  }
};

describe('PDF Export with PEV Groups', () => {
  beforeEach(() => {
    // Mock DOM element for PDF generation
    const mockElement = document.createElement('div');
    mockElement.id = 'test-treatment-sheet';
    mockElement.innerHTML = `
      <div class="compact-treatment-sheet">
        <h3>PEV Groups</h3>
        <table>
          <tbody>
            <tr><td>1 PEV</td><td>Dexamethasone (8mg) + Granisetron (1mg)</td><td>Normal Saline 100ml</td></tr>
            <tr><td>2 PEV</td><td>Ranitidine (50mg)</td><td>Normal Saline 100ml</td></tr>
          </tbody>
        </table>
      </div>
    `;
    document.body.appendChild(mockElement);

    Object.defineProperty(mockElement, 'scrollWidth', { value: 800 });
    Object.defineProperty(mockElement, 'scrollHeight', { value: 600 });
  });

  afterEach(() => {
    // Clean up DOM
    const element = document.getElementById('test-treatment-sheet');
    if (element) {
      element.remove();
    }
  });

  it('generates PDF with PEV groups data in filename', async () => {
    const exportData = {
      ...mockTreatmentDataWithPEVGroups,
      elementId: 'test-treatment-sheet',
      orientation: 'portrait' as const
    };

    await generateClinicalTreatmentPDF(exportData);

    // Verify the PDF save was called with correct filename
    const jsPDF = await import('jspdf');
    const mockSave = vi.mocked(jsPDF.default).mock.results[0].value.save;
    expect(mockSave).toHaveBeenCalledWith(
      expect.stringMatching(/treatment-protocol-1234567890123-folfox-cycle1-\d{4}-\d{2}-\d{2}\.pdf/)
    );
  });

  it('throws error when element not found', async () => {
    const exportData = {
      ...mockTreatmentDataWithPEVGroups,
      elementId: 'non-existent-element',
      orientation: 'portrait' as const
    };

    await expect(generateClinicalTreatmentPDF(exportData)).rejects.toThrow(
      /Protocol element not found/
    );
  });

  it('generates protocol PDF with PEV groups correctly', async () => {
    const protocolData = {
      selectedAgents: [],
      regimenName: 'FOLFOX',
      patientWeight: 70,
      emetogenicRisk: 'Moderate'
    };

    await generateProtocolPDF(protocolData, 'test-treatment-sheet');

    // Verify PDF generation completed without errors
    const jsPDF = await import('jspdf');
    const mockSave = vi.mocked(jsPDF.default).mock.results[0].value.save;
    expect(mockSave).toHaveBeenCalled();
  });
});