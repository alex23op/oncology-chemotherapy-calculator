import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnifiedProtocolSelector } from './UnifiedProtocolSelector';

// Mock i18next with proper translations
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ 
    t: (key: string, params?: any) => {
      const translations: Record<string, string> = {
        'unifiedSelector.tabs.solvents': 'Solvents',
        'unifiedSelector.noAgentsForSolvents': 'No agents selected. Please select agents from the recommendations or categories tabs first.',
        'unifiedSelector.selectSolventDesc': 'Select a solvent for each premedication agent.',
        'unifiedSelector.solvent': 'Solvent',
        'doseCalculator.selectSolvent': 'Select solvent',
        'doseCalculator.solvents.normalSaline': 'Normal Saline 0.9%',
        'doseCalculator.solvents.dextrose5': 'Dextrose 5%',
        'doseCalculator.solvents.ringer': 'Ringer Solution',
        'doseCalculator.solvents.waterForInjection': 'Water for injection',
        'premedSelector.clearAll': 'Clear All'
      };
      
      if (translations[key]) return translations[key];
      if (params) return `${key}_${JSON.stringify(params)}`;
      return key;
    }
  })
}));

const mockProps = {
  drugNames: ['Cisplatin', 'Doxorubicin'],
  drugs: [],
  emetogenicRiskLevel: 'high' as const,
  selectedPremedications: [],
  selectedAntiemetics: [],
  onPremedSelectionsChange: vi.fn(),
  onAntiemeticProtocolChange: vi.fn(),
  weight: 70
};

describe('UnifiedProtocolSelector - Solvent Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays solvents tab', () => {
    const { getByRole } = render(<UnifiedProtocolSelector {...mockProps} />);
    expect(getByRole('tab', { name: /solvents/i })).toBeInTheDocument();
  });

  it('shows empty state when no agents selected for solvents', async () => {
    const user = userEvent.setup();
    const { getByRole, getByText } = render(<UnifiedProtocolSelector {...mockProps} />);
    
    // Click on solvents tab
    await user.click(getByRole('tab', { name: /solvents/i }));
    
    expect(getByText('No agents selected. Please select agents from the recommendations or categories tabs first.')).toBeInTheDocument();
  });

  it('allows selecting agents and then solvents', async () => {
    const user = userEvent.setup();
    const { getByRole, getByText, getAllByRole } = render(<UnifiedProtocolSelector {...mockProps} />);
    
    // First, select an agent from recommendations
    const ondansetronCheckbox = getAllByRole('checkbox')[0];
    await user.click(ondansetronCheckbox);
    
    // Switch to solvents tab
    await user.click(getByRole('tab', { name: /solvents/i }));
    
    // Should show the selected agent in solvents tab
    expect(getByText('Ondansetron')).toBeInTheDocument();
    
    // Select a solvent
    const solventSelect = getByRole('combobox');
    await user.click(solventSelect);
    
    const normalSalineOption = getByRole('option', { name: /normal saline/i });
    await user.click(normalSalineOption);
    
    expect(mockProps.onAntiemeticProtocolChange).toHaveBeenCalled();
  });

  it('updates agent with selected solvent', async () => {
    const user = userEvent.setup();
    const onAntiemeticProtocolChange = vi.fn();
    const { getByRole, getAllByRole } = render(
      <UnifiedProtocolSelector 
        {...mockProps} 
        onAntiemeticProtocolChange={onAntiemeticProtocolChange}
      />
    );
    
    // Select an agent
    const ondansetronCheckbox = getAllByRole('checkbox')[0];
    await user.click(ondansetronCheckbox);
    
    // Switch to solvents tab and select solvent
    await user.click(getByRole('tab', { name: /solvents/i }));
    
    const solventSelect = getByRole('combobox');
    await user.click(solventSelect);
    await user.click(getByRole('option', { name: /normal saline/i }));
    
    // Check that the last call includes the solvent
    const lastCall = onAntiemeticProtocolChange.mock.calls[onAntiemeticProtocolChange.mock.calls.length - 1];
    expect(lastCall[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Ondansetron',
          solvent: 'Normal Saline 0.9%'
        })
      ])
    );
  });

  it('clears solvent selections when clearing all selections', async () => {
    const user = userEvent.setup();
    const { getByRole, getByText, getAllByRole } = render(<UnifiedProtocolSelector {...mockProps} />);
    
    // Select an agent and solvent
    const ondansetronCheckbox = getAllByRole('checkbox')[0];
    await user.click(ondansetronCheckbox);
    
    await user.click(getByRole('tab', { name: /solvents/i }));
    
    const solventSelect = getByRole('combobox');
    await user.click(solventSelect);
    await user.click(getByRole('option', { name: /normal saline/i }));
    
    // Clear all selections
    const clearButton = getByRole('button', { name: /clear all/i });
    await user.click(clearButton);
    
    // Should go back to empty state in solvents
    expect(getByText('No agents selected. Please select agents from the recommendations or categories tabs first.')).toBeInTheDocument();
  });
});