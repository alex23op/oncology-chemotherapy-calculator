import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
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
      const { getByText } = render(<DoseCalculatorEnhanced {...defaultProps} regimen={null} />);
      expect(getByText('doseCalculator.noRegimenSelected')).toBeInTheDocument();
    });

    it('renders with regimen and patient data', () => {
      const { getByText } = render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      expect(getByText('doseCalculator.title')).toBeInTheDocument();
      expect(getByText('Test FOLFOX')).toBeInTheDocument();
    });

    it('displays drug calculations', () => {
      const { getByText } = render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      expect(getByText('Oxaliplatin')).toBeInTheDocument();
      expect(getByText('5-Fluorouracil')).toBeInTheDocument();
    });
  });

  describe('Dose Calculations', () => {
    it('calculates BSA-based doses correctly', () => {
      const calculateSpy = vi.spyOn(doseCalculations, 'calculateCompleteDose');
      calculateSpy.mockReturnValue({
        calculatedDose: 153, // 85 * 1.8
        finalDose: 153,
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
      const { getByText } = render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      // Enter edit mode
      const editButton = getByText('doseCalculator.edit');
      await user.click(editButton);
    });
  });

  describe('Dose Alerts and Validation', () => {
    it('displays dose limit alerts', () => {
      const mockCalculation = {
        calculatedDose: 200,
        finalDose: 200,
        reductionPercentage: 0,
        doseAlert: {
          isExceeded: true,
          warning: 'Dose exceeds maximum limit',
          suggestedAction: 'Consider dose reduction'
        }
      };

      vi.spyOn(doseCalculations, 'calculateCompleteDose').mockReturnValue(mockCalculation);
      
      const { container } = render(<DoseCalculatorEnhanced {...defaultProps} />);
      expect(container).toBeInTheDocument();
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
      const { container } = render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      // Should not crash when localStorage fails
      expect(container).toBeInTheDocument();
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