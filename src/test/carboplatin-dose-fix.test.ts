import { describe, it, expect } from 'vitest';
import { 
  calculateCompleteDose,
  parseAUCValue,
  isAUCBasedDrug,
  validateAUCFormat 
} from '@/utils/doseCalculations';
import { Drug } from '@/types/regimens';

describe('Carboplatin Dose Calculation Fix', () => {
  const mockPatientData = {
    bsa: 1.8,
    weight: 70,
    age: 60,
    creatinineClearance: 80
  };

  describe('parseAUCValue function', () => {
    it('should parse AUC values correctly from various formats', () => {
      expect(parseAUCValue('AUC5')).toBe(5);
      expect(parseAUCValue('AUC 6')).toBe(6);
      expect(parseAUCValue('AUC4.5')).toBe(4.5);
      expect(parseAUCValue('AUC 1.5')).toBe(1.5);
      expect(parseAUCValue('auc2')).toBe(2); // case insensitive
    });

    it('should return 0 for invalid formats', () => {
      expect(parseAUCValue('invalid')).toBe(0);
      expect(parseAUCValue('AUC')).toBe(0);
      expect(parseAUCValue('')).toBe(0);
    });
  });

  describe('isAUCBasedDrug function', () => {
    it('should identify AUC-based drugs correctly', () => {
      const aucDrug1: Drug = { name: 'Carboplatin', dosage: 'AUC5', unit: 'AUC', route: 'IV' };
      const aucDrug2: Drug = { name: 'Carboplatin', dosage: 'AUC 6', unit: '', route: 'IV' };
      const regularDrug: Drug = { name: 'Paclitaxel', dosage: '175', unit: 'mg/m²', route: 'IV' };

      expect(isAUCBasedDrug(aucDrug1)).toBe(true);
      expect(isAUCBasedDrug(aucDrug2)).toBe(true);
      expect(isAUCBasedDrug(regularDrug)).toBe(false);
    });
  });

  describe('Carboplatin dose calculation with Calvert formula', () => {
    it('should calculate correct dose for AUC5 with GFR 80', () => {
      const drug: Drug = {
        name: 'Carboplatin',
        dosage: 'AUC5',
        unit: 'AUC',
        route: 'IV'
      };

      const result = calculateCompleteDose(
        drug,
        mockPatientData.bsa,
        mockPatientData.weight,
        mockPatientData.age,
        mockPatientData.creatinineClearance
      );

      // Expected: 5 × (80 + 25) = 525 mg
      expect(result.finalDose).toBe(525);
    });

    it('should calculate correct dose for AUC6 with GFR 60', () => {
      const drug: Drug = {
        name: 'Carboplatin',
        dosage: 'AUC6',
        unit: 'AUC',
        route: 'IV'
      };

      const result = calculateCompleteDose(
        drug,
        mockPatientData.bsa,
        mockPatientData.weight,
        mockPatientData.age,
        60 // Different GFR
      );

      // Expected: 6 × (60 + 25) = 510 mg
      expect(result.finalDose).toBe(510);
    });

    it('should work with space in dosage format', () => {
      const drug: Drug = {
        name: 'Carboplatin',
        dosage: 'AUC 4.5',
        unit: 'AUC',
        route: 'IV'
      };

      const result = calculateCompleteDose(
        drug,
        mockPatientData.bsa,
        mockPatientData.weight,
        mockPatientData.age,
        mockPatientData.creatinineClearance
      );

      // Expected: 4.5 × (80 + 25) = 472.5 mg
      expect(result.finalDose).toBe(472.5);
    });

    it('should work with empty unit field but AUC in dosage', () => {
      const drug: Drug = {
        name: 'Carboplatin',
        dosage: 'AUC 2',
        unit: '', // Empty unit like in original breastCancer.ts
        route: 'IV'
      };

      const result = calculateCompleteDose(
        drug,
        mockPatientData.bsa,
        mockPatientData.weight,
        mockPatientData.age,
        mockPatientData.creatinineClearance
      );

      // Expected: 2 × (80 + 25) = 210 mg
      expect(result.finalDose).toBe(210);
    });

    it('should cap GFR at 125 for safety', () => {
      const drug: Drug = {
        name: 'Carboplatin',
        dosage: 'AUC5',
        unit: 'AUC',
        route: 'IV'
      };

      const result = calculateCompleteDose(
        drug,
        mockPatientData.bsa,
        mockPatientData.weight,
        mockPatientData.age,
        200 // High GFR that should be capped
      );

      // Expected: 5 × (125 + 25) = 750 mg (capped at GFR 125)
      expect(result.finalDose).toBe(750);
    });
  });

  describe('Real regimen scenarios', () => {
    it('should work for breast cancer TCAP regimen Carboplatin', () => {
      const carboplatin: Drug = {
        name: 'Carboplatin',
        dosage: 'AUC6',
        unit: 'AUC',
        route: 'IV',
        day: 'Day 1',
        dilution: '5% Dextrose or Normal saline 250-500mL',
        administrationDuration: '30-60 minutes'
      };

      const result = calculateCompleteDose(
        carboplatin,
        1.75, // BSA
        65,   // weight
        55,   // age
        85    // GFR
      );

      // Expected: 6 × (85 + 25) = 660 mg
      expect(result.finalDose).toBe(660);
      expect(result.calculatedDose).toBe(660);
    });

    it('should work for gynecology regimens', () => {
      const carboplatin: Drug = {
        name: 'Carboplatin',
        dosage: 'AUC5',
        unit: 'AUC',
        route: 'IV',
        day: 'Day 1',
        administrationDuration: '60 min'
      };

      const result = calculateCompleteDose(
        carboplatin,
        1.9, // BSA
        75,  // weight
        50,  // age
        95   // GFR
      );

      // Expected: 5 × (95 + 25) = 600 mg
      expect(result.finalDose).toBe(600);
    });

    it('should never return 0 for valid Carboplatin regimens', () => {
      const testCases = [
        { dosage: 'AUC5', unit: 'AUC' },
        { dosage: 'AUC6', unit: 'AUC' },
        { dosage: 'AUC 6', unit: '' },
        { dosage: 'AUC4.5', unit: 'AUC' },
        { dosage: 'AUC 1.5', unit: 'AUC' }
      ];

      testCases.forEach(({ dosage, unit }) => {
        const drug: Drug = {
          name: 'Carboplatin',
          dosage,
          unit,
          route: 'IV'
        };

        const result = calculateCompleteDose(
          drug,
          mockPatientData.bsa,
          mockPatientData.weight,
          mockPatientData.age,
          mockPatientData.creatinineClearance
        );

        expect(result.finalDose).toBeGreaterThan(0);
        expect(result.calculatedDose).toBeGreaterThan(0);
      });
    });
  });

  describe('AUC validation', () => {
    it('should validate AUC formats correctly', () => {
      expect(validateAUCFormat('AUC5').isValid).toBe(true);
      expect(validateAUCFormat('AUC6').isValid).toBe(true);
      expect(validateAUCFormat('AUC4.5').isValid).toBe(true);
      
      expect(validateAUCFormat('invalid').isValid).toBe(false);
      expect(validateAUCFormat('AUC5-6').isValid).toBe(false);
      expect(validateAUCFormat('AUC').isValid).toBe(false);
    });
  });
});