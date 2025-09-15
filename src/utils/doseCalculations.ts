import { Drug } from "@/types/regimens";
import { drugLimits, checkDoseLimit } from "@/data/drugLimits";
import { logCarboplatinCalculation } from "./carboplatin-logger";

export interface DoseCalculationResult {
  calculatedDose: number;
  finalDose: number;
  reductionPercentage: number;
  doseAlert?: {
    isExceeded: boolean;
    warning?: string;
    suggestedAction?: string;
  };
  concentrationAlert?: string;
}

/**
 * Calculate BSA-based dose for a drug
 */
export const calculateBSADose = (drug: Drug, bsa: number): number => {
  const dosage = parseFloat(drug.dosage);
  if (isNaN(dosage)) return 0;
  
  if (drug.unit === "mg/m²" || drug.unit === "g/m²") {
    return dosage * bsa;
  }
  
  return dosage;
};

/**
 * Calculate weight-based dose for a drug
 */
export const calculateWeightBasedDose = (drug: Drug, weight: number): number => {
  const dosage = parseFloat(drug.dosage);
  if (isNaN(dosage)) return 0;
  
  if (drug.unit === "mg/kg") {
    return dosage * weight;
  }
  
  return dosage;
};

/**
 * Parse AUC value from dosage string, handling various formats
 */
