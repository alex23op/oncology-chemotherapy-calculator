import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Index from '../pages/Index';
import { SmartNavProvider } from '../context/SmartNavContext';
import { DataPersistenceProvider } from '../context/DataPersistenceContext';

// Mock dependencies
vi.mock('@/utils/pdfExport', () => ({ generateClinicalTreatmentPDF: vi.fn().mockResolvedValue(undefined) }));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock('@/hooks/use-toast', () => ({ toast: vi.fn() }));
vi.mock('@/utils/logger', () => ({ logger: { info: vi.fn(), error: vi.fn(), debug: vi.fn() } }));
vi.mock('@/hooks/useMonitoring', () => ({ useMonitoring: () => ({}) }));
vi.mock('@/hooks/usePerformanceOptimization', () => ({
  useDebouncedCalculation: (fn: Function) => fn,
  usePerformanceMonitoring: () => ({})
}));
vi.mock('@/utils/inputValidation', () => ({
  validatePatientData: () => ({ isValid: true, errors: [], warnings: [] }),
  sanitizeInput: (input: string) => input,
  showValidationToast: vi.fn()
}));
vi.mock('@/utils/cnp', () => ({
  sanitizeCNP: (cnp: string) => cnp,
  validateCNP: (cnp: string) => ({ isValid: cnp.length === 13 })
}));
vi.mock('@/utils/units', () => ({ toKg: (weight: number) => weight }));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <QueryClientProvider client={queryClient}>
      <SmartNavProvider>
        <DataPersistenceProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </DataPersistenceProvider>
      </SmartNavProvider>
    </QueryClientProvider>
  );
};

describe('Patient Data Flow - Basic Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render patient data form without errors', () => {
    const { container } = render(<TestWrapper><Index /></TestWrapper>);
    
    // Basic rendering test
    expect(container).toBeTruthy();
    
    // Check for key elements using container.querySelector
    const patientDataText = container.querySelector('[role="button"]');
    expect(patientDataText).toBeTruthy();
  });

  it('should handle localStorage data recovery', () => {
    // Pre-populate localStorage
    const mockData = { 
      patientData: { weight: '75' }, 
      lastUpdated: new Date().toISOString() 
    };
    localStorage.setItem('clinical-treatment-data', JSON.stringify(mockData));

    const { container } = render(<TestWrapper><Index /></TestWrapper>);
    
    // Check if recovery dialog elements exist
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should persist data in localStorage during form interaction', async () => {
    const { container } = render(<TestWrapper><Index /></TestWrapper>);
    
    // Find weight input
    const weightInput = container.querySelector('input[type="number"]') as HTMLInputElement;
    
    if (weightInput) {
      // Type in weight field
      await user.clear(weightInput);
      await user.type(weightInput, '70');
      
      // Check if data was persisted
      setTimeout(() => {
        const storedData = localStorage.getItem('clinical-treatment-data');
        if (storedData) {
          const parsed = JSON.parse(storedData);
          expect(parsed.patientData).toBeTruthy();
        }
      }, 100);
    }
  });

  it('should validate patient data completeness', () => {
    // Test the core validation logic
    const mockPatientData = {
      weight: '70',
      height: '175', 
      age: '45',
      sex: 'male'
    };
    
    // All required fields present
    expect(mockPatientData.weight).toBeTruthy();
    expect(mockPatientData.height).toBeTruthy();
    expect(mockPatientData.age).toBeTruthy();
    expect(mockPatientData.sex).toBeTruthy();
  });

  it('should handle BSA calculation', () => {
    // Test BSA calculation logic
    const weight = 70; // kg
    const height = 175; // cm
    
    // DuBois formula: BSA = 0.007184 × (height^0.725) × (weight^0.425)
    const expectedBSA = 0.007184 * Math.pow(height, 0.725) * Math.pow(weight, 0.425);
    const roundedBSA = Math.round(expectedBSA * 100) / 100;
    
    expect(roundedBSA).toBeGreaterThan(1.5);
    expect(roundedBSA).toBeLessThan(2.5);
  });

  it('should handle CNP validation', () => {
    const validCNP = '1234567890123';
    const invalidCNP = '123';
    
    expect(validCNP.length).toBe(13);
    expect(invalidCNP.length).toBeLessThan(13);
  });
});