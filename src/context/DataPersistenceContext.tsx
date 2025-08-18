import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Regimen, Premedication } from '@/types/regimens';
import { TreatmentData } from '@/types/clinicalTreatment';
import { AntiemeticAgent } from '@/types/emetogenicRisk';
import { toast } from 'sonner';

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
  // Additional dose calculator fields
  fullName: string;
  cnp: string;
  foNumber: string;
  cycleNumber: string;
  treatmentDate: Date;
  nextCycleDate?: Date;
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
}

type DataPersistenceAction =
  | { type: 'SET_PATIENT_DATA'; payload: Partial<PatientData> }
  | { type: 'SET_REGIMEN_DATA'; payload: RegimenData }
  | { type: 'SET_SUPPORTIVE_DATA'; payload: Partial<SupportiveData> }
  | { type: 'SET_DOSE_DATA'; payload: DoseData }
  | { type: 'LOAD_FROM_STORAGE'; payload: PersistedState }
  | { type: 'RESET_ALL' };

interface DataPersistenceContextType {
  state: PersistedState;
  setPatientData: (data: Partial<PatientData>) => void;
  setRegimenData: (data: RegimenData) => void;
  setSupportiveData: (data: Partial<SupportiveData>) => void;
  setDoseData: (data: DoseData) => void;
  resetAllData: () => void;
  hasPersistedData: boolean;
}

const DataPersistenceContext = createContext<DataPersistenceContextType | undefined>(undefined);

const STORAGE_KEY = 'clinical-treatment-data';

function dataPersistenceReducer(state: PersistedState, action: DataPersistenceAction): PersistedState {
  switch (action.type) {
    case 'SET_PATIENT_DATA':
      return {
        ...state,
        patientData: { ...state.patientData, ...action.payload },
        lastUpdated: new Date().toISOString()
      };
    case 'SET_REGIMEN_DATA':
      return {
        ...state,
        regimenData: { ...state.regimenData, ...action.payload },
        lastUpdated: new Date().toISOString()
      };
    case 'SET_SUPPORTIVE_DATA':
      return {
        ...state,
        supportiveData: { ...state.supportiveData, ...action.payload },
        lastUpdated: new Date().toISOString()
      };
    case 'SET_DOSE_DATA':
      return {
        ...state,
        doseData: action.payload,
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
  const serializedState = {
    ...state,
    patientData: state.patientData ? {
      ...state.patientData,
      treatmentDate: state.patientData.treatmentDate?.toISOString(),
      nextCycleDate: state.patientData.nextCycleDate?.toISOString(),
    } : undefined
  };
  return JSON.stringify(serializedState);
};

// Helper to deserialize dates from localStorage
const deserializeFromStorage = (data: string): PersistedState => {
  const parsed = JSON.parse(data);
  if (parsed.patientData) {
    parsed.patientData = {
      ...parsed.patientData,
      treatmentDate: parseStoredDate(parsed.patientData.treatmentDate),
      nextCycleDate: parseStoredDate(parsed.patientData.nextCycleDate),
    };
  }
  return parsed;
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
        if (Object.keys(parsedData).length > 0 && parsedData.lastUpdated) {
          setStoredData(parsedData);
          setHasPersistedData(true);
          setShowRecoveryDialog(true);
        }
      }
    } catch (error) {
      console.warn('Failed to load persisted data:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (Object.keys(state).length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, serializeForStorage(state));
      } catch (error) {
        console.warn('Failed to save data to localStorage:', error);
        toast.error('Nu s-au putut salva datele local. Vă rugăm să nu închideți aplicația.');
      }
    }
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
    dispatch({ type: 'RESET_ALL' });
    localStorage.removeItem(STORAGE_KEY);
    setHasPersistedData(false);
    toast.success('Toate datele au fost șterse. Puteți începe un nou caz.');
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
              Există date nesalvate de la o sesiune anterioară din{' '}
              {storedData?.lastUpdated && new Date(storedData.lastUpdated).toLocaleString('ro-RO')}.
              {' '}Doriți să le încărcați?
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