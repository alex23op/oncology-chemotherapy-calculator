import { Drug, Regimen } from '@/types/regimens';
import { PatientInfo } from '@/types/clinicalTreatment';

export interface SafetyAlert {
  id: string;
  severity: 'critical' | 'high' | 'moderate' | 'low' | 'info';
  category: 'dose' | 'interaction' | 'contraindication' | 'monitoring' | 'calculation';
  message: string;
  recommendation: string;
  drugNames?: string[];
  autoResolve?: boolean;
}

export interface SafetyCheckResult {
  passed: boolean;
  alerts: SafetyAlert[];
  calculations: Record<string, any>;
}

// Safe calculation utilities with null/undefined protection
export const safeParseFloat = (value: any, defaultValue: number = 0): number => {
  if (value === null || value === undefined || value === '') return defaultValue;
  const parsed = parseFloat(String(value));
  return isNaN(parsed) ? defaultValue : parsed;
};

export const safeDivide = (numerator: number, denominator: number, defaultValue: number = 0): number => {
  if (!denominator || denominator === 0) return defaultValue;
  return numerator / denominator;
};

export const safeCalculateBSA = (weight: number, height: number): number => {
  const safeWeight = safeParseFloat(weight);
  const safeHeight = safeParseFloat(height);
  
  if (safeWeight <= 0 || safeHeight <= 0) return 0;
  
  // DuBois formula with safety bounds
  const bsa = 0.007184 * Math.pow(safeHeight, 0.725) * Math.pow(safeWeight, 0.425);
  
  // Safety bounds: BSA should be between 0.3 and 3.5 m²
  return Math.max(0.3, Math.min(3.5, bsa));
};

export const safeCalculateDose = (
  baseDose: number,
  bsa: number,
  adjustmentFactor: number = 1
): number => {
  const safeBaseDose = safeParseFloat(baseDose);
  const safeBSA = safeParseFloat(bsa);
  const safeAdjustment = safeParseFloat(adjustmentFactor, 1);
  
  if (safeBaseDose <= 0 || safeBSA <= 0) return 0;
  
  const calculatedDose = safeBaseDose * safeBSA * safeAdjustment;
  
  // Safety bounds: calculated dose should not exceed reasonable limits
  return Math.max(0, Math.min(calculatedDose, safeBaseDose * 3.5 * 2)); // Max 2x standard dose for largest BSA
};

export const performDoseSafetyCheck = (
  drug: Drug,
  calculatedDose: number,
  patient: PatientInfo
): SafetyAlert[] => {
  const alerts: SafetyAlert[] = [];
  const safeDose = safeParseFloat(calculatedDose);
  const safeBaseDose = safeParseFloat(drug.dosage);
  
  if (safeDose <= 0) {
    alerts.push({
      id: `dose-zero-${drug.name}`,
      severity: 'critical',
      category: 'dose',
      message: `${drug.name}: Calculated dose is zero or negative`,
      recommendation: 'Verify patient parameters and base dose calculation',
      drugNames: [drug.name]
    });
    return alerts;
  }

  // Dose range safety checks
  const doseRatio = safeDivide(safeDose, safeBaseDose);
  
  if (doseRatio > 2.0) {
    alerts.push({
      id: `dose-high-${drug.name}`,
      severity: 'critical',
      category: 'dose',
      message: `${drug.name}: Dose exceeds 200% of standard (${safeDose.toFixed(1)} mg)`,
      recommendation: 'Consider BSA capping or dose reduction protocols',
      drugNames: [drug.name]
    });
  } else if (doseRatio > 1.5) {
    alerts.push({
      id: `dose-elevated-${drug.name}`,
      severity: 'high',
      category: 'dose',
      message: `${drug.name}: Dose is 150%+ of standard (${safeDose.toFixed(1)} mg)`,
      recommendation: 'Consider dose capping at BSA 2.2 m² if appropriate',
      drugNames: [drug.name]
    });
  }

  if (doseRatio < 0.5) {
    alerts.push({
      id: `dose-low-${drug.name}`,
      severity: 'high',
      category: 'dose',
      message: `${drug.name}: Dose is <50% of standard (${safeDose.toFixed(1)} mg)`,
      recommendation: 'Verify calculation and patient parameters',
      drugNames: [drug.name]
    });
  }

  // Drug-specific safety checks
  const drugName = drug.name.toLowerCase();
  
  if (drugName.includes('doxorubicin') && safeDose > 100) {
    alerts.push({
      id: `cardiotox-${drug.name}`,
      severity: 'moderate',
      category: 'monitoring',
      message: `${drug.name}: High dose detected (${safeDose.toFixed(1)} mg)`,
      recommendation: 'Monitor cumulative dose and cardiac function (ECHO/MUGA)',
      drugNames: [drug.name]
    });
  }

  if (drugName.includes('cisplatin') && patient.creatinineClearance < 60) {
    alerts.push({
      id: `nephrotox-${drug.name}`,
      severity: 'high',
      category: 'contraindication',
      message: `${drug.name}: Renal impairment detected (CrCl: ${patient.creatinineClearance} mL/min)`,
      recommendation: 'Consider carboplatin substitution or dose reduction',
      drugNames: [drug.name]
    });
  }

  if (drugName.includes('carboplatin')) {
    // Calvert formula check for carboplatin
    const targetAUC = 5; // Typical AUC target
    const calvertDose = targetAUC * (patient.creatinineClearance + 25);
    
    if (Math.abs(safeDose - calvertDose) > calvertDose * 0.2) {
      alerts.push({
        id: `calvert-${drug.name}`,
        severity: 'moderate',
        category: 'calculation',
        message: `${drug.name}: Dose differs from Calvert formula (calculated: ${calvertDose.toFixed(1)} mg)`,
        recommendation: 'Consider using Calvert formula for carboplatin dosing',
        drugNames: [drug.name]
      });
    }
  }

  return alerts;
};

