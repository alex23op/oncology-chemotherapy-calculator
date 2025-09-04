import { toast } from "@/hooks/use-toast";
import i18n from '@/i18n';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface PatientValidationRules {
  weight: { min: number; max: number; unit: string };
  height: { min: number; max: number; unit: string };
  age: { min: number; max: number };
  bsa: { min: number; max: number };
  creatinineClearance: { min: number; max: number };
  creatinine: { min: number; max: number; unit: string };
}

export const VALIDATION_RULES: PatientValidationRules = {
  weight: { min: 1, max: 500, unit: 'kg' },
  height: { min: 50, max: 250, unit: 'cm' },
  age: { min: 0, max: 120 },
  bsa: { min: 0.5, max: 3.5 },
  creatinineClearance: { min: 5, max: 200 },
  creatinine: { min: 0.1, max: 15, unit: 'mg/dL' }
};

export const validatePatientData = (data: any): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Weight validation
  if (data.weight) {
    const weight = parseFloat(data.weight);
if (isNaN(weight)) {
  errors.push(i18n.t('validation.weightNaN') as string);
} else {
  // Convert to kg for validation
  const weightKg = data.weightUnit === "lbs" ? weight * 0.453592 : weight;
  if (weightKg < VALIDATION_RULES.weight.min) {
    errors.push(i18n.t('validation.weightMin', { min: VALIDATION_RULES.weight.min }) as string);
  } else if (weightKg > VALIDATION_RULES.weight.max) {
    errors.push(i18n.t('validation.weightMax', { max: VALIDATION_RULES.weight.max }) as string);
  }
  
  if (weightKg < 10) {
    warnings.push(i18n.t('validation.pediatricWeight') as string);
  } else if (weightKg > 150) {
    warnings.push(i18n.t('validation.highWeight', { bsaCap: 2.2 }) as string);
  }
}
  }

  // Height validation
  if (data.height) {
    const height = parseFloat(data.height);
if (isNaN(height)) {
  errors.push(i18n.t('validation.heightNaN') as string);
} else {
  // Convert to cm for validation
  const heightCm = data.heightUnit === "inches" ? height * 2.54 : height;
  if (heightCm < VALIDATION_RULES.height.min) {
    errors.push(i18n.t('validation.heightMin', { min: VALIDATION_RULES.height.min }) as string);
  } else if (heightCm > VALIDATION_RULES.height.max) {
    errors.push(i18n.t('validation.heightMax', { max: VALIDATION_RULES.height.max }) as string);
  }
}
  }

  // Age validation
  if (data.age) {
    const age = parseFloat(data.age);
if (isNaN(age)) {
  errors.push(i18n.t('validation.ageNaN') as string);
} else {
  if (age < VALIDATION_RULES.age.min) {
    errors.push(i18n.t('validation.ageMin', { min: VALIDATION_RULES.age.min }) as string);
  } else if (age > VALIDATION_RULES.age.max) {
    errors.push(i18n.t('validation.ageMax', { max: VALIDATION_RULES.age.max }) as string);
  }
  
  if (age < 18) {
    warnings.push(i18n.t('validation.pediatricPatient') as string);
  } else if (age > 75) {
    warnings.push(i18n.t('validation.elderlyPatient') as string);
  }
}
  }

  // BSA validation
  if (data.bsa) {
if (data.bsa < VALIDATION_RULES.bsa.min) {
  warnings.push(i18n.t('validation.bsaLow') as string);
} else if (data.bsa > VALIDATION_RULES.bsa.max) {
  warnings.push(i18n.t('validation.bsaHigh') as string);
}
  }

  // Creatinine clearance validation
  if (data.creatinineClearance) {
if (data.creatinineClearance < VALIDATION_RULES.creatinineClearance.min) {
  warnings.push(i18n.t('validation.crclSevere') as string);
} else if (data.creatinineClearance < 30) {
  warnings.push(i18n.t('validation.crclModerateSevere') as string);
} else if (data.creatinineClearance < 60) {
  warnings.push(i18n.t('validation.crclMildModerate') as string);
}
  }

  // Creatinine validation
  if (data.creatinine) {
    const creatinine = parseFloat(data.creatinine);
if (isNaN(creatinine)) {
  errors.push(i18n.t('validation.creatinineNaN') as string);
} else {
  // Convert to mg/dL for validation
  const creatinineMgDl = data.creatinineUnit === "μmol/L" ? creatinine / 88.4 : creatinine;
  if (creatinineMgDl < VALIDATION_RULES.creatinine.min) {
    warnings.push(i18n.t('validation.creatinineLow') as string);
  } else if (creatinineMgDl > VALIDATION_RULES.creatinine.max) {
    warnings.push(i18n.t('validation.creatinineHigh') as string);
  }
}
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const validateDoseCalculation = (
  drugName: string,
  calculatedDose: number,
  standardDose: number,
  unit: string
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

if (!drugName || !calculatedDose || !standardDose) {
  errors.push(i18n.t('validation.missingDoseParams') as string);
  return { isValid: false, errors, warnings };
}

if (calculatedDose <= 0) {
  errors.push(i18n.t('validation.calculatedDosePositive', { drug: drugName }) as string);
}

  const doseRatio = calculatedDose / standardDose;
  
if (doseRatio < 0.1) {
  errors.push(i18n.t('validation.doseExtremelyLow', { drug: drugName, dose: calculatedDose, unit }) as string);
} else if (doseRatio < 0.5) {
  warnings.push(i18n.t('validation.doseLow', { drug: drugName, dose: calculatedDose, unit }) as string);
}

if (doseRatio > 2.0) {
  errors.push(i18n.t('validation.doseExceedsMax', { drug: drugName, dose: calculatedDose, unit }) as string);
} else if (doseRatio > 1.5) {
  warnings.push(i18n.t('validation.doseHigh', { drug: drugName, dose: calculatedDose, unit }) as string);
}

  // Drug-specific validations
if (drugName.toLowerCase().includes('doxorubicin')) {
  if (calculatedDose > 150) {
    warnings.push(i18n.t('validation.doxorubicinCumulative', { drug: drugName, dose: calculatedDose }) as string);
  }
}

if (drugName.toLowerCase().includes('cisplatin')) {
  if (calculatedDose > 120) {
    warnings.push(i18n.t('validation.cisplatinHigh', { drug: drugName }) as string);
  }
}

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove potentially dangerous characters but preserve spaces and normal text
  return input
    .replace(/[<>"]/g, '') // Remove HTML-like characters (excluding single quotes to preserve contractions)
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
    .trim();
};

// New function specifically for validating and sanitizing names
export const sanitizeName = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Allow letters, spaces, hyphens, apostrophes, and dots for names
  // Remove numbers and special characters except allowed ones
  return input
    .replace(/[^a-zA-ZăâîșțĂÂÎȘȚ\s\-'\.]/g, '') // Keep only letters (including Romanian), spaces, hyphens, apostrophes, dots
    .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
    .trim();
};

export const validateFullName = (name: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!name || name.trim().length === 0) {
    errors.push('Numele și prenumele sunt obligatorii');
    return { isValid: false, errors, warnings };
  }

  // Check for minimum length
  if (name.trim().length < 2) {
    errors.push('Numele trebuie să conțină cel puțin 2 caractere');
  }

  // Check for numbers
  if (/\d/.test(name)) {
    errors.push('Numele nu poate conține cifre');
  }

  // Check for invalid special characters
  if (/[!@#$%^&*()+={}[\]|\\:";?/<>,~`]/.test(name)) {
    errors.push('Numele conține caractere nevalide');
  }

  // Warn if only one word (missing surname or first name)
  if (!name.includes(' ')) {
    warnings.push('Vă rugăm să introduceți atât numele cât și prenumele');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const showValidationToast = (validation: ValidationResult, context: string = "") => {
  if (!validation.isValid && validation.errors.length > 0) {
    toast({
      variant: "destructive",
      title: `${i18n.t('validation.titles.error')}${context ? ` - ${context}` : ''}`,
      description: validation.errors.join('; ')
    });
  }

  if (validation.warnings.length > 0) {
    toast({
      title: `${i18n.t('validation.titles.warning')}${context ? ` - ${context}` : ''}`,
      description: validation.warnings.join('; '),
      className: "border-warning bg-warning/10"
    });
  }
};