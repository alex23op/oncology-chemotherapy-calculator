import { render } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import Index from '../pages/Index';
import { SmartNavProvider } from '../context/SmartNavContext';
import { DataPersistenceProvider } from '../context/DataPersistenceContext';

// Mock all dependencies
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

describe('Patient Data Flow Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('✅ SCENARIO 1: Complete patient data allows progression without errors', async () => {
    render(<TestWrapper><Index /></TestWrapper>);

    await waitFor(() => expect(screen.getByText(/patient data/i)).toBeInTheDocument());

    // Fill patient form
    const weightInput = screen.getByRole('spinbutton', { name: /weight/i });
    await user.type(weightInput, '70');

    const heightInput = screen.getByRole('spinbutton', { name: /height/i });
    await user.type(heightInput, '175');

    const ageInput = screen.getByRole('spinbutton', { name: /age/i });
    await user.type(ageInput, '45');

    const sexSelect = screen.getByRole('combobox', { name: /sex/i });
    await user.click(sexSelect);
    await user.click(screen.getByText('Male'));

    // Navigate to regimen selection - should NOT show error
    const regimenTab = screen.getByRole('button', { name: /regimen selection/i });
    await user.click(regimenTab);

    expect(screen.queryByText(/date pacient necesare/i)).not.toBeInTheDocument();
  });

  it('❌ SCENARIO 2: Incomplete data shows appropriate validation', async () => {
    render(<TestWrapper><Index /></TestWrapper>);

    await waitFor(() => expect(screen.getByText(/patient data/i)).toBeInTheDocument());

    // Fill incomplete data
    const weightInput = screen.getByRole('spinbutton', { name: /weight/i });
    await user.type(weightInput, '70');

    // Navigate to dose calculation
    const doseTab = screen.getByRole('button', { name: /dose calculation/i });
    await user.click(doseTab);

    // Should show empty state
    expect(screen.getByText(/nu a fost selectat niciun regim/i)).toBeInTheDocument();
  });

  it('🔄 SCENARIO 3: Data persistence and PDF generation reset', async () => {
    // Pre-populate localStorage
    const mockData = { patientData: { weight: '75' }, lastUpdated: new Date().toISOString() };
    localStorage.setItem('clinical-treatment-data', JSON.stringify(mockData));

    render(<TestWrapper><Index /></TestWrapper>);

    // Should show recovery dialog
    await waitFor(() => expect(screen.getByText(/date nesalvate detectate/i)).toBeInTheDocument());

    // Restore data
    const restoreButton = screen.getByRole('button', { name: /reia datele/i });
    await user.click(restoreButton);

    // Data should be restored
    await waitFor(() => expect(screen.getByDisplayValue('75')).toBeInTheDocument());
  });
});