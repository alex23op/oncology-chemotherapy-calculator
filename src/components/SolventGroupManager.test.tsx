import React from 'react';
import { render } from '@testing-library/react';
import { expect, describe, test, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { SolventGroupManager } from './SolventGroupManager';
import { PremedAgent, GroupedPremedications } from '@/types/clinicalTreatment';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, any>) => {
      const translations: { [key: string]: string } = {
        'solventGroups.description': 'Group medications that can be administered in the same solvent bag.',
        'solventGroups.pevTitle': 'Intravenous Infusions (PEV)',
        'solventGroups.addNewPev': 'Add New PEV',
        'solventGroups.pevNumber': '{{number}} PEV',
        'solventGroups.individual': 'Individual Medications',
        'solventGroups.unassigned': 'Unassigned Medications',
        'solventGroups.dropHere': 'Drop medications here to group them',
        'solventGroups.noIndividual': 'No individual medications',
        'solventGroups.unassignedHelp': 'These medications need to be assigned to a group or moved to individual administration.',
        'solventGroups.validation.title': 'Please fix the following issues:',
        'solventGroups.validation.noSolvent': '{{pev}} PEV: No solvent selected',
        'solventGroups.validation.emptyPev': '{{pev}} PEV: No medications assigned',
        'unifiedSelector.solvent': 'Solvent',
        'doseCalculator.selectSolvent': 'Select solvent',
        'doseCalculator.solvents.normalSaline': 'Normal Saline 0.9%',
        'doseCalculator.solvents.dextrose5': 'Dextrose 5%',
        'doseCalculator.solvents.ringer': 'Ringer Solution',
        'doseCalculator.solvents.waterForInjection': 'Water for Injection'
      };
      
      if (params && key.includes('{{')) {
        return key.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => params[paramKey] || match);
      }
      
      return translations[key] || key;
    }
  })
}));

// Mock @hello-pangea/dnd
vi.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => <div data-testid="drag-drop-context">{children}</div>,
  Droppable: ({ children }: { children: (provided: any) => React.ReactNode }) => (
    <div data-testid="droppable">
      {children({
        innerRef: vi.fn(),
        droppableProps: {},
        placeholder: <div data-testid="placeholder" />
      })}
    </div>
  ),
  Draggable: ({ children }: { children: (provided: any, snapshot: any) => React.ReactNode }) => (
    <div data-testid="draggable">
      {children(
        {
          innerRef: vi.fn(),
          draggableProps: {},
          dragHandleProps: {}
        },
        { isDragging: false }
      )}
    </div>
  )
}));

const mockPremedications: PremedAgent[] = [
  {
    name: 'Dexamethasone',
    category: 'Antiemetics',
    class: 'Corticosteroid',
    dosage: '8 mg',
    unit: 'mg',
    route: 'IV',
    timing: '30 min before',
    indication: 'CINV prevention',
    rationale: 'Standard antiemetic',
    isRequired: true,
    isStandard: true,
    administrationDuration: '15 min',
    solvent: 'Soluție NaCl 0.9% 250ml'
  },
  {
    name: 'Granisetron',
    category: 'Antiemetics',
    class: '5-HT3 Antagonist',
    dosage: '3 mg',
    unit: 'mg',
    route: 'IV',
    timing: '30 min before',
    indication: 'CINV prevention',
    rationale: 'Serotonin antagonist',
    isRequired: true,
    isStandard: true,
    administrationDuration: '15 min',
    solvent: 'Soluție NaCl 0.9% 250ml'
  }
];

const mockGroupedPremedications: GroupedPremedications = {
  groups: [
    {
      id: 'group-1',
      solvent: 'Normal Saline 0.9%',
      medications: [mockPremedications[0]]
    }
  ],
  individual: [mockPremedications[1]]
};

describe('SolventGroupManager', () => {
  const mockOnGroupingChange = vi.fn();

  beforeEach(() => {
    mockOnGroupingChange.mockClear();
  });

  test('renders PEV groups correctly', () => {
    render(
      <SolventGroupManager
        selectedAgents={mockPremedications}
        groupedPremedications={mockGroupedPremedications}
        onGroupingChange={mockOnGroupingChange}
      />
    );

    expect(document.body).toContainHTML('Intravenous Infusions (PEV)');
    expect(document.body).toContainHTML('Add New PEV');
    expect(document.body).toContainHTML('1 PEV');
  });

  test('shows validation error for group without solvent', () => {
    const groupsWithoutSolvent: GroupedPremedications = {
      groups: [
        {
          id: 'group-1',
          solvent: '',
          medications: [mockPremedications[0]]
        }
      ],
      individual: []
    };

    render(
      <SolventGroupManager
        selectedAgents={mockPremedications}
        groupedPremedications={groupsWithoutSolvent}
        onGroupingChange={mockOnGroupingChange}
      />
    );

    expect(document.body).toContainHTML('Please fix the following issues:');
    expect(document.body).toContainHTML('1 PEV: No solvent selected');
  });

  test('shows validation error for empty group', () => {
    const emptyGroups: GroupedPremedications = {
      groups: [
        {
          id: 'group-1',
          solvent: 'Normal Saline 0.9%',
          medications: []
        }
      ],
      individual: []
    };

    render(
      <SolventGroupManager
        selectedAgents={mockPremedications}
        groupedPremedications={emptyGroups}
        onGroupingChange={mockOnGroupingChange}
      />
    );

    expect(document.body).toContainHTML('Please fix the following issues:');
    expect(document.body).toContainHTML('1 PEV: No medications assigned');
  });

  test('creates new PEV group when button is clicked', () => {
    render(
      <SolventGroupManager
        selectedAgents={mockPremedications}
        groupedPremedications={{ groups: [], individual: [] }}
        onGroupingChange={mockOnGroupingChange}
      />
    );

    const addButton = document.querySelector('button:has-text("Add New PEV")') as HTMLButtonElement;
    if (addButton) {
      addButton.click();
    }

    expect(mockOnGroupingChange).toHaveBeenCalledWith(
      expect.objectContaining({
        groups: expect.arrayContaining([
          expect.objectContaining({
            solvent: '',
            medications: []
          })
        ])
      })
    );
  });

  test('displays individual medications section', () => {
    render(
      <SolventGroupManager
        selectedAgents={mockPremedications}
        groupedPremedications={mockGroupedPremedications}
        onGroupingChange={mockOnGroupingChange}
      />
    );

    expect(document.body).toContainHTML('Individual Medications (1)');
    expect(document.body).toContainHTML('Granisetron');
  });

  test('shows unassigned medications when present', () => {
    const partialGrouping: GroupedPremedications = {
      groups: [],
      individual: [mockPremedications[0]]
    };

    render(
      <SolventGroupManager
        selectedAgents={mockPremedications}
        groupedPremedications={partialGrouping}
        onGroupingChange={mockOnGroupingChange}
      />
    );

    expect(document.body).toContainHTML('Unassigned Medications (1)');
    expect(document.body).toContainHTML('Granisetron');
  });
});