// Improved type definitions for better type safety

// Remove conflicting PatientData type and use the existing one from PatientForm
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface DraftCalculation {
  drug: string;
  calculatedDose: number;
  adjustedDose?: number;
  finalDose: number;
  selected: boolean;
  solvent?: string;
  administrationDuration?: string;
  notes?: string;
}

export interface LocalPremedAgent {
  name: string;
  category: string;
  class: string;
  dosage: string;
  unit: string;
  route: string;
  timing: string;
  indication: string;
  rationale?: string;
  isRequired: boolean;
  isStandard: boolean;
  evidenceLevel?: string;
  drugSpecific?: string[];
  administrationDuration?: string;
  weightBased?: boolean;
  notes?: string;
  solvent?: string | null;
}

// Remove references to undefined PatientData type
export interface TreatmentExportData {
  patient: any | null;
  regimen: any | null;
  calculations: any[];
  timestamp: string;
}

export interface ClinicalData {
  biomarkers?: Record<string, string>;
  currentMedications?: string[];
  allergies?: string[];
  comorbidities?: string[];
}

export interface DrugInteractionResult {
  hasInteractions: boolean;
  interactions: {
    drug1: string;
    drug2: string;
    severity: 'major' | 'moderate' | 'minor';
    description: string;
    management: string;
  }[];
}

export interface SafetyCheckOptions {
  includeBiomarkers?: boolean;
  includeInteractions?: boolean;
  includeContraindications?: boolean;
  enableProfiling?: boolean;
}

// Remove type guards that reference undefined types
export const isValidCalculation = (calc: unknown): calc is DraftCalculation => {
  const calculation = calc as DraftCalculation;
  return (
    typeof calculation?.drug === 'string' &&
    typeof calculation?.calculatedDose === 'number' &&
    typeof calculation?.finalDose === 'number' &&
    typeof calculation?.selected === 'boolean'
  );
};

// Utility type for translation functions with better type safety
export type TFunction = (key: string, options?: { defaultValue?: string; [key: string]: any }) => string;

// Enhanced error types for better error handling
export interface ComponentError extends Error {
  component?: string;
  action?: string;
  context?: Record<string, any>;
}

export const createComponentError = (
  message: string, 
  component?: string, 
  action?: string, 
  context?: Record<string, any>
): ComponentError => {
  const error = new Error(message) as ComponentError;
  error.component = component;
  error.action = action;
  error.context = context;
  return error;
};