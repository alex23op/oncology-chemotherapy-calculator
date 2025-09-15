import { Drug } from '@/types/regimens';
import { logger } from './logger';

/**
 * Enhanced logging for Carboplatin dose calculations
 */
export const logCarboplatinCalculation = (
  drug: Drug,
  bsa: number,
  weight: number,
  age: number,
  gfr: number,
  calculatedDose: number,
  finalDose: number
) => {
  if (drug.name === 'Carboplatin') {
    logger.info('Carboplatin Dose Calculation', {
      drugName: drug.name,
      originalDosage: drug.dosage,
      unit: drug.unit,
      patientBSA: bsa,
      patientWeight: weight,
      patientAge: age,
      patientGFR: gfr,
      calculatedDose,
      finalDose,
      formula: 'Calvert: AUC × (GFR + 25)',
      timestamp: new Date().toISOString()
    });

    if (finalDose === 0) {
      logger.error('Carboplatin dose calculation resulted in 0mg', {
        drug,
        patientData: { bsa, weight, age, gfr }
      });
    }
  }
};

/**
 * Log regimen analysis for debugging
 */
export const analyzeCarboplatinRegimens = (regimens: any[]) => {
  const carboplatinRegimens = regimens.filter(r => 
    r.drugs?.some((d: Drug) => d.name === 'Carboplatin')
  );

  logger.info('Carboplatin regimens analysis', {
    totalRegimens: regimens.length,
    carboplatinRegimens: carboplatinRegimens.length,
    regimensWithCarboplatin: carboplatinRegimens.map(r => ({
      id: r.id,
      name: r.name,
      carboplatinDrugs: r.drugs.filter((d: Drug) => d.name === 'Carboplatin')
    }))
  });
};