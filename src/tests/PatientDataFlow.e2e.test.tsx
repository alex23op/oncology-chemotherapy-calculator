import { render } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Index from '../pages/Index';
import { SmartNavProvider } from '../context/SmartNavContext';
import { DataPersistenceProvider } from '../context/DataPersistenceContext';

// Minimal mocks for E2E testing
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      // Essential translations for testing
      const translations: Record<string, string> = {
        'wizard.steps.patient': 'Patient data',
        'wizard.steps.regimen': 'Regimen selection',
        'wizard.steps.doses': 'Dose calculation',
        'wizard.steps.review': 'Review & Print',
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
        'index.toasts.patientDataRequired.title': 'Date pacient necesare',
        'index.toasts.patientDataRequired.description': 'Introduceți mai întâi informațiile pacientului pentru a calcula dozele',
        'doseCalculator.emptyState': 'Selectați un tip de cancer și un regim pentru a calcula dozele.',
        'doseCalculator.noRegimenSelected': 'Nu a fost selectat niciun regim'
      };
      return options?.name ? translations[key]?.replace('{name}', options.name) : translations[key] || key;
    }
  })
}));

// Mock essential utilities
vi.mock('@/utils/logger', () => ({ logger: { info: vi.fn(), error: vi.fn(), debug: vi.fn() } }));
vi.mock('@/utils/dateFormat', () => ({ formatDate: (date: string) => date || 'N/A' }));
vi.mock('@/utils/pdfExport', () => ({ generateClinicalTreatmentPDF: vi.fn().mockResolvedValue(undefined) }));
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
vi.mock('@/utils/units', () => ({
  toKg: (weight: number, unit: string) => unit === 'lbs' ? weight * 0.453592 : weight
}));

