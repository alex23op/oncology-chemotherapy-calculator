import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Index from '../pages/Index';
import { SmartNavProvider } from '../context/SmartNavContext';
import { DataPersistenceProvider } from '../context/DataPersistenceContext';

// Mock PDF export before other imports
const mockGeneratePDF = vi.fn().mockResolvedValue(undefined);
vi.mock('@/utils/pdfExport', () => ({
  generateClinicalTreatmentPDF: mockGeneratePDF
}));

// Comprehensive mocks for all dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      const translations: Record<string, string> = {
        'wizard.steps.patient': 'Patient data',
        'wizard.steps.regimen': 'Regimen selection', 
        'wizard.steps.support': 'Supportive care',
        'wizard.steps.doses': 'Dose calculation',
        'wizard.steps.review': 'Review & Print',
        'patientForm.title': 'Patient Information',
        'patientForm.weight': 'Weight',
        'patientForm.height': 'Height',
        'patientForm.age': 'Age',
        'patientForm.sex': 'Sex',
        'patientForm.creatinine': 'Creatinine',
        'patientForm.male': 'Male',
        'patientForm.female': 'Female',
        'doseCalculator.fullNameLabel': 'Nume și prenume',
        'doseCalculator.cnpLabel': 'CNP',
        'doseCalculator.foNumberLabel': 'Număr F.O.',
        'doseCalculator.cycleLabel': 'Număr ciclu',
        'doseCalculator.treatmentDateLabel': 'Data administrării',
        'doseCalculator.nextCycleDateLabel': 'Data următorului ciclu',
        'doseCalculator.exportPdf': 'Export PDF',
        'doseCalculator.print': 'Print',
        'index.toasts.patientDataRequired.title': 'Date pacient necesare',
        'index.toasts.patientDataRequired.description': 'Introduceți mai întâi informațiile pacientului pentru a calcula dozele',
        'index.toasts.regimenSelected.title': 'Regim selectat',
        'index.toasts.regimenSelected.description': 'Regimul {name} a fost selectat',
        'errors.patientFormFailed': 'Patient form failed to load',
        'errors.cancerSelectorFailed': 'Cancer selector failed to load',
        'errors.doseCalculatorFailed': 'Dose calculator failed to load',
        'errors.reviewFailed': 'Review failed to load',
        'doseCalculator.emptyState': 'Selectați un tip de cancer și un regim pentru a calcula dozele.',
        'doseCalculator.noRegimenSelected': 'Nu a fost selectat niciun regim'
      };
      return options?.name ? translations[key]?.replace('{name}', options.name) : translations[key] || key;
    },
    i18n: { changeLanguage: vi.fn() }
  })
}));

vi.mock('@/utils/dateFormat', () => ({
  formatDate: (date: string) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('ro-RO');
    } catch {
      return date;
    }
  }
}));

vi.mock('@/utils/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn()
  }
}));

const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  toast: mockToast,
  useToast: () => ({ toast: mockToast })
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  }
}));

vi.mock('@/hooks/useMonitoring', () => ({
  useMonitoring: () => ({})
}));

vi.mock('@/hooks/usePerformanceOptimization', () => ({
  useDebouncedCalculation: (fn: Function, delay: number, deps: any[]) => fn,
  usePerformanceMonitoring: () => ({})
}));

vi.mock('@/utils/inputValidation', () => ({
  validatePatientData: () => ({ isValid: true, errors: [], warnings: [] }),
  sanitizeInput: (input: string) => input,
  showValidationToast: vi.fn()
}));

vi.mock('@/utils/cnp', () => ({
  sanitizeCNP: (cnp: string) => cnp,
  validateCNP: (cnp: string) => ({ 
    isValid: cnp.length === 13 && /^\d{13}$/.test(cnp)
  })
}));

vi.mock('@/utils/units', () => ({
  toKg: (weight: number, unit: string) => unit === 'lbs' ? weight * 0.453592 : weight
}));

// Mock all the cancer type data
vi.mock('@/data/cancerTypes', () => ({
  cancerTypes: [
    {
      id: 'breast',
      name: 'Breast Cancer',
      regimens: [
        {
          id: 'ac-t',
          name: 'AC-T',
          description: 'Adriamycin, Cyclophosphamide followed by Taxol',
          category: 'adjuvant',
          drugs: [
            {
              name: 'Doxorubicin',
              dosage: '60',
              unit: 'mg/m²',
              route: 'IV',
              day: 'Day 1',
              schedule: 'Q3W',
              administrationDuration: '15-30 min'
            }
          ],
          schedule: 'Q3W',
          cycles: 8
        }
      ]
    }
  ]
}));

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <SmartNavProvider>
        <DataPersistenceProvider>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </DataPersistenceProvider>
      </SmartNavProvider>
    </QueryClientProvider>
  );
};

