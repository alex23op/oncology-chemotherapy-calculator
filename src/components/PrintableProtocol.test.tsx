import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { PrintableProtocol } from './PrintableProtocol';
import type { GroupedPremedications } from '@/types/clinicalTreatment';

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'printableProtocol.noAgents': 'No agents selected for protocol',
        'printableProtocol.headerTitle': 'Chemotherapy Premedication Protocol',
        'printableProtocol.regimen': 'Regimen',
        'printableProtocol.emetogenicRisk': 'Emetogenic Risk',
        'printableProtocol.patientWeight': 'Patient Weight',
        'printableProtocol.premedSupport': 'Premedication and Supportive Prophylaxis',
        'printableProtocol.generated': 'Generated',
        'printableProtocol.totalAgents': 'Total Agents',
        'printableProtocol.footerNote': 'This protocol is computer-generated and should be reviewed by a qualified healthcare professional before use.',
        'printableProtocol.otherCategory': 'Other',
        'compactSheet.pevNumber': 'PEV',
        'compactSheet.medications': 'Medications',
        'compactSheet.solvent': 'Solvent',
        'compactSheet.given': 'Given ☐',
        'compactSheet.na': 'N/A'
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'en'
    }
  })
}));

const mockSolventGroups: GroupedPremedications = {
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
    },
    {
      id: '2',
      solvent: 'Glucose 5% 250ml',
      medications: [
        {
          name: 'Diphenhydramine',
          category: 'Antihistamine',
          class: 'H1 Antagonist',
          dosage: '25mg',
          unit: 'mg',
          route: 'IV',
          timing: '30 min before chemo',
          indication: 'Infusion reaction prophylaxis',
          isRequired: false,
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
};

const mockSelectedAgents = [
  {
    name: 'Ondansetron',
    category: 'Antiemetic',
    class: '5-HT3 Antagonist',
    dosage: '8mg',
    unit: 'mg',
    route: 'IV',
    timing: '30 min before chemo',
    indication: 'CINV prevention'
  }
];

describe('PrintableProtocol', () => {
  describe('PEV Groups Display', () => {
    it('displays PEV groups with sequential numbering', () => {
      const { container } = render(
        <PrintableProtocol
          selectedAgents={[]}
          solventGroups={mockSolventGroups}
        />
      );

      // Check for PEV numbering
      expect(container.textContent).toContain('1 PEV');
      expect(container.textContent).toContain('2 PEV');
      expect(container.textContent).toContain('3 PEV'); // Individual med as PEV
    });

    it('displays grouped medications correctly', () => {
      const { container } = render(
        <PrintableProtocol
          selectedAgents={[]}
          solventGroups={mockSolventGroups}
        />
      );

      // Check for medication names and dosages in first group
      expect(container.textContent).toContain('Dexamethasone');
      expect(container.textContent).toContain('(8mg)');
      expect(container.textContent).toContain('Granisetron');
      expect(container.textContent).toContain('(1mg)');
      expect(container.textContent).toContain('Dexamethasone (8mg) + Granisetron (1mg)');
    });

    it('displays individual medications as separate PEVs', () => {
      const { container } = render(
        <PrintableProtocol
          selectedAgents={[]}
          solventGroups={mockSolventGroups}
        />
      );

      // Check for individual medication as 3rd PEV
      expect(container.textContent).toContain('3 PEV');
      expect(container.textContent).toContain('Ranitidine');
      expect(container.textContent).toContain('(50mg)');
    });

    it('displays solvents correctly for each PEV', () => {
      const { container } = render(
        <PrintableProtocol
          selectedAgents={[]}
          solventGroups={mockSolventGroups}
        />
      );

      expect(container.textContent).toContain('Normal Saline 100ml');
      expect(container.textContent).toContain('Glucose 5% 250ml');
    });

    it('displays PEV section header when groups exist', () => {
      const { container } = render(
        <PrintableProtocol
          selectedAgents={[]}
          solventGroups={mockSolventGroups}
        />
      );

      expect(container.textContent).toContain('Premedication and Supportive Prophylaxis');
    });
  });

  describe('Fallback Display', () => {
    it('falls back to individual medication display when no PEV groups exist', () => {
      const { container } = render(
        <PrintableProtocol
          selectedAgents={mockSelectedAgents}
          solventGroups={undefined}
        />
      );

      // Should display individual medication categories
      expect(container.textContent).toContain('Antiemetic');
      expect(container.textContent).toContain('Ondansetron');
    });

    it('falls back to individual display when PEV groups are empty', () => {
      const emptyGroups: GroupedPremedications = {
        groups: [],
        individual: []
      };

      const { container } = render(
        <PrintableProtocol
          selectedAgents={mockSelectedAgents}
          solventGroups={emptyGroups}
        />
      );

      expect(container.textContent).toContain('Antiemetic');
      expect(container.textContent).toContain('Ondansetron');
    });

    it('does not display individual medication section when PEV groups are configured', () => {
      const { container } = render(
        <PrintableProtocol
          selectedAgents={mockSelectedAgents}
          solventGroups={mockSolventGroups}
        />
      );

      // Should not display category-based sections when PEV groups exist
      expect(container.textContent).not.toContain('Antiemetic');
      expect(container.textContent).not.toContain('Ondansetron');
    });
  });

  describe('Empty State', () => {
    it('displays no agents message when no medications are provided', () => {
      const { container } = render(
        <PrintableProtocol
          selectedAgents={[]}
          solventGroups={undefined}
        />
      );

      expect(container.textContent).toContain('No agents selected for protocol');
    });
  });

  describe('Header and Footer', () => {
    it('displays header information correctly', () => {
      const { container } = render(
        <PrintableProtocol
          selectedAgents={[]}
          solventGroups={mockSolventGroups}
          regimenName="FOLFOX"
          emetogenicRisk="Moderate"
          patientWeight={70}
        />
      );

      expect(container.textContent).toContain('Chemotherapy Premedication Protocol');
      expect(container.textContent).toContain('FOLFOX');
      expect(container.textContent).toContain('Moderate');
      expect(container.textContent).toContain('70 kg');
    });

    it('displays footer information', () => {
      const { container } = render(
        <PrintableProtocol
          selectedAgents={mockSelectedAgents}
          solventGroups={mockSolventGroups}
        />
      );

      expect(container.textContent).toContain('Generated:');
      expect(container.textContent).toContain('This protocol is computer-generated and should be reviewed by a qualified healthcare professional before use.');
    });
  });
});