const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({ toast: mockToast }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

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

describe('Patient Data Flow - End-to-End Critical Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('✅ SCENARIO 1: Complete patient data → No error on regimen selection', async () => {
    render(<TestWrapper><Index /></TestWrapper>);

    // Fill complete patient data
    await waitFor(() => expect(screen.getByText('Patient data')).toBeInTheDocument());

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

    // Wait for BSA calculation
    await waitFor(() => expect(screen.getByText(/BSA/i)).toBeInTheDocument(), { timeout: 3000 });

    // Navigate to regimen selection
    const regimenTab = screen.getByRole('button', { name: /regimen selection/i });
    await user.click(regimenTab);

    await waitFor(() => expect(screen.getByText('Regimen selection')).toBeInTheDocument());

    // ✅ NO error message should appear
    expect(screen.queryByText(/date pacient necesare/i)).not.toBeInTheDocument();
    expect(mockToast).not.toHaveBeenCalledWith(expect.objectContaining({
      title: 'Date pacient necesare',
      variant: 'destructive'
    }));
  });

  it('❌ SCENARIO 2: Incomplete patient data → Error appears', async () => {
    render(<TestWrapper><Index /></TestWrapper>);

    await waitFor(() => expect(screen.getByText('Patient data')).toBeInTheDocument());

    // Fill only weight (incomplete)
    const weightInput = screen.getByRole('spinbutton', { name: /weight/i });
    await user.clear(weightInput);
    await user.type(weightInput, '70');

    // Navigate to dose calculation (where validation occurs)
    const doseTab = screen.getByRole('button', { name: /dose calculation/i });
    await user.click(doseTab);

    await waitFor(() => expect(screen.getByText('Dose calculation')).toBeInTheDocument());

    // ✅ Should show empty state due to incomplete data
    expect(screen.getByText(/nu a fost selectat niciun regim/i)).toBeInTheDocument();
  });

  it('🔄 SCENARIO 3: Complete flow with data reset after PDF generation', async () => {
    const mockPDF = vi.fn().mockResolvedValue(undefined);
    vi.doMock('@/utils/pdfExport', () => ({ generateClinicalTreatmentPDF: mockPDF }));

    render(<TestWrapper><Index /></TestWrapper>);

    // Complete patient data
    await waitFor(() => expect(screen.getByText('Patient data')).toBeInTheDocument());

    // Fill patient form
    const inputs = {
      weight: screen.getByRole('spinbutton', { name: /weight/i }),
      height: screen.getByRole('spinbutton', { name: /height/i }),
      age: screen.getByRole('spinbutton', { name: /age/i }),
      creatinine: screen.getByRole('spinbutton', { name: /creatinine/i })
    };

    await user.clear(inputs.weight);
    await user.type(inputs.weight, '70');
    await user.clear(inputs.height);
    await user.type(inputs.height, '175');
    await user.clear(inputs.age);
    await user.type(inputs.age, '45');

    const sexSelect = screen.getByRole('combobox', { name: /sex/i });
    await user.click(sexSelect);
    await user.click(screen.getByText('Male'));

    await user.clear(inputs.creatinine);
    await user.type(inputs.creatinine, '1.0');

    // Wait for calculations
    await waitFor(() => expect(screen.getByText(/BSA/i)).toBeInTheDocument());

    // Navigate to dose calculation
    const doseTab = screen.getByRole('button', { name: /dose calculation/i });
    await user.click(doseTab);

    await waitFor(() => expect(screen.getByText('Dose calculation')).toBeInTheDocument());

    // Fill dose calculator form
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

    // Generate treatment sheet
    const generateButton = screen.getByRole('button', { name: /generează fișa tratament/i });
    expect(generateButton).not.toBeDisabled();
    await user.click(generateButton);

    // Should navigate to review
    await waitFor(() => expect(screen.getByText('Review & Print')).toBeInTheDocument());

    // ✅ Patient data should appear in review
    await waitFor(() => {
      expect(screen.getByText('Ion Popescu')).toBeInTheDocument();
      expect(screen.getByText('1234567890123')).toBeInTheDocument();
    });

    // Test PDF generation
    const pdfButton = screen.getByRole('button', { name: /export pdf/i });
    await user.click(pdfButton);

    // ✅ Should reset to patient step after PDF generation
    await waitFor(() => {
      expect(screen.getByText('Patient data')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('⚙️ SCENARIO 4: BSA cap functionality', async () => {
    render(<TestWrapper><Index /></TestWrapper>);

    await waitFor(() => expect(screen.getByText('Patient data')).toBeInTheDocument());

    // Fill high BSA values
    const weightInput = screen.getByRole('spinbutton', { name: /weight/i });
    await user.clear(weightInput);
    await user.type(weightInput, '100');

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

    await waitFor(() => expect(screen.getByText('Dose calculation')).toBeInTheDocument());

    // ✅ BSA cap checkbox should work
    const bsaCapCheckbox = screen.getByRole('checkbox', { name: /aplică prag bsa 2\.0 m²/i });
    expect(bsaCapCheckbox).toBeInTheDocument();

    await user.click(bsaCapCheckbox);
    await waitFor(() => {
      expect(screen.getByText(/BSA folosită: 2\.00 m²/i)).toBeInTheDocument();
    });
  });

  it('💾 SCENARIO 5: Data persistence and recovery', async () => {
    // Pre-populate localStorage
    const mockData = {
      patientData: {
        weight: '75',
        height: '180',
        age: '50',
        sex: 'female',
        creatinine: '0.9'
      },
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem('clinical-treatment-data', JSON.stringify(mockData));

    render(<TestWrapper><Index /></TestWrapper>);

    // ✅ Should show recovery dialog
    await waitFor(() => {
      expect(screen.getByText(/date nesalvate detectate/i)).toBeInTheDocument();
    });

    // Restore data
    const restoreButton = screen.getByRole('button', { name: /reia datele/i });
    await user.click(restoreButton);

    // ✅ Data should be restored
    await waitFor(() => {
      const weightInput = screen.getByDisplayValue('75') as HTMLInputElement;
      expect(weightInput).toBeInTheDocument();
      expect(weightInput.value).toBe('75');
    });
  });

  it('🔒 SCENARIO 6: Form validation prevents invalid submissions', async () => {
    render(<TestWrapper><Index /></TestWrapper>);

    // Navigate to dose calculation
    const doseTab = screen.getByRole('button', { name: /dose calculation/i });
    await user.click(doseTab);

    await waitFor(() => expect(screen.getByText('Dose calculation')).toBeInTheDocument());

    // Fill invalid CNP
    const cnpInput = screen.getByRole('textbox', { name: /cnp/i });
    await user.clear(cnpInput);
    await user.type(cnpInput, '123'); // Too short

    // ✅ Generate button should be disabled
    const generateButton = screen.getByRole('button', { name: /generează fișa tratament/i });
    expect(generateButton).toBeDisabled();

    // Fill valid data
    await user.clear(cnpInput);
    await user.type(cnpInput, '1234567890123');

    const nameInput = screen.getByRole('textbox', { name: /nume și prenume/i });
    await user.clear(nameInput);
    await user.type(nameInput, 'Test Patient');

    // Button should still be disabled without complete patient data
    expect(generateButton).toBeDisabled();
  });
});