import { describe, it, expect, beforeEach } from 'vitest';
import { calculateCompleteDose } from '@/utils/doseCalculations';
import { Drug } from '@/types/regimens';

describe('Carboplatin Duplicate Display Fix', () => {
  const carboplatinAUC5: Drug = {
    name: 'Carboplatin',
    dosage: 'AUC5',
    unit: 'AUC',
    route: 'IV',
    day: 'Day 1',
    administrationDuration: '60 min'
  };

  const mockPatientData = {
    bsa: 1.8,
    weight: 70,
    age: 55,
    creatinineClearance: 80
  };

  it('should return identical calculatedDose and finalDose for Carboplatin AUC', () => {
    const result = calculateCompleteDose(
      carboplatinAUC5,
      mockPatientData.bsa,
      mockPatientData.weight,
      mockPatientData.age,
      mockPatientData.creatinineClearance
    );

    // For AUC drugs, calculatedDose and finalDose should be identical
    expect(result.calculatedDose).toBe(result.finalDose);
    
    // Expected dose for AUC5 with GFR 80: 5 × (80 + 25) = 525 mg
    expect(result.finalDose).toBe(525);
  });

  it('should calculate correct dose for different GFR values', () => {
    // Test with GFR 60
    const resultGFR60 = calculateCompleteDose(
      carboplatinAUC5,
      mockPatientData.bsa,
      mockPatientData.weight,
      mockPatientData.age,
      60 // GFR
    );

    // Expected dose for AUC5 with GFR 60: 5 × (60 + 25) = 425 mg
    expect(resultGFR60.finalDose).toBe(425);
    expect(resultGFR60.calculatedDose).toBe(resultGFR60.finalDose);
  });

  it('should handle different AUC values correctly', () => {
    const carboplatinAUC6: Drug = {
      ...carboplatinAUC5,
      dosage: 'AUC6'
    };

    const result = calculateCompleteDose(
      carboplatinAUC6,
      mockPatientData.bsa,
      mockPatientData.weight,
      mockPatientData.age,
      mockPatientData.creatinineClearance
    );

    // Expected dose for AUC6 with GFR 80: 6 × (80 + 25) = 630 mg
    expect(result.finalDose).toBe(630);
    expect(result.calculatedDose).toBe(result.finalDose);
  });

  it('should not affect non-AUC drugs', () => {
    const paclitaxel: Drug = {
      name: 'Paclitaxel',
      dosage: '175',
      unit: 'mg/m²',
      route: 'IV',
      day: 'Day 1',
      administrationDuration: '3 h'
    };

    const result = calculateCompleteDose(
      paclitaxel,
      mockPatientData.bsa,
      mockPatientData.weight,
      mockPatientData.age,
      mockPatientData.creatinineClearance
    );

    // For mg/m² drugs, calculatedDose and finalDose should be identical (after rounding)
    expect(result.calculatedDose).toBe(result.finalDose);
    
    // Expected dose for Paclitaxel 175 mg/m² with BSA 1.8: 175 × 1.8 = 315 mg
    expect(result.finalDose).toBe(315);
  });
});