export const performPatientSafetyCheck = (patient: PatientInfo): SafetyAlert[] => {
  const alerts: SafetyAlert[] = [];
  
  // Age-based checks
  if (patient.age < 18) {
    alerts.push({
      id: 'pediatric-patient',
      severity: 'high',
      category: 'contraindication',
      message: 'Pediatric patient detected',
      recommendation: 'Verify pediatric-specific dosing protocols and consider pediatric oncology consultation'
    });
  } else if (patient.age > 75) {
    alerts.push({
      id: 'elderly-patient',
      severity: 'moderate',
      category: 'monitoring',
      message: 'Elderly patient (>75 years)',
      recommendation: 'Consider dose reduction and enhanced monitoring for toxicity'
    });
  }

  // BSA checks
  if (patient.bsa > 2.2) {
    alerts.push({
      id: 'high-bsa',
      severity: 'moderate',
      category: 'dose',
      message: `High BSA detected (${patient.bsa.toFixed(2)} m²)`,
      recommendation: 'Consider dose capping at BSA 2.2 m² for certain agents'
    });
  } else if (patient.bsa < 1.0) {
    alerts.push({
      id: 'low-bsa',
      severity: 'moderate',
      category: 'dose',
      message: `Low BSA detected (${patient.bsa.toFixed(2)} m²)`,
      recommendation: 'Verify patient parameters and consider pediatric protocols if appropriate'
    });
  }

  // Renal function checks
  if (patient.creatinineClearance < 30) {
    alerts.push({
      id: 'severe-renal-impairment',
      severity: 'critical',
      category: 'contraindication',
      message: `Severe renal impairment (CrCl: ${patient.creatinineClearance} mL/min)`,
      recommendation: 'Avoid nephrotoxic agents and consider dose reduction for renally cleared drugs'
    });
  } else if (patient.creatinineClearance < 60) {
    alerts.push({
      id: 'moderate-renal-impairment',
      severity: 'high',
      category: 'monitoring',
      message: `Moderate renal impairment (CrCl: ${patient.creatinineClearance} mL/min)`,
      recommendation: 'Monitor renal function closely and consider dose adjustments'
    });
  }

  return alerts;
};

export const performRegimenSafetyCheck = (
  regimen: Regimen,
  patient: PatientInfo,
  calculatedDoses: Record<string, number>
): SafetyCheckResult => {
  let allAlerts: SafetyAlert[] = [];
  
  try {
    // Patient safety checks
    allAlerts.push(...performPatientSafetyCheck(patient));
    
    // Individual drug safety checks
    regimen.drugs.forEach(drug => {
      const calculatedDose = calculatedDoses[drug.name] || 0;
      allAlerts.push(...performDoseSafetyCheck(drug, calculatedDose, patient));
    });
    
    // Regimen-specific checks
    const regimenAlerts = performRegimenSpecificChecks(regimen, patient);
    allAlerts.push(...regimenAlerts);
    
    // Sort alerts by severity
    allAlerts.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, moderate: 2, low: 1, info: 0 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
    
  } catch (error) {
    allAlerts.push({
      id: 'safety-check-error',
      severity: 'critical',
      category: 'calculation',
      message: 'Error occurred during safety check',
      recommendation: 'Manual verification required - safety check failed'
    });
  }
  
  const criticalAlerts = allAlerts.filter(alert => alert.severity === 'critical');
  
  return {
    passed: criticalAlerts.length === 0,
    alerts: allAlerts,
    calculations: calculatedDoses
  };
};

const performRegimenSpecificChecks = (regimen: Regimen, patient: PatientInfo): SafetyAlert[] => {
  const alerts: SafetyAlert[] = [];
  const drugNames = regimen.drugs.map(d => d.name.toLowerCase());
  
  // Anthracycline + Trastuzumab combination check
  const hasAnthracycline = drugNames.some(name => 
    name.includes('doxorubicin') || name.includes('epirubicin')
  );
  const hasTrastuzumab = drugNames.some(name => name.includes('trastuzumab'));
  
  if (hasAnthracycline && hasTrastuzumab) {
    alerts.push({
      id: 'anthracycline-trastuzumab',
      severity: 'high',
      category: 'monitoring',
      message: 'Anthracycline + Trastuzumab combination detected',
      recommendation: 'Enhanced cardiac monitoring required (baseline and serial ECHO/MUGA)'
    });
  }
  
  // Platinum + taxane combination
  const hasPlatinum = drugNames.some(name => 
    name.includes('cisplatin') || name.includes('carboplatin')
  );
  const hasTaxane = drugNames.some(name => 
    name.includes('paclitaxel') || name.includes('docetaxel')
  );
  
  if (hasPlatinum && hasTaxane) {
    alerts.push({
      id: 'platinum-taxane',
      severity: 'moderate',
      category: 'monitoring',
      message: 'Platinum + Taxane combination',
      recommendation: 'Monitor for enhanced peripheral neuropathy and ototoxicity'
    });
  }
  
  return alerts;
};