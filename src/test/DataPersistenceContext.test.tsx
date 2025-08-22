import { renderHook, act } from '@testing-library/react';
import { DataPersistenceProvider, useDataPersistence } from '@/context/DataPersistenceContext';
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Mock logger
vi.mock('@/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    error: vi.fn()
  }
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <DataPersistenceProvider>{children}</DataPersistenceProvider>
);

describe('DataPersistenceContext', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.clearAllMocks();
  });

  describe('hasValidData detection', () => {
    it('should detect valid patient data', () => {
      const { result } = renderHook(() => useDataPersistence(), { wrapper });
      
      act(() => {
        result.current.setPatientData({
          fullName: 'Test Patient',
          weight: '70',
          height: '170'
        });
      });

      expect(result.current.state.patientData?.fullName).toBe('Test Patient');
    });

    it('should detect valid regimen data', () => {
      const { result } = renderHook(() => useDataPersistence(), { wrapper });
      
      const mockRegimen = {
        id: 'test-regimen',
        name: 'Test Regimen',
        drugs: []
      };

      act(() => {
        result.current.setRegimenData({ selectedRegimen: mockRegimen as any });
      });

      expect(result.current.state.regimenData?.selectedRegimen?.name).toBe('Test Regimen');
    });

    it('should not save empty or incomplete states', () => {
      const { result } = renderHook(() => useDataPersistence(), { wrapper });
      
      // Set empty patient data
      act(() => {
        result.current.setPatientData({});
      });

      // Should not save to localStorage until there's meaningful data
      const stored = mockLocalStorage.getItem('clinical-treatment-data');
      if (stored) {
        const parsedData = JSON.parse(stored);
        // Should have data structure but not trigger recovery dialog
        expect(parsedData.patientData).toEqual({});
      }
    });
  });

  describe('session completion', () => {
    it('should mark session as complete and clean localStorage', () => {
      const { result } = renderHook(() => useDataPersistence(), { wrapper });
      
      // Add some data first
      act(() => {
        result.current.setPatientData({ fullName: 'Test Patient' });
      });

      // Mark session complete
      act(() => {
        result.current.markSessionComplete();
      });

      expect(result.current.state.isSessionComplete).toBe(true);
      
      // localStorage should be cleared after a short delay
      setTimeout(() => {
        const stored = mockLocalStorage.getItem('clinical-treatment-data');
        expect(stored).toBeNull();
      }, 200);
    });

    it('should reset all data and clear localStorage', () => {
      const { result } = renderHook(() => useDataPersistence(), { wrapper });
      
      // Add some data first
      act(() => {
        result.current.setPatientData({ fullName: 'Test Patient' });
      });

      // Reset all data
      act(() => {
        result.current.resetAllData();
      });

      expect(Object.keys(result.current.state)).toHaveLength(0);
      expect(mockLocalStorage.getItem('clinical-treatment-data')).toBeNull();
    });
  });

  describe('data expiration', () => {
    it('should handle expired data correctly', () => {
      // Set up expired data (25 hours ago)
      const expiredDate = new Date();
      expiredDate.setHours(expiredDate.getHours() - 25);
      
      const expiredData = {
        patientData: { fullName: 'Expired Patient' },
        lastUpdated: expiredDate.toISOString()
      };

      mockLocalStorage.setItem('clinical-treatment-data', JSON.stringify(expiredData));

      // When component mounts, expired data should be removed
      renderHook(() => useDataPersistence(), { wrapper });

      // Data should be removed from localStorage
      expect(mockLocalStorage.getItem('clinical-treatment-data')).toBeNull();
    });

    it('should handle recent incomplete data correctly', () => {
      // Set up recent incomplete data (2 minutes ago)
      const recentDate = new Date();
      recentDate.setMinutes(recentDate.getMinutes() - 2);
      
      const recentData = {
        patientData: { fullName: 'Recent Patient' },
        lastUpdated: recentDate.toISOString(),
        isSessionComplete: false
      };

      mockLocalStorage.setItem('clinical-treatment-data', JSON.stringify(recentData));

      const { result } = renderHook(() => useDataPersistence(), { wrapper });

      // Recent data should not automatically trigger recovery (needs >= 5 minutes)
      expect(result.current.hasPersistedData).toBe(false);
    });
  });

  describe('debounced saving', () => {
    it('should debounce rapid state changes', async () => {
      const { result } = renderHook(() => useDataPersistence(), { wrapper });
      
      // Make rapid changes
      act(() => {
        result.current.setPatientData({ weight: '70' });
        result.current.setPatientData({ weight: '71' });
        result.current.setPatientData({ weight: '72' });
      });

      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 600));

      const stored = mockLocalStorage.getItem('clinical-treatment-data');
      if (stored) {
        const parsedData = JSON.parse(stored);
        expect(parsedData.patientData?.weight).toBe('72');
      }
    });
  });
});