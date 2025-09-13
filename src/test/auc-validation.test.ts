import { describe, it, expect } from 'vitest';
import { calculateAUCDose, calculateCompleteDose, validateAUCFormat } from '@/utils/doseCalculations';
import { gynaecologyRegimens } from '@/data/regimens/gynaecology';
import { lungCancerRegimens } from '@/data/regimens/lungCancer';
import { Drug } from '@/types/regimens';

describe('AUC Validation and Calvert Formula Tests', () => {
  describe('AUC Format Validation', () => {
    it('should validate correct AUC formats', () => {
      const validFormats = ['AUC5', 'AUC6', 'AUC4.5', 'AUC7'];
      
      validFormats.forEach(format => {
        const result = validateAUCFormat(format);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('should reject invalid AUC formats', () => {
      const invalidFormats = ['AUC5-6', 'AUC5-7.5', 'AUC6-7', 'AUCabc', 'AUC'];
      
      invalidFormats.forEach(format => {
        const result = validateAUCFormat(format);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeDefined();
      });
    });

    it('should detect multiple AUC values in ranges', () => {
      const multipleValues = ['AUC5-6', 'AUC5-7.5', 'AUC6-7'];
      
      multipleValues.forEach(value => {
        const result = validateAUCFormat(value);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('Multiple AUC values not allowed');
      });
    });
  });

  describe('Calvert Formula Calculations', () => {
    const carboplatinDrug: Drug = {
      name: 'Carboplatin',
      dosage: 'AUC5',
      unit: 'AUC',
      route: 'IV',
      day: 'Day 1'
    };

    it('should calculate correct dose using Calvert formula: Dose = AUC × (GFR + 25)', () => {
      // Test case 1: GFR=80, AUC=5 → Dose = 5 × (80+25) = 525 mg
      const dose1 = calculateAUCDose(carboplatinDrug, 5, 80);
      expect(dose1).toBe(525);

      // Test case 2: GFR=60, AUC=6 → Dose = 6 × (60+25) = 510 mg
      const carboplatinAUC6: Drug = { ...carboplatinDrug, dosage: 'AUC6' };
      const dose2 = calculateAUCDose(carboplatinAUC6, 6, 60);
      expect(dose2).toBe(510);

      // Test case 3: GFR=100, AUC=4.5 → Dose = 4.5 × (100+25) = 562.5 mg
      const carboplatinAUC45: Drug = { ...carboplatinDrug, dosage: 'AUC4.5' };
      const dose3 = calculateAUCDose(carboplatinAUC45, 4.5, 100);
      expect(dose3).toBe(562.5);
    });

    it('should cap GFR at 125 mL/min for safety', () => {
      // GFR=150 should be capped at 125: Dose = 5 × (125+25) = 750 mg
      const dose = calculateAUCDose(carboplatinDrug, 5, 150, true);
      expect(dose).toBe(750);

      // Test uncapped version
      const doseUncapped = calculateAUCDose(carboplatinDrug, 5, 150, false);
      expect(doseUncapped).toBe(875);
    });

    it('should handle edge cases correctly', () => {
      // Very low GFR
      const lowGFRDose = calculateAUCDose(carboplatinDrug, 5, 20);
      expect(lowGFRDose).toBe(225); // 5 × (20+25) = 225

      // Very high AUC
      const highAUCDrug: Drug = { ...carboplatinDrug, dosage: 'AUC7.5' };
      const highAUCDose = calculateAUCDose(highAUCDrug, 7.5, 80);
      expect(highAUCDose).toBe(787.5); // 7.5 × (80+25) = 787.5
    });
  });

  describe('Complete Dose Calculation with AUC', () => {
    it('should calculate complete dose correctly for Carboplatin with patient data', () => {
      const carboplatinDrug: Drug = {
        name: 'Carboplatin',
        dosage: 'AUC5',
        unit: 'AUC',
        route: 'IV',
        day: 'Day 1'
      };

      const result = calculateCompleteDose(
        carboplatinDrug,
        1.8, // BSA
        70,  // weight
        65,  // age
        80   // creatinine clearance (GFR)
      );

      // Expected: 5 × (80+25) = 525 mg
      expect(result.calculatedDose).toBe(525);
      expect(result.finalDose).toBe(525);
      expect(result.doseAlert).toBeUndefined();
    });

    it('should apply age adjustments for elderly patients with Carboplatin', () => {
      const carboplatinDrug: Drug = {
        name: 'Carboplatin',
        dosage: 'AUC5',
        unit: 'AUC',
        route: 'IV',
        day: 'Day 1'
      };

      const result = calculateCompleteDose(
        carboplatinDrug,
        1.8, // BSA
        70,  // weight
        75,  // age > 70
        80   // creatinine clearance
      );

      // Expected: 5 × (80+25) × 0.85 = 525 × 0.85 = 446.25 mg
      expect(result.calculatedDose).toBe(446.25);
      expect(Math.round(result.finalDose * 10) / 10).toBe(446.3);
    });
  });

  describe('Regimen AUC Validation', () => {
    it('should validate all gynaecology regimens with AUC have correct format', () => {
      const aucDrugs = gynaecologyRegimens
        .flatMap(regimen => regimen.drugs)
        .filter(drug => drug.unit === 'AUC');

      aucDrugs.forEach(drug => {
        const validation = validateAUCFormat(drug.dosage);
        expect(validation.isValid).toBe(true);
        
        // Should be parseable as number
        const aucValue = parseFloat(drug.dosage.replace(/^AUC/i, ''));
        expect(aucValue).toBeGreaterThan(0);
        expect(aucValue).toBeLessThanOrEqual(10); // Reasonable clinical range
      });
    });

    it('should validate all lung cancer regimens with AUC have correct format', () => {
      const aucDrugs = lungCancerRegimens
        .flatMap(regimen => regimen.drugs)
        .filter(drug => drug.unit === 'AUC');

      aucDrugs.forEach(drug => {
        const validation = validateAUCFormat(drug.dosage);
        expect(validation.isValid).toBe(true);
        
        // Should be parseable as number
        const aucValue = parseFloat(drug.dosage.replace(/^AUC/i, ''));
        expect(aucValue).toBeGreaterThan(0);
        expect(aucValue).toBeLessThanOrEqual(10); // Reasonable clinical range
      });
    });

    it('should confirm no multiple AUC values exist in any regimen', () => {
      const allRegimens = [...gynaecologyRegimens, ...lungCancerRegimens];
      const aucDrugs = allRegimens
        .flatMap(regimen => regimen.drugs)
        .filter(drug => drug.unit === 'AUC');

      aucDrugs.forEach(drug => {
        expect(drug.dosage).not.toMatch(/-/); // No dashes indicating ranges
        expect(drug.dosage).toMatch(/^AUC\d+(\.\d+)?$/); // Only AUC followed by number
      });
    });
  });

  describe('Clinical Validation Examples', () => {
    it('should calculate doses for common clinical scenarios', () => {
      const scenarios = [
        { gfr: 80, auc: 5, expected: 525, description: 'Standard adult patient' },
        { gfr: 60, auc: 6, expected: 510, description: 'Moderate renal function' },
        { gfr: 40, auc: 4, expected: 260, description: 'Reduced renal function' },
        { gfr: 125, auc: 5, expected: 750, description: 'Excellent renal function (capped)' },
        { gfr: 90, auc: 4.5, expected: 517.5, description: 'Reduced AUC target' }
      ];

      scenarios.forEach(scenario => {
        const drug: Drug = {
          name: 'Carboplatin',
          dosage: `AUC${scenario.auc}`,
          unit: 'AUC',
          route: 'IV',
          day: 'Day 1'
        };

        const dose = calculateAUCDose(drug, scenario.auc, scenario.gfr);
        expect(dose).toBe(scenario.expected);
      });
    });
  });
});