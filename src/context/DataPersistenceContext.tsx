import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Regimen, Premedication } from '@/types/regimens';
import { TreatmentData } from '@/types/clinicalTreatment';
import { AntiemeticAgent } from '@/types/emetogenicRisk';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

interface PatientData {
  weight: string;
  height: string;
  age: string;
  sex: string;
  creatinine: string;
  weightUnit: string;
  heightUnit: string;
  creatinineUnit: string;
  bsa: number;
  creatinineClearance: number;
  // Patient identification fields
  fullName: string;
  cnp: string;
  foNumber: string;
  // Treatment details fields
  cycleNumber: number;
  treatmentDate: string; // ISO date string
  nextCycleDate?: string; // ISO date string
  bsaCapEnabled: boolean;
}

interface RegimenData {
  selectedCancerType?: string;
  selectedRegimen?: Regimen;
}

interface SupportiveData {
  emetogenicRiskLevel: "high" | "moderate" | "low" | "minimal";
  selectedPremedications: Premedication[];
  selectedAntiemetics: AntiemeticAgent[];
  groupedPremedications: any;
}

interface DoseData {
  calculations: any[];
  treatmentData?: TreatmentData;
}

interface PersistedState {
  patientData?: Partial<PatientData>;
  regimenData?: RegimenData;
  supportiveData?: Partial<SupportiveData>;
  doseData?: DoseData;
  lastUpdated?: string;
  isSessionComplete?: boolean;
}

type DataPersistenceAction =
  | { type: 'SET_PATIENT_DATA'; payload: Partial<PatientData> }
  | { type: 'SET_REGIMEN_DATA'; payload: RegimenData }
  | { type: 'SET_SUPPORTIVE_DATA'; payload: Partial<SupportiveData> }
  | { type: 'SET_DOSE_DATA'; payload: DoseData }
  | { type: 'LOAD_FROM_STORAGE'; payload: PersistedState }
  | { type: 'MARK_SESSION_COMPLETE' }
  | { type: 'RESET_ALL' };

interface DataPersistenceContextType {
  state: PersistedState;
  setPatientData: (data: Partial<PatientData>) => void;
  setRegimenData: (data: RegimenData) => void;
  setSupportiveData: (data: Partial<SupportiveData>) => void;
  setDoseData: (data: DoseData) => void;
  resetAllData: () => void;
  markSessionComplete: () => void;
  hasPersistedData: boolean;
}

const DataPersistenceContext = createContext<DataPersistenceContextType | undefined>(undefined);

const STORAGE_KEY = 'clinical-treatment-data';
const SESSION_TIMEOUT_MINUTES = 5;
const DATA_EXPIRY_HOURS = 24;

// Helper to check if data contains meaningful information
const hasValidData = (data: PersistedState): boolean => {
  const hasPatientInfo = !!(
    data.patientData?.fullName ||
    data.patientData?.cnp ||
    data.patientData?.weight ||
    data.patientData?.height
  );
  
  const hasRegimenInfo = !!(data.regimenData?.selectedRegimen);
  
  const hasDoseInfo = !!(
    data.doseData?.calculations && 
    data.doseData.calculations.length > 0
  );
  
  return hasPatientInfo || hasRegimenInfo || hasDoseInfo;
};

// Helper to check if data is recent enough to show recovery dialog
const isDataRecent = (lastUpdated: string): boolean => {
  const now = new Date();
  const dataDate = new Date(lastUpdated);
  const diffMinutes = (now.getTime() - dataDate.getTime()) / (1000 * 60);
  return diffMinutes >= SESSION_TIMEOUT_MINUTES;
};

// Helper to check if data is expired
const isDataExpired = (lastUpdated: string): boolean => {
  const now = new Date();
  const dataDate = new Date(lastUpdated);
  const diffHours = (now.getTime() - dataDate.getTime()) / (1000 * 60 * 60);
  return diffHours >= DATA_EXPIRY_HOURS;
};

// Helper to check if state should be saved
const shouldSaveState = (state: PersistedState): boolean => {
  // Don't save empty states or states with only lastUpdated
  if (!state || Object.keys(state).length === 0) return false;
  if (Object.keys(state).length === 1 && state.lastUpdated) return false;
  
  // Don't save if session is marked as complete
  if (state.isSessionComplete) return false;
  
  return true;
};

function dataPersistenceReducer(state: PersistedState, action: DataPersistenceAction): PersistedState {
  switch (action.type) {
    case 'SET_PATIENT_DATA':
      return {
        ...state,
        patientData: { ...state.patientData, ...action.payload },
        lastUpdated: new Date().toISOString(),
        isSessionComplete: false
      };
    case 'SET_REGIMEN_DATA':
      return {
        ...state,
        regimenData: { ...state.regimenData, ...action.payload },
        lastUpdated: new Date().toISOString(),
        isSessionComplete: false
      };
    case 'SET_SUPPORTIVE_DATA':
      return {
        ...state,
        supportiveData: { ...state.supportiveData, ...action.payload },
        lastUpdated: new Date().toISOString(),
        isSessionComplete: false
      };
    case 'SET_DOSE_DATA':
      return {
        ...state,
        doseData: action.payload,
        lastUpdated: new Date().toISOString(),
        isSessionComplete: false
      };
    case 'MARK_SESSION_COMPLETE':
      return {
        ...state,
        isSessionComplete: true,
        lastUpdated: new Date().toISOString()
      };
    case 'LOAD_FROM_STORAGE':
      return action.payload;
    case 'RESET_ALL':
      return {};
    default:
      return state;
  }
}

// Helper to safely parse dates from localStorage
const parseStoredDate = (dateStr: string | undefined): Date | undefined => {
  if (!dateStr) return undefined;
  try {
    return new Date(dateStr);
  } catch {
    return undefined;
  }
};

