import { toast } from "@/hooks/use-toast";
import i18n from "@/i18n";

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
      errors.push("Weight must be a valid number");
    } else {
      // Convert to kg for validation
      const weightKg = data.weightUnit === "lbs" ? weight * 0.453592 : weight;
      if (weightKg < VALIDATION_RULES.weight.min) {
        errors.push(`Weight must be at least ${VALIDATION_RULES.weight.min} kg`);
      } else if (weightKg > VALIDATION_RULES.weight.max) {
        errors.push(`Weight cannot exceed ${VALIDATION_RULES.weight.max} kg`);
      }
      
      if (weightKg < 10) {
        warnings.push("Pediatric weight detected - verify dosing protocols");
      } else if (weightKg > 150) {
        warnings.push("High weight - consider dose capping for BSA > 2.2 m²");
      }
    }
  }

  // Height validation
  if (data.height) {
    const height = parseFloat(data.height);
    if (isNaN(height)) {
      errors.push("Height must be a valid number");
    } else {
      // Convert to cm for validation
      const heightCm = data.heightUnit === "inches" ? height * 2.54 : height;
      if (heightCm < VALIDATION_RULES.height.min) {
        errors.push(`Height must be at least ${VALIDATION_RULES.height.min} cm`);
      } else if (heightCm > VALIDATION_RULES.height.max) {
        errors.push(`Height cannot exceed ${VALIDATION_RULES.height.max} cm`);
      }
    }
  }

  // Age validation
  if (data.age) {
    const age = parseFloat(data.age);
    if (isNaN(age)) {
      errors.push("Age must be a valid number");
    } else {
      if (age < VALIDATION_RULES.age.min) {
        errors.push(`Age must be at least ${VALIDATION_RULES.age.min}`);
      } else if (age > VALIDATION_RULES.age.max) {
        errors.push(`Age cannot exceed ${VALIDATION_RULES.age.max} years`);
      }
      
      if (age < 18) {
        warnings.push("Pediatric patient - verify dosing protocols and consider pediatric-specific regimens");
      } else if (age > 75) {
        warnings.push("Elderly patient - consider dose reduction and enhanced monitoring");
      }
    }
  }

  // BSA validation
  if (data.bsa) {
    if (data.bsa < VALIDATION_RULES.bsa.min) {
      warnings.push("Low BSA detected - verify calculations and consider pediatric protocols");
    } else if (data.bsa > VALIDATION_RULES.bsa.max) {
      warnings.push("High BSA detected - consider dose capping at 2.2 m² for some agents");
    }
  }

  // Creatinine clearance validation
  if (data.creatinineClearance) {
    if (data.creatinineClearance < VALIDATION_RULES.creatinineClearance.min) {
      warnings.push("Severe renal impairment - consider dose reduction or nephrotoxic drug avoidance");
    } else if (data.creatinineClearance < 30) {
      warnings.push("Moderate-severe renal impairment - dose adjustment may be required");
    } else if (data.creatinineClearance < 60) {
      warnings.push("Mild-moderate renal impairment - monitor for nephrotoxicity");
    }
  }

  // Creatinine validation
  if (data.creatinine) {
    const creatinine = parseFloat(data.creatinine);
    if (isNaN(creatinine)) {
      errors.push("Creatinine must be a valid number");
    } else {
      // Convert to mg/dL for validation
      const creatinineMgDl = data.creatinineUnit === "μmol/L" ? creatinine / 88.4 : creatinine;
      if (creatinineMgDl < VALIDATION_RULES.creatinine.min) {
        warnings.push("Unusually low creatinine - verify lab values");
      } else if (creatinineMgDl > VALIDATION_RULES.creatinine.max) {
        warnings.push("Severely elevated creatinine - consider nephrology consultation");
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
    errors.push("Missing required dose calculation parameters");
    return { isValid: false, errors, warnings };
  }

  if (calculatedDose <= 0) {
    errors.push(`${drugName}: Calculated dose must be positive`);
  }

  const doseRatio = calculatedDose / standardDose;
  
  if (doseRatio < 0.1) {
    errors.push(`${drugName}: Calculated dose (${calculatedDose} ${unit}) is extremely low (< 10% of standard)`);
  } else if (doseRatio < 0.5) {
    warnings.push(`${drugName}: Low dose detected (${calculatedDose} ${unit}) - verify calculation`);
  }

  if (doseRatio > 2.0) {
    errors.push(`${drugName}: Calculated dose (${calculatedDose} ${unit}) exceeds maximum safe limit (200% of standard)`);
  } else if (doseRatio > 1.5) {
    warnings.push(`${drugName}: High dose detected (${calculatedDose} ${unit}) - consider dose capping`);
  }

  // Drug-specific validations
  if (drugName.toLowerCase().includes('doxorubicin')) {
    if (calculatedDose > 150) {
      warnings.push(`${drugName}: Consider cumulative dose monitoring (current: ${calculatedDose} mg)`);
    }
  }

  if (drugName.toLowerCase().includes('cisplatin')) {
    if (calculatedDose > 120) {
      warnings.push(`${drugName}: High cisplatin dose - ensure adequate hydration and monitoring`);
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
  
  // Remove potentially dangerous characters
  return input
    .replace(/[<>'"]/g, '') // Remove HTML-like characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
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