describe('Patient Data Flow - Critical Path Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('SCENARIO 1: Complete patient data allows progression without errors', async () => {
    render(<TestWrapper><Index /></TestWrapper>);

    // Step 1: Fill complete patient data
    await waitFor(() => {
      expect(screen.getByText('Patient data')).toBeInTheDocument();
    });

    // Fill weight
    const weightInput = screen.getByRole('spinbutton', { name: /weight/i });
    await user.clear(weightInput);
    await user.type(weightInput, '70');

    // Fill height
    const heightInput = screen.getByRole('spinbutton', { name: /height/i });
    await user.clear(heightInput);
    await user.type(heightInput, '175');

    // Fill age
    const ageInput = screen.getByRole('spinbutton', { name: /age/i });
    await user.clear(ageInput);
    await user.type(ageInput, '45');

    // Select sex
    const sexSelect = screen.getByRole('combobox', { name: /sex/i });
    await user.click(sexSelect);
    await waitFor(() => {
      const maleOption = screen.getByText('Male');
      expect(maleOption).toBeInTheDocument();
    });
    await user.click(screen.getByText('Male'));

    // Fill creatinine
    const creatinineInput = screen.getByRole('spinbutton', { name: /creatinine/i });
    await user.clear(creatinineInput);
    await user.type(creatinineInput, '1.0');

    // Wait for BSA calculation
    await waitFor(() => {
      expect(screen.getByText(/BSA/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Step 2: Navigate to regimen selection
    const regimenTab = screen.getByRole('button', { name: /regimen selection/i });
    await user.click(regimenTab);

    await waitFor(() => {
      expect(screen.getByText('Regimen selection')).toBeInTheDocument();
    });

    // Step 3: Verify NO error message appears
    expect(screen.queryByText(/date pacient necesare/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/introduceți mai întâi informațiile pacientului/i)).not.toBeInTheDocument();
    
    // Verify toast was not called with error
    expect(mockToast).not.toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Date pacient necesare',
        variant: 'destructive'
      })
    );
  });

  it('SCENARIO 2: Incomplete patient data shows error when attempting regimen selection', async () => {
    render(<TestWrapper><Index /></TestWrapper>);

    // Step 1: Fill incomplete patient data (missing required fields)
    await waitFor(() => {
      expect(screen.getByText('Patient data')).toBeInTheDocument();
    });

    // Only fill weight (missing height, age, sex)
    const weightInput = screen.getByRole('spinbutton', { name: /weight/i });
    await user.clear(weightInput);
    await user.type(weightInput, '70');

    // Step 2: Navigate to regimen selection
    const regimenTab = screen.getByRole('button', { name: /regimen selection/i });
    await user.click(regimenTab);

    // Step 3: Navigate to dose calculation to trigger validation
    const doseTab = screen.getByRole('button', { name: /dose calculation/i });
    await user.click(doseTab);

    await waitFor(() => {
      expect(screen.getByText('Dose calculation')).toBeInTheDocument();
    });

    // The form should show empty state because patient data is incomplete
    expect(screen.getByText(/nu a fost selectat niciun regim/i)).toBeInTheDocument();
  });

  it('SCENARIO 3: Complete flow with data persistence and reset after PDF generation', async () => {
    render(<TestWrapper><Index /></TestWrapper>);

    // Step 1: Complete patient data
    await waitFor(() => {
      expect(screen.getByText('Patient data')).toBeInTheDocument();
    });

    // Fill all patient fields
    const weightInput = screen.getByRole('spinbutton', { name: /weight/i });
    await user.clear(weightInput);
    await user.type(weightInput, '70');

    const heightInput = screen.getByRole('spinbutton', { name: /height/i });
    await user.clear(heightInput);
    await user.type(heightInput, '175');

    const ageInput = screen.getByRole('spinbutton', { name: /age/i });
    await user.clear(ageInput);
    await user.type(ageInput, '45');

    const sexSelect = screen.getByRole('combobox', { name: /sex/i });
    await user.click(sexSelect);
    await user.click(screen.getByText('Male'));

    const creatinineInput = screen.getByRole('spinbutton', { name: /creatinine/i });
    await user.clear(creatinineInput);
    await user.type(creatinineInput, '1.0');

    // Wait for calculations
    await waitFor(() => {
      expect(screen.getByText(/BSA/i)).toBeInTheDocument();
    });

    // Step 2: Navigate to dose calculation
    const doseTab = screen.getByRole('button', { name: /dose calculation/i });
    await user.click(doseTab);

    await waitFor(() => {
      expect(screen.getByText('Dose calculation')).toBeInTheDocument();
    });

    // Fill dose calculator form (mock regimen exists)
    const nameInput = screen.getByRole('textbox', { name: /nume și prenume/i });
    await user.clear(nameInput);
    await user.type(nameInput, 'Ion Popescu');

    const cnpInput = screen.getByRole('textbox', { name: /cnp/i });
    await user.clear(cnpInput);
    await user.type(cnpInput, '1234567890123');

    const foInput = screen.getByRole('textbox', { name: /număr f\.o\./i });
    await user.clear(foInput);
    await user.type(foInput, 'FO123456');

    const cycleInput = screen.getByRole('spinbutton', { name: /număr ciclu/i });
    await user.clear(cycleInput);
    await user.type(cycleInput, '1');

    // Step 3: Generate treatment sheet
    const generateButton = screen.getByRole('button', { name: /generează fișa tratament/i });
    
    // Button should be enabled with complete data
    expect(generateButton).not.toBeDisabled();
    
    await user.click(generateButton);

    // Should navigate to review section
    await waitFor(() => {
      expect(screen.getByText('Review & Print')).toBeInTheDocument();
    });

    // Step 4: Verify patient data appears in review
    await waitFor(() => {
      expect(screen.getByText('Ion Popescu')).toBeInTheDocument();
      expect(screen.getByText('1234567890123')).toBeInTheDocument();
    });

    // Step 5: Test PDF generation and reset
    const pdfButton = screen.getByRole('button', { name: /export pdf/i });
    await user.click(pdfButton);

    // Verify PDF was generated
    await waitFor(() => {
      expect(mockGeneratePDF).toHaveBeenCalled();
    });

    // After PDF generation, should reset to patient step
    await waitFor(() => {
      expect(screen.getByText('Patient data')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('SCENARIO 4: BSA cap functionality works correctly', async () => {
    render(<TestWrapper><Index /></TestWrapper>);

    // Fill patient with high BSA values
    await waitFor(() => {
      expect(screen.getByText('Patient data')).toBeInTheDocument();
    });

    const weightInput = screen.getByRole('spinbutton', { name: /weight/i });
    await user.clear(weightInput);
    await user.type(weightInput, '100'); // High weight for BSA > 2.0

    const heightInput = screen.getByRole('spinbutton', { name: /height/i });
    await user.clear(heightInput);
    await user.type(heightInput, '190');

    const ageInput = screen.getByRole('spinbutton', { name: /age/i });
    await user.clear(ageInput);
    await user.type(ageInput, '45');

    const sexSelect = screen.getByRole('combobox', { name: /sex/i });
    await user.click(sexSelect);
    await user.click(screen.getByText('Male'));

    // Navigate to dose calculation
    const doseTab = screen.getByRole('button', { name: /dose calculation/i });
    await user.click(doseTab);

    await waitFor(() => {
      expect(screen.getByText('Dose calculation')).toBeInTheDocument();
    });

    // Find and test BSA cap checkbox
    const bsaCapCheckbox = screen.getByRole('checkbox', { name: /aplică prag bsa 2\.0 m²/i });
    expect(bsaCapCheckbox).toBeInTheDocument();

    // Check BSA cap
    await user.click(bsaCapCheckbox);

    // Verify BSA is capped to 2.0
    await waitFor(() => {
      expect(screen.getByText(/BSA folosită: 2\.00 m²/i)).toBeInTheDocument();
    });
  });

  it('SCENARIO 5: Data persistence and recovery dialog', async () => {
    // Pre-populate localStorage with patient data
    const mockPersistedData = {
      patientData: {
        weight: '75',
        height: '180',
        age: '50',
        sex: 'female',
        creatinine: '0.9'
      },
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem('clinical-treatment-data', JSON.stringify(mockPersistedData));

    render(<TestWrapper><Index /></TestWrapper>);

    // Should show recovery dialog
    await waitFor(() => {
      expect(screen.getByText(/date nesalvate detectate/i)).toBeInTheDocument();
    });

    // Choose to restore data
    const restoreButton = screen.getByRole('button', { name: /reia datele/i });
    await user.click(restoreButton);

    // Verify data is restored in form
    await waitFor(() => {
      const weightInput = screen.getByDisplayValue('75') as HTMLInputElement;
      expect(weightInput).toBeInTheDocument();
      expect(weightInput.value).toBe('75');
    });
  });

  it('SCENARIO 6: Form validation prevents invalid submissions', async () => {
    render(<TestWrapper><Index /></TestWrapper>);

    // Navigate to dose calculation
    const doseTab = screen.getByRole('button', { name: /dose calculation/i });
    await user.click(doseTab);

    await waitFor(() => {
      expect(screen.getByText('Dose calculation')).toBeInTheDocument();
    });

    // Try to fill invalid CNP
    const cnpInput = screen.getByRole('textbox', { name: /cnp/i });
    await user.clear(cnpInput);
    await user.type(cnpInput, '123'); // Invalid CNP (too short)

    // Generate button should be disabled with invalid data
    const generateButton = screen.getByRole('button', { name: /generează fișa tratament/i });
    expect(generateButton).toBeDisabled();

    // Fill valid CNP
    await user.clear(cnpInput);
    await user.type(cnpInput, '1234567890123');

    // Fill required name
    const nameInput = screen.getByRole('textbox', { name: /nume și prenume/i });
    await user.clear(nameInput);
    await user.type(nameInput, 'Test Patient');

    // Button should still be disabled without regimen selection
    expect(generateButton).toBeDisabled();
  });
});