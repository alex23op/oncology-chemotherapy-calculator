import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DoseCalculator } from '../DoseCalculator';
import { breastCancerRegimens } from '@/data/regimens/breastCancer';
import { colorectalRegimens } from '@/data/regimens/colorectalCancer';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      const keys: Record<string, string> = {
        'doseCalculator.cnpLabel': 'CNP *',
        'doseCalculator.cnpPlaceholder': 'Enter CNP',
        'doseCalculator.fullNameLabel': 'Full Name',
        'doseCalculator.fullNamePlaceholder': 'Enter patient full name',
        'doseCalculator.title': 'Dose Calculations',
        'doseCalculator.emptyState': 'Select a cancer type and regimen to calculate doses.'
      };
      return keys[key] || key;
    }
  })
}));

// Mock other dependencies
vi.mock('@/utils/inputValidation', () => ({
  validatePatientData: vi.fn(() => ({ isValid: true, errors: [], warnings: [] })),
  sanitizeInput: vi.fn((input) => input),
  showValidationToast: vi.fn()
}));

vi.mock('@/utils/doseCalculation', () => ({
  calculateDoses: vi.fn(() => [])
}));

vi.mock('@/hooks/usePerformanceOptimization', () => ({
  usePerformanceMonitoring: vi.fn(() => ({}))
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('CNP Reset Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should reset CNP when switching between regimens', async () => {
    const mockPatientData = {
      weight: 70, height: 175, age: 45, sex: 'M', 
      bsa: 1.85, creatinineClearance: 90
    };

    const { rerender } = render(
      <DoseCalculator 
        regimen={breastCancerRegimens[0]}
        patientData={mockPatientData}
        onTreatmentDataReady={vi.fn()}
        supportiveCare={{
          selectedAntiemetics: [],
          selectedPremedications: [],
          emetogenicRisk: { level: 'moderate' as const, justification: '', acuteRisk: '', delayedRisk: '' }
        }}
      />
    );

    // Enter CNP for first regimen
    const cnpInput = screen.getByPlaceholderText('Enter CNP');
    fireEvent.change(cnpInput, { target: { value: '1234567890123' } });
    expect(cnpInput.getAttribute('value')).toBe('1234567890123');

    // Switch to different regimen
    rerender(
      <DoseCalculator 
        regimen={colorectalRegimens[0]}
        patientData={mockPatientData}
        onTreatmentDataReady={vi.fn()}
        supportiveCare={{
          selectedAntiemetics: [],
          selectedPremedications: [],
          emetogenicRisk: { level: 'moderate' as const, justification: '', acuteRisk: '', delayedRisk: '' }
        }}
      />
    );

    // CNP should be reset
    await waitFor(() => {
      const resetCnpInput = screen.getByPlaceholderText('Enter CNP');
      expect(resetCnpInput.getAttribute('value')).toBe('');
    });
  });

  it('should not persist CNP in localStorage', async () => {
    const mockPatientData = {
      weight: 70, height: 175, age: 45, sex: 'M', 
      bsa: 1.85, creatinineClearance: 90
    };

    render(
      <DoseCalculator 
        regimen={breastCancerRegimens[0]}
        patientData={mockPatientData}
        onTreatmentDataReady={vi.fn()}
        supportiveCare={{
          selectedAntiemetics: [],
          selectedPremedications: [],
          emetogenicRisk: { level: 'moderate' as const, justification: '', acuteRisk: '', delayedRisk: '' }
        }}
      />
    );

    // Enter CNP and other data
    const cnpInput = screen.getByPlaceholderName('Enter CNP');
    const nameInput = screen.getByPlaceholderText('Enter patient full name');
    
    fireEvent.change(cnpInput, { target: { value: '1234567890123' } });
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });

    // Wait for autosave
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    // Check that CNP is not included in saved data
    const savedData = localStorageMock.setItem.mock.calls.find(call => 
      call[0].includes('draft:doseCalc:')
    );
    
    if (savedData) {
      const parsedData = JSON.parse(savedData[1]);
      expect(parsedData.cnp).toBeUndefined();
      expect(parsedData.fullName).toBe('John Doe'); // Other fields should be saved
    }
  });
});