// Helper to serialize dates for localStorage
const serializeForStorage = (state: PersistedState): string => {
  // PatientData dates are already stored as ISO strings, no conversion needed
  return JSON.stringify(state);
};

// Helper to deserialize dates from localStorage
const deserializeFromStorage = (data: string): PersistedState => {
  // PatientData dates are stored as ISO strings, no conversion needed
  return JSON.parse(data);
};

export const DataPersistenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dataPersistenceReducer, {});
  const [hasPersistedData, setHasPersistedData] = useState(false);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [storedData, setStoredData] = useState<PersistedState | null>(null);

  // Check for persisted data on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedData = deserializeFromStorage(stored);
        
        logger.debug('Checking persisted data on mount', {
          component: 'DataPersistenceContext',
          hasData: Object.keys(parsedData).length > 0,
          lastUpdated: parsedData.lastUpdated,
          isComplete: parsedData.isSessionComplete
        });

        // Remove expired data automatically
        if (parsedData.lastUpdated && isDataExpired(parsedData.lastUpdated)) {
          logger.debug('Removing expired data', { lastUpdated: parsedData.lastUpdated });
          localStorage.removeItem(STORAGE_KEY);
          return;
        }

        // Show recovery dialog only for valid, recent, incomplete data
        if (parsedData.lastUpdated && 
            hasValidData(parsedData) && 
            !parsedData.isSessionComplete &&
            isDataRecent(parsedData.lastUpdated)) {
          
          logger.debug('Showing recovery dialog for valid incomplete data');
          setStoredData(parsedData);
          setHasPersistedData(true);
          setShowRecoveryDialog(true);
        } else if (parsedData.isSessionComplete) {
          // Clean up completed sessions
          logger.debug('Removing completed session data');
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      logger.error('Failed to load persisted data', { error: error.message });
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Save to localStorage whenever state changes (with debounce)
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (shouldSaveState(state)) {
        try {
          logger.debug('Saving state to localStorage', {
            component: 'DataPersistenceContext', 
            hasValidData: hasValidData(state),
            isComplete: state.isSessionComplete
          });
          localStorage.setItem(STORAGE_KEY, serializeForStorage(state));
        } catch (error) {
          logger.error('Failed to save data to localStorage', { error: error.message });
          toast.error('Nu s-au putut salva datele local. Vă rugăm să nu închideți aplicația.');
        }
      }
    }, 500); // Debounce saves by 500ms

    return () => clearTimeout(saveTimeout);
  }, [state]);

  const setPatientData = (data: Partial<PatientData>) => {
    dispatch({ type: 'SET_PATIENT_DATA', payload: data });
  };

  const setRegimenData = (data: RegimenData) => {
    dispatch({ type: 'SET_REGIMEN_DATA', payload: data });
  };

  const setSupportiveData = (data: Partial<SupportiveData>) => {
    dispatch({ type: 'SET_SUPPORTIVE_DATA', payload: data });
  };

  const setDoseData = (data: DoseData) => {
    dispatch({ type: 'SET_DOSE_DATA', payload: data });
  };

  const resetAllData = () => {
    logger.debug('Resetting all data', { component: 'DataPersistenceContext' });
    dispatch({ type: 'RESET_ALL' });
    localStorage.removeItem(STORAGE_KEY);
    setHasPersistedData(false);
    toast.success('Toate datele au fost șterse. Puteți începe un nou caz.');
  };

  const markSessionComplete = () => {
    logger.debug('Marking session as complete', { component: 'DataPersistenceContext' });
    dispatch({ type: 'MARK_SESSION_COMPLETE' });
    // Clear localStorage immediately when session is complete
    setTimeout(() => {
      localStorage.removeItem(STORAGE_KEY);
      setHasPersistedData(false);
    }, 100); // Small delay to ensure state is saved first
  };

  const handleRecoveryChoice = (restore: boolean) => {
    if (restore && storedData) {
      dispatch({ type: 'LOAD_FROM_STORAGE', payload: storedData });
      toast.success('Datele anterioare au fost restaurate cu succes.');
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setHasPersistedData(false);
    }
    setShowRecoveryDialog(false);
    setStoredData(null);
  };

  const value: DataPersistenceContextType = {
    state,
    setPatientData,
    setRegimenData,
    setSupportiveData,
    setDoseData,
    resetAllData,
    markSessionComplete,
    hasPersistedData
  };

  return (
    <DataPersistenceContext.Provider value={value}>
      {children}
      
      {/* Recovery Dialog */}
      {showRecoveryDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Date nesalvate detectate</h3>
            <p className="text-sm text-muted-foreground mb-6">
              S-au detectat date nesalvate dintr-o sesiune anterioară{' '}
              {storedData?.lastUpdated && (
                <>din {new Date(storedData.lastUpdated).toLocaleString('ro-RO')}</>
              )}
              {storedData?.patientData?.fullName && (
                <> pentru pacientul "{storedData.patientData.fullName}"</>
              )}.
              {' '}Doriți să continuați cu aceste date?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => handleRecoveryChoice(false)}
                className="px-4 py-2 text-sm border rounded hover:bg-muted"
              >
                Pornește cu formular gol
              </button>
              <button
                onClick={() => handleRecoveryChoice(true)}
                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Reia datele
              </button>
            </div>
          </div>
        </div>
      )}
    </DataPersistenceContext.Provider>
  );
};

export const useDataPersistence = () => {
  const context = useContext(DataPersistenceContext);
  if (context === undefined) {
    throw new Error('useDataPersistence must be used within a DataPersistenceProvider');
  }
  return context;
};