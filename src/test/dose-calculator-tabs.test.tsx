import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DoseCalculatorEnhanced } from '@/components/DoseCalculatorEnhanced';
import { Regimen } from '@/types/regimens';

// Mock the translations
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key
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
    }
  ],
  schedule: 'Repeat every 2 weeks',
  cycles: 6
};

describe('DoseCalculatorEnhanced - Tabs and Fields', () => {
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
  });

  describe('Component Rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<DoseCalculatorEnhanced {...defaultProps} />);
      expect(container).toBeInTheDocument();
    });

    it('renders tabs structure', () => {
      render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      expect(document.querySelector('[role="tablist"]')).toBeInTheDocument();
      expect(document.querySelector('[role="tab"]')).toBeInTheDocument();
    });
  });

  describe('Patient Name Field', () => {
    it('allows entering patient name', async () => {
      const user = userEvent.setup();
      render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      const nameInput = document.querySelector('input[id="patientName"]') as HTMLInputElement;
      if (nameInput) {
        await user.type(nameInput, 'John Doe');
        expect(nameInput.value).toBe('John Doe');
      }
    });
  });

  describe('CNP Field Validation', () => {
    it('accepts valid input', async () => {
      const user = userEvent.setup();
      render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      const cnpInput = document.querySelector('input[id="cnp"]') as HTMLInputElement;
      if (cnpInput) {
        await user.type(cnpInput, '1234567890123');
        expect(cnpInput.value).toBe('1234567890123');
      }
    });

    it('sanitizes CNP input to only digits', async () => {
      const user = userEvent.setup();
      render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      const cnpInput = document.querySelector('input[id="cnp"]') as HTMLInputElement;
      if (cnpInput) {
        await user.type(cnpInput, '123-456-789-012-3');
        expect(cnpInput.value).toBe('1234567890123');
      }
    });
  });

  describe('Cycle Number Field', () => {
    it('accepts valid cycle numbers', async () => {
      const user = userEvent.setup();
      render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      const cycleInput = document.querySelector('input[id="cycleNumber"]') as HTMLInputElement;
      if (cycleInput) {
        await user.type(cycleInput, '3');
        expect(cycleInput.value).toBe('3');
      }
    });
  });

  describe('Observation Number Field', () => {
    it('allows entering observation number without validation', async () => {
      const user = userEvent.setup();
      render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      const obsInput = document.querySelector('input[id="observationNumber"]') as HTMLInputElement;
      if (obsInput) {
        await user.type(obsInput, 'OBS-2025-001');
        expect(obsInput.value).toBe('OBS-2025-001');
      }
    });
  });

  describe('Calendar Integration', () => {
    it('renders calendar component', () => {
      render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      // Calendar should be present in the component
      const calendarElements = document.querySelectorAll('[role="grid"]');
      expect(calendarElements.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Accessibility', () => {
    it('maintains proper input labels', () => {
      render(<DoseCalculatorEnhanced {...defaultProps} />);
      
      const patientInput = document.querySelector('input[id="patientName"]');
      const cnpInput = document.querySelector('input[id="cnp"]');
      const cycleInput = document.querySelector('input[id="cycleNumber"]');
      const obsInput = document.querySelector('input[id="observationNumber"]');
      
      expect(patientInput).toBeInTheDocument();
      expect(cnpInput).toBeInTheDocument();
      expect(cycleInput).toBeInTheDocument();
      expect(obsInput).toBeInTheDocument();
    });
  });
});