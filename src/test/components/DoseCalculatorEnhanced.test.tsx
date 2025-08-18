import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DoseCalculatorEnhanced } from '@/components/DoseCalculatorEnhanced';
import { Regimen } from '@/types/regimens';
import * as doseCalculations from '@/utils/doseCalculations';

// Mock the translations
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

// Mock the logger
vi.mock('@/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn()
  }
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  }
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

const mockRegimen: Regimen = {
  id: 'test-regimen-001',
  name: 'Test FOLFOX',
  description: 'Test regimen for FOLFOX',
  category: 'metastatic',
  drugs: [
    {
      name: 'Oxaliplatin',
      dosage: '85',
      unit: 'mg/m²',
      route: 'IV',
      day: 'Day 1',
      drugClass: 'chemotherapy',
      availableSolvents: ['D5W'],
      availableVolumes: [250, 500],
      administrationDuration: '2 h'
    },
    {
      name: '5-Fluorouracil',
      dosage: '400',
      unit: 'mg/m²',
      route: 'IV',
      day: 'Day 1',
      drugClass: 'chemotherapy'
    }
  ],
  schedule: 'q14d',
  cycles: 12
};

describe('DoseCalculatorEnhanced', () => {
  const defaultProps = {
    regimen: mockRegimen,
    bsa: 1.8,
    weight: 70,
    height: 175,
    age: 60,
    sex: 'male',
    creatinineClearance: 90
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('Component Rendering', () => {
    it('renders without regimen', () => {
      render(<DoseCalculatorEnhanced {...defaultProps} regimen={null} />);
      expect(screen.getByText('doseCalculator.noRegimenSelected')).toBeInTheDocument();
    });

    it('renders with regimen and patient data', () => {
      render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      expect(screen.getByText('doseCalculator.title')).toBeInTheDocument();
      expect(screen.getByText('Test FOLFOX')).toBeInTheDocument();
      expect(screen.getByText('1.80 m²')).toBeInTheDocument(); // BSA
      expect(screen.getByText('70 kg')).toBeInTheDocument(); // Weight
      expect(screen.getByText('90 mL/min')).toBeInTheDocument(); // CrCl
    });

    it('displays drug calculations', () => {
      render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      expect(screen.getByText('Oxaliplatin')).toBeInTheDocument();
      expect(screen.getByText('5-Fluorouracil')).toBeInTheDocument();
      expect(screen.getByText('chemotherapy')).toBeInTheDocument();
    });
  });

  describe('Dose Calculations', () => {
    it('calculates BSA-based doses correctly', () => {
      const calculateSpy = vi.spyOn(doseCalculations, 'calculateCompleteDose');
      calculateSpy.mockReturnValue({
        calculatedDose: 153, // 85 * 1.8
        finalDose: 153,
        adjustedDose: 153,
        reductionPercentage: 0
      });

      render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      expect(calculateSpy).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Oxaliplatin' }),
        1.8, // BSA
        70,  // weight
        60,  // age
        90,  // creatinine clearance
        'q14d' // schedule
      );
    });

    it('handles dose adjustments', async () => {
      const user = userEvent.setup();
      render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      // Enter edit mode
      const editButton = screen.getByText('doseCalculator.edit');
      await user.click(editButton);
      
      // Find dose input and modify it
      const doseInputs = screen.getAllByRole('spinbutton');
      const adjustedDoseInput = doseInputs.find(input => 
        input.getAttribute('step') === '0.1'
      ) as HTMLInputElement;
      
      expect(adjustedDoseInput).toBeInTheDocument();
      
      await user.clear(adjustedDoseInput);
      await user.type(adjustedDoseInput, '120');
      
      // Verify the dose was updated
      expect(adjustedDoseInput.value).toBe('120');
    });

    it('handles percentage reduction', async () => {
      const user = userEvent.setup();
      render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      // Enter edit mode
      const editButton = screen.getByText('doseCalculator.edit');
      await user.click(editButton);
      
      // Find percentage input
      const percentageInputs = screen.getAllByRole('spinbutton');
      const percentageInput = percentageInputs.find(input => 
        input.getAttribute('step') === '1' && 
        input.getAttribute('max') === '100'
      ) as HTMLInputElement;
      
      expect(percentageInput).toBeInTheDocument();
      
      await user.clear(percentageInput);
      await user.type(percentageInput, '20');
      
      expect(percentageInput.value).toBe('20');
    });
  });

  describe('Dose Alerts and Validation', () => {
    it('displays dose limit alerts', () => {
      const mockCalculation = {
        calculatedDose: 200,
        finalDose: 200,
        adjustedDose: 200,
        reductionPercentage: 0,
        doseAlert: {
          isExceeded: true,
          warning: 'Dose exceeds maximum limit',
          suggestedAction: 'Consider dose reduction'
        }
      };

      vi.spyOn(doseCalculations, 'calculateCompleteDose').mockReturnValue(mockCalculation);
      
      render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      expect(screen.getByText('Dose exceeds maximum limit')).toBeInTheDocument();
      expect(screen.getByText('Consider dose reduction')).toBeInTheDocument();
    });

    it('displays concentration alerts', () => {
      const mockCalculation = {
        calculatedDose: 150,
        finalDose: 150,
        adjustedDose: 150,
        reductionPercentage: 0,
        concentrationAlert: 'Concentration too high for selected volume'
      };

      vi.spyOn(doseCalculations, 'calculateCompleteDose').mockReturnValue(mockCalculation);
      
      render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      expect(screen.getByText('Concentration too high for selected volume')).toBeInTheDocument();
    });
  });

  describe('Undo/Redo Functionality', () => {
    it('enables undo after making changes', async () => {
      const user = userEvent.setup();
      render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      // Initially undo should be disabled
      const undoButton = screen.getByText('Undo');
      expect(undoButton).toBeDisabled();
      
      // Enter edit mode and make a change
      const editButton = screen.getByText('doseCalculator.edit');
      await user.click(editButton);
      
      const doseInputs = screen.getAllByRole('spinbutton');
      const adjustedDoseInput = doseInputs.find(input => 
        input.getAttribute('step') === '0.1'
      ) as HTMLInputElement;
      
      await user.clear(adjustedDoseInput);
      await user.type(adjustedDoseInput, '120');
      
      // Now undo should be enabled
      await waitFor(() => {
        expect(undoButton).not.toBeDisabled();
      });
    });

    it('performs undo operation', async () => {
      const user = userEvent.setup();
      render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      // Enter edit mode and make a change
      const editButton = screen.getByText('doseCalculator.edit');
      await user.click(editButton);
      
      const doseInputs = screen.getAllByRole('spinbutton');
      const adjustedDoseInput = doseInputs.find(input => 
        input.getAttribute('step') === '0.1'
      ) as HTMLInputElement;
      
      const originalValue = adjustedDoseInput.value;
      
      await user.clear(adjustedDoseInput);
      await user.type(adjustedDoseInput, '120');
      
      // Perform undo
      const undoButton = screen.getByText('Undo');
      await user.click(undoButton);
      
      // Verify value was restored
      await waitFor(() => {
        expect(adjustedDoseInput.value).toBe(originalValue);
      });
    });
  });

  describe('Calculation History', () => {
    it('saves calculation to history', async () => {
      const user = userEvent.setup();
      render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      const saveButton = screen.getByText('Salvează');
      await user.click(saveButton);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'chemo-app-calculation-history',
        expect.stringContaining('Test FOLFOX')
      );
    });

    it('displays calculation history when available', () => {
      const mockHistory = JSON.stringify([
        {
          id: '1',
          regimenName: 'Previous FOLFOX',
          timestamp: '2024-01-01T10:00:00.000Z',
          calculations: []
        }
      ]);
      
      mockLocalStorage.getItem.mockReturnValue(mockHistory);
      
      render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      expect(screen.getByText('Istoric calcule')).toBeInTheDocument();
      expect(screen.getByText('Previous FOLFOX')).toBeInTheDocument();
    });
  });

  describe('Solvent Selection Integration', () => {
    it('renders SolventVolumeSelector for drugs with available solvents', () => {
      render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      // Should render solvent selector for Oxaliplatin which has availableSolvents
      expect(screen.getByText('Selecție solvent și volum')).toBeInTheDocument();
      expect(screen.getByText('Selectați solventul')).toBeInTheDocument();
      expect(screen.getByText('Selectați volumul')).toBeInTheDocument();
    });

    it('handles solvent type changes', async () => {
      const user = userEvent.setup();
      render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      // Enter edit mode
      const editButton = screen.getByText('doseCalculator.edit');
      await user.click(editButton);
      
      // Find and interact with solvent selector
      const solventSelect = screen.getByText('Selectați solventul');
      await user.click(solventSelect.closest('button')!);
      
      // Select D5W option
      const d5wOption = screen.getByText('Glucoză 5% (D5W)');
      await user.click(d5wOption);
      
      // Verify selection was made
      expect(screen.getByDisplayValue('D5W')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for form controls', () => {
      render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      expect(screen.getByLabelText('Undo')).toBeInTheDocument();
      expect(screen.getByLabelText('Redo')).toBeInTheDocument();
      expect(screen.getByLabelText('Salvează')).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      // Tab through interactive elements
      await user.tab();
      expect(screen.getByText('Undo')).toHaveFocus();
      
      await user.tab();
      expect(screen.getByText('Redo')).toHaveFocus();
      
      await user.tab();
      expect(screen.getByText('Salvează')).toHaveFocus();
    });
  });

  describe('Error Handling', () => {
    it('handles calculation errors gracefully', () => {
      vi.spyOn(doseCalculations, 'calculateCompleteDose').mockImplementation(() => {
        throw new Error('Calculation failed');
      });
      
      // Should not crash due to ErrorBoundary
      expect(() => {
        render(<DoseCalculatorEnhanced {...defaultProps} />);
      }).not.toThrow();
    });

    it('handles localStorage errors gracefully', async () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage full');
      });
      
      const user = userEvent.setup();
      render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      const saveButton = screen.getByText('Salvează');
      
      // Should not crash when localStorage fails
      expect(async () => {
        await user.click(saveButton);
      }).not.toThrow();
    });
  });

  describe('Performance', () => {
    it('memoizes calculations to prevent unnecessary recalculations', () => {
      const calculateSpy = vi.spyOn(doseCalculations, 'calculateCompleteDose');
      
      const { rerender } = render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      const initialCallCount = calculateSpy.mock.calls.length;
      
      // Rerender with same props
      rerender(<DoseCalculatorEnhanced {...defaultProps} />);
      
      // Should not have additional calculation calls
      expect(calculateSpy.mock.calls.length).toBe(initialCallCount);
    });
  });
});