export const parseAUCValue = (dosage: string): number => {
  // Handle formats like "AUC5", "AUC 6", "AUC 1.5", etc.
  const aucValue = dosage.replace(/^AUC\s*/i, '').trim();
  const parsed = parseFloat(aucValue);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Check if a drug uses AUC-based dosing
 */
export const isAUCBasedDrug = (drug: Drug): boolean => {
  return drug.unit === "AUC" || 
         (drug.dosage && drug.dosage.toLowerCase().startsWith('auc'));
};

/**
 * Validates AUC format and detects multiple values
 */
export const validateAUCFormat = (dosage: string): { isValid: boolean; error?: string } => {
  const aucValue = parseAUCValue(dosage);
  
  if (aucValue === 0) {
    return { isValid: false, error: `Invalid AUC format: ${dosage}` };
  }
  
  if (dosage.includes('-')) {
    return { isValid: false, error: `Multiple AUC values not allowed: ${dosage}` };
  }
  
  return { isValid: true };
};

/**
 * Calculate AUC-based dose using Calvert formula
 * Dose (mg) = AUC × (GFR + 25)
 */
export const calculateAUCDose = (
  drug: Drug, 
  targetAUC: number, 
  gfr: number,
  cappedGFR: boolean = true
): number => {
  if (!isAUCBasedDrug(drug)) {
    return parseFloat(drug.dosage) || 0;
  }
  
  // Cap GFR at 125 mL/min for safety as per guidelines
  const effectiveGFR = cappedGFR ? Math.min(gfr, 125) : gfr;
  return targetAUC * (effectiveGFR + 25);
};

/**
 * Apply age-based dose adjustments
 */
export const applyAgeAdjustment = (dose: number, age: number, drug: Drug): number => {
  // Elderly patients (>70 years) may need dose reductions for certain drugs
  if (age > 70) {
    const elderlyDrugs = [
      "Doxorubicin", "Epirubicin", "Cisplatin", "Carboplatin",
      "Irinotecan", "Docetaxel", "Paclitaxel"
    ];
    
    if (elderlyDrugs.includes(drug.name)) {
      return dose * 0.85; // 15% reduction for elderly patients
    }
  }
  
  return dose;
};

/**
 * Apply renal function-based dose adjustments
 */
export const applyRenalAdjustment = (
  dose: number, 
  creatinineClearance: number, 
  drug: Drug
): number => {
  const limit = drugLimits[drug.name];
  if (!limit?.renalAdjustment) return dose;
  
  const { crclThreshold } = limit.renalAdjustment;
  
  if (creatinineClearance < crclThreshold) {
    switch (drug.name) {
      case "Cisplatin":
        if (creatinineClearance >= 30 && creatinineClearance < 60) {
          return dose * 0.5; // 50% reduction
        } else if (creatinineClearance < 30) {
          return 0; // Contraindicated
        }
        break;
      case "Capecitabine":
        if (creatinineClearance >= 30 && creatinineClearance < 50) {
          return dose * 0.75; // 25% reduction
        }
        break;
      case "Pemetrexed":
        if (creatinineClearance < 45) {
          return 0; // Contraindicated
        }
        break;
      case "Topotecan":
        if (creatinineClearance >= 40 && creatinineClearance < 60) {
          return dose * 0.75; // 25% reduction
        }
        break;
    }
  }
  
  return dose;
};

/**
 * Validate drug concentration based on volume and dose
 */
export const validateConcentration = (
  drug: Drug, 
  dose: number, 
  volume: number
): string | null => {
  if (!volume || volume <= 0) return null;
  
  const concentration = dose / volume;
  
  switch (drug.name) {
    case "Paclitaxel":
      if (concentration > 1.2) {
        return `Concentrația Paclitaxel (${concentration.toFixed(2)} mg/mL) depășește limita de 1.2 mg/mL`;
      }
      if (concentration < 0.3) {
        return `Concentrația Paclitaxel (${concentration.toFixed(2)} mg/mL) este sub limita minimă de 0.3 mg/mL`;
      }
      break;
    case "Oxaliplatin":
      if (volume < 250) {
        return "Volumul minim pentru Oxaliplatin este 250 mL";
      }
      break;
  }
  
  return null;
};

/**
 * Validate solvent compatibility
 */
export const validateSolventCompatibility = (
  drug: Drug, 
  selectedSolvent: string
): string | null => {
  if (!drug.availableSolvents || drug.availableSolvents.length === 0) {
    return null;
  }
  
  // Normalize solvent names for comparison
  const normalizedSolvents = drug.availableSolvents.map(s => 
    s.toLowerCase().replace(/[^a-z0-9]/g, '')
  );
  const normalizedSelected = selectedSolvent.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  if (!normalizedSolvents.includes(normalizedSelected)) {
    if (drug.name === "Oxaliplatin" && !selectedSolvent.includes("D5W") && !selectedSolvent.includes("Glucose")) {
      return "Oxaliplatin: doar Glucoză 5% (D5W) pentru stabilitate";
    }
    return `Solvent incompatibil pentru ${drug.name}. Solventi permisi: ${drug.availableSolvents.join(", ")}`;
  }
  
  return null;
};

/**
 * Main dose calculation function with all validations and adjustments
 */
export const calculateCompleteDose = (
  drug: Drug,
  bsa: number,
  weight: number,
  age: number,
  creatinineClearance: number,
  schedule?: string,
  selectedVolume?: number,
  selectedSolvent?: string
): DoseCalculationResult => {
  let calculatedDose = 0;
  
  // Calculate base dose based on unit type or drug characteristics
  if (isAUCBasedDrug(drug)) {
    const targetAUC = parseAUCValue(drug.dosage);
    if (targetAUC > 0) {
      calculatedDose = calculateAUCDose(drug, targetAUC, creatinineClearance);
    }
  } else if (drug.unit === "mg/kg") {
    calculatedDose = calculateWeightBasedDose(drug, weight);
  } else {
    calculatedDose = calculateBSADose(drug, bsa);
  }
  
  // Apply adjustments
  calculatedDose = applyAgeAdjustment(calculatedDose, age, drug);
  calculatedDose = applyRenalAdjustment(calculatedDose, creatinineClearance, drug);
  
  // Log Carboplatin calculations for debugging
  logCarboplatinCalculation(drug, bsa, weight, age, creatinineClearance, calculatedDose, Math.round(calculatedDose * 10) / 10);

  // Check dose limits
  const doseAlert = checkDoseLimit(drug.name, calculatedDose, schedule);
  
  // Validate concentration if volume is provided
  let concentrationAlert: string | null = null;
  if (selectedVolume) {
    concentrationAlert = validateConcentration(drug, calculatedDose, selectedVolume);
  }
  
  // Validate solvent compatibility
  if (selectedSolvent) {
    const solventAlert = validateSolventCompatibility(drug, selectedSolvent);
    if (solventAlert && !concentrationAlert) {
      concentrationAlert = solventAlert;
    }
  }
  
  return {
    calculatedDose,
    finalDose: Math.round(calculatedDose * 10) / 10,
    reductionPercentage: 0,
    doseAlert: doseAlert.isExceeded ? doseAlert : undefined,
    concentrationAlert: concentrationAlert || undefined
  };
};

/**
 * Calculate cumulative dose for tracking lifetime limits
 */
export const calculateCumulativeDose = (
  drug: Drug,
  dosePerCycle: number,
  cyclesCompleted: number
): { cumulativeDose: number; isLimitExceeded: boolean; warning?: string } => {
  const cumulativeDose = dosePerCycle * cyclesCompleted;
  const limit = drugLimits[drug.name];
  
  if (limit?.maxCumulative) {
    const isExceeded = cumulativeDose > limit.maxCumulative;
    return {
      cumulativeDose,
      isLimitExceeded: isExceeded,
      warning: isExceeded 
        ? `Doza cumulativă de ${drug.name} (${cumulativeDose.toFixed(1)} ${limit.unit}) depășește limita de ${limit.maxCumulative} ${limit.unit}`
        : undefined
    };
  }
  
  return { cumulativeDose, isLimitExceeded: false };
};