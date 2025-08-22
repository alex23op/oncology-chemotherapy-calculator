// Enhanced validation utilities with proper error handling

import { SolventType, validateSolventType } from '@/types/solvents';
import { logger } from './logger';
import { z } from "zod";

// Enhanced TreatmentData validation schema
export const TreatmentDataSchema = z.object({
  patient: z.object({
    cnp: z.string().optional(),
    foNumber: z.string().optional(),
    fullName: z.string().optional(),
    weight: z.number().positive("Weight must be positive"),
    height: z.number().positive("Height must be positive"),
    age: z.number().min(0).max(150, "Age must be between 0 and 150"),
    sex: z.enum(["male", "female", "M", "F"]),
    bsa: z.number().positive("BSA must be positive"),
    creatinineClearance: z.number().positive("Creatinine clearance must be positive"),
    cycleNumber: z.number().positive().optional(),
    treatmentDate: z.string().optional(),
    nextCycleDate: z.string().optional(),
  }),
  regimen: z.object({
    id: z.string().min(1, "Regimen ID is required"),
    name: z.string().min(1, "Regimen name is required"),
    description: z.string().optional(),
    category: z.enum(["neoadjuvant", "adjuvant", "advanced", "metastatic", "maintenance", "general"]).optional(),
    drugs: z.array(z.object({
      name: z.string().min(1, "Drug name is required"),
      dosage: z.string().min(1, "Dosage is required"),
      unit: z.enum(["mg/m²", "mg/kg", "mg", "AUC", "units", "g/m²"]),
      route: z.enum(["IV", "PO", "SC", "IM", "Intravesical", "IT"]),
      day: z.string().optional(),
    })).min(1, "At least one drug is required"),
  }),
  calculatedDrugs: z.array(z.object({
    name: z.string(),
    calculatedDose: z.string(),
    finalDose: z.string(),
    unit: z.string(),
    route: z.string(),
    solvent: z.string().nullable(),
  })),
  emetogenicRisk: z.object({
    level: z.enum(["high", "moderate", "low", "minimal"]),
    justification: z.string(),
    acuteRisk: z.string(),
    delayedRisk: z.string(),
  }),
  premedications: z.object({
    antiemetics: z.array(z.any()),
    infusionReactionProphylaxis: z.array(z.any()),
    gastroprotection: z.array(z.any()),
    organProtection: z.array(z.any()),
    other: z.array(z.any()),
  }),
  clinicalNotes: z.string().optional(),
  preparingPharmacist: z.string().optional(),
  verifyingNurse: z.string().optional(),
});

// Solvent compatibility validation
export const SOLVENT_COMPATIBILITY = {
  "Oxaliplatin": ["Dextrose 5%", "Water for Injection"],
  "Cisplatin": ["Normal Saline 0.9%", "Dextrose 5%"],
  "Carboplatin": ["Normal Saline 0.9%", "Dextrose 5%", "Water for Injection"],
  "Paclitaxel": ["Normal Saline 0.9%", "Dextrose 5%"],
  "Docetaxel": ["Normal Saline 0.9%", "Dextrose 5%"],
  "5-Fluorouracil": ["Normal Saline 0.9%", "Dextrose 5%"],
  "Gemcitabine": ["Normal Saline 0.9%"],
  "Irinotecan": ["Normal Saline 0.9%", "Dextrose 5%"],
} as const;

export const validateSolventCompatibility = (drugName: string, solvent: string): string | null => {
  const compatibleSolvents = SOLVENT_COMPATIBILITY[drugName as keyof typeof SOLVENT_COMPATIBILITY];
  
  if (!compatibleSolvents) {
    return null; // No specific restrictions
  }
  
  if (!compatibleSolvents.includes(solvent as never)) {
    return `${drugName} is not compatible with ${solvent}. Compatible solvents: ${compatibleSolvents.join(", ")}`;
  }
  
  return null;
};

// Validation functions with error handling
export const validateTreatmentData = (data: unknown): { isValid: boolean; errors?: string[] } => {
  try {
    TreatmentDataSchema.parse(data);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      logger.error("TreatmentData validation failed:", { errors });
      return { isValid: false, errors };
    }
    logger.error("Unexpected validation error occurred during treatment data validation", { 
      component: 'validation', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    return { isValid: false, errors: ["Unexpected validation error"] };
  }
};

// Type exports
export type ValidatedTreatmentData = z.infer<typeof TreatmentDataSchema>;

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult<T = any> {
  isValid: boolean;
  data?: T;
  errors: ValidationError[];
}

export const validateRequired = (value: unknown, fieldName: string): ValidationError | null => {
  if (value === null || value === undefined || value === '') {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
      code: 'REQUIRED'
    };
  }
  return null;
};

export const validateSolvent = (solvent: string | null, fieldName: string): ValidationError | null => {
  if (solvent !== null && !validateSolventType(solvent)) {
    logger.warn('Invalid solvent type detected', { 
      component: 'validation',
      data: { solvent, field: fieldName }
    });
    return {
      field: fieldName,
      message: `Invalid solvent type: ${solvent}`,
      code: 'INVALID_SOLVENT'
    };
  }
  return null;
};

export const validateNumericRange = (
  value: number, 
  min: number, 
  max: number, 
  fieldName: string
): ValidationError | null => {
  if (value < min || value > max) {
    return {
      field: fieldName,
      message: `${fieldName} must be between ${min} and ${max}`,
      code: 'OUT_OF_RANGE'
    };
  }
  return null;
};

export const safeParseNumber = (value: string | number, fieldName: string): ValidationResult<number> => {
  const num = typeof value === 'number' ? value : parseFloat(value);
  
  if (isNaN(num)) {
    return {
      isValid: false,
      errors: [{
        field: fieldName,
        message: `${fieldName} must be a valid number`,
        code: 'INVALID_NUMBER'
      }]
    };
  }
  
  return {
    isValid: true,
    data: num,
    errors: []
  };
};