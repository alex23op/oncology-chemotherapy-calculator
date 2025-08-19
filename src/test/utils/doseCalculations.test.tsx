import { describe, it, expect } from 'vitest';
import {
  calculateBSADose,
  calculateWeightBasedDose,
  calculateAUCDose,
  applyAgeAdjustment,
  applyRenalAdjustment,
  validateConcentration,
  validateSolventCompatibility,
  calculateCompleteDose,
  calculateCumulativeDose
} from '@/utils/doseCalculations';
import { Drug } from '@/types/regimens';

describe('doseCalculations', () => {
  describe('calculateBSADose', () => {
    it('calculates BSA-based dose correctly', () => {
      const drug: Drug = {
        name: 'Doxorubicin',
        dosage: '60',
        unit: 'mg/m²',
        route: 'IV'
      };
      
      const result = calculateBSADose(drug, 1.8);
      expect(result).toBe(108); // 60 * 1.8
    });

    it('calculates g/m² doses correctly', () => {
      const drug: Drug = {
        name: 'Cyclophosphamide',
        dosage: '0.6',
        unit: 'g/m²',
        route: 'IV'
      };
      
      const result = calculateBSADose(drug, 1.8);
      expect(result).toBe(1.08); // 0.6 * 1.8
    });

    it('returns dosage for non-BSA units', () => {
      const drug: Drug = {
        name: 'Pembrolizumab',
        dosage: '200',
        unit: 'mg',
        route: 'IV'
      };
      
      const result = calculateBSADose(drug, 1.8);
      expect(result).toBe(200);
    });

    it('handles invalid dosage gracefully', () => {
      const drug: Drug = {
        name: 'Invalid',
        dosage: 'invalid',
        unit: 'mg/m²',
        route: 'IV'
      };
      
      const result = calculateBSADose(drug, 1.8);
      expect(result).toBe(0);
    });
  });

  describe('calculateWeightBasedDose', () => {
    it('calculates weight-based dose correctly', () => {
      const drug: Drug = {
        name: 'Bevacizumab',
        dosage: '5',
        unit: 'mg/kg',
        route: 'IV'
      };
      
      const result = calculateWeightBasedDose(drug, 70);
      expect(result).toBe(350); // 5 * 70
    });

    it('returns dosage for non-weight units', () => {
      const drug: Drug = {
        name: 'Rituximab',
        dosage: '375',
        unit: 'mg/m²',
        route: 'IV'
      };
      
      const result = calculateWeightBasedDose(drug, 70);
      expect(result).toBe(375);
    });
  });

  describe('calculateAUCDose', () => {
    it('calculates AUC dose using Calvert formula', () => {
      const drug: Drug = {
        name: 'Carboplatin',
        dosage: '6',
        unit: 'AUC',
        route: 'IV'
      };
      
      const result = calculateAUCDose(drug, 6, 100);
      expect(result).toBe(750); // 6 * (100 + 25)
    });

    it('caps GFR at 125 mL/min by default', () => {
      const drug: Drug = {
        name: 'Carboplatin',
        dosage: '6',
        unit: 'AUC',
        route: 'IV'
      };
      
      const result = calculateAUCDose(drug, 6, 150); // GFR > 125
      expect(result).toBe(900); // 6 * (125 + 25)
    });

    it('allows uncapped GFR when specified', () => {
      const drug: Drug = {
        name: 'Carboplatin',
        dosage: '6',
        unit: 'AUC',
        route: 'IV'
      };
      
      const result = calculateAUCDose(drug, 6, 150, false);
      expect(result).toBe(1050); // 6 * (150 + 25)
    });

    it('returns dosage for non-AUC units', () => {
      const drug: Drug = {
        name: 'Cisplatin',
        dosage: '75',
        unit: 'mg/m²',
        route: 'IV'
      };
      
      const result = calculateAUCDose(drug, 75, 100);
      expect(result).toBe(75);
    });
  });

  describe('applyAgeAdjustment', () => {
    it('applies 15% reduction for elderly patients with specific drugs', () => {
      const drug: Drug = {
        name: 'Doxorubicin',
        dosage: '60',
        unit: 'mg/m²',
        route: 'IV'
      };
      
      const result = applyAgeAdjustment(100, 75, drug);
      expect(result).toBe(85); // 100 * 0.85
    });

    it('does not adjust dose for younger patients', () => {
      const drug: Drug = {
        name: 'Doxorubicin',
        dosage: '60',
        unit: 'mg/m²',
        route: 'IV'
      };
      
      const result = applyAgeAdjustment(100, 50, drug);
      expect(result).toBe(100);
    });

    it('does not adjust dose for non-elderly-sensitive drugs', () => {
      const drug: Drug = {
        name: 'Pembrolizumab',
        dosage: '200',
        unit: 'mg',
        route: 'IV'
      };
      
      const result = applyAgeAdjustment(100, 75, drug);
      expect(result).toBe(100);
    });
  });

  describe('applyRenalAdjustment', () => {
    it('reduces Cisplatin dose by 50% for moderate renal impairment', () => {
      const drug: Drug = {
        name: 'Cisplatin',
        dosage: '75',
        unit: 'mg/m²',
        route: 'IV'
      };
      
      const result = applyRenalAdjustment(100, 45, drug);
      expect(result).toBe(50); // 50% reduction
    });

    it('contraindicates Cisplatin for severe renal impairment', () => {
      const drug: Drug = {
        name: 'Cisplatin',
        dosage: '75',
        unit: 'mg/m²',
        route: 'IV'
      };
      
      const result = applyRenalAdjustment(100, 25, drug);
      expect(result).toBe(0); // Contraindicated
    });

    it('reduces Capecitabine dose by 25% for moderate renal impairment', () => {
      const drug: Drug = {
        name: 'Capecitabine',
        dosage: '1000',
        unit: 'mg/m²',
        route: 'PO'
      };
      
      const result = applyRenalAdjustment(100, 40, drug);
      expect(result).toBe(75); // 25% reduction
    });

    it('contraindicates Pemetrexed for CrCl < 45', () => {
      const drug: Drug = {
        name: 'Pemetrexed',
        dosage: '500',
        unit: 'mg/m²',
        route: 'IV'
      };
      
      const result = applyRenalAdjustment(100, 40, drug);
      expect(result).toBe(0); // Contraindicated
    });

    it('does not adjust dose for drugs without renal adjustment', () => {
      const drug: Drug = {
        name: 'Doxorubicin',
        dosage: '60',
        unit: 'mg/m²',
        route: 'IV'
      };
      
      const result = applyRenalAdjustment(100, 30, drug);
      expect(result).toBe(100);
    });
  });

  describe('validateConcentration', () => {
    it('validates Paclitaxel concentration limits', () => {
      const drug: Drug = {
        name: 'Paclitaxel',
        dosage: '175',
        unit: 'mg/m²',
        route: 'IV'
      };
      
      // Too high concentration
      let result = validateConcentration(drug, 300, 100);
      expect(result).toContain('depășește limita de 1.2 mg/mL');
      
      // Too low concentration
      result = validateConcentration(drug, 100, 500);
      expect(result).toContain('sub limita minimă de 0.3 mg/mL');
      
      // Valid concentration
      result = validateConcentration(drug, 250, 250);
      expect(result).toBeNull();
    });

    it('validates Oxaliplatin minimum volume', () => {
      const drug: Drug = {
        name: 'Oxaliplatin',
        dosage: '85',
        unit: 'mg/m²',
        route: 'IV'
      };
      
      const result = validateConcentration(drug, 150, 200);
      expect(result).toContain('Volumul minim pentru Oxaliplatin este 250 mL');
    });

    it('returns null for valid concentrations', () => {
      const drug: Drug = {
        name: 'Doxorubicin',
        dosage: '60',
        unit: 'mg/m²',
        route: 'IV'
      };
      
      const result = validateConcentration(drug, 100, 250);
      expect(result).toBeNull();
    });

    it('handles zero or negative volumes', () => {
      const drug: Drug = {
        name: 'Paclitaxel',
        dosage: '175',
        unit: 'mg/m²',
        route: 'IV'
      };
      
      const result = validateConcentration(drug, 200, 0);
      expect(result).toBeNull();
    });
  });

  describe('validateSolventCompatibility', () => {
    it('validates compatible solvents', () => {
      const drug: Drug = {
        name: 'Oxaliplatin',
        dosage: '85',
        unit: 'mg/m²',
        route: 'IV',
        availableSolvents: ['D5W']
      };
      
      const result = validateSolventCompatibility(drug, 'D5W');
      expect(result).toBeNull();
    });

    it('detects incompatible solvents for Oxaliplatin', () => {
      const drug: Drug = {
        name: 'Oxaliplatin',
        dosage: '85',
        unit: 'mg/m²',
        route: 'IV',
        availableSolvents: ['D5W']
      };
      
      const result = validateSolventCompatibility(drug, 'NS');
      expect(result).toContain('doar Glucoză 5% (D5W) pentru stabilitate');
    });

    it('returns null for drugs without solvent restrictions', () => {
      const drug: Drug = {
        name: 'Doxorubicin',
        dosage: '60',
        unit: 'mg/m²',
        route: 'IV'
      };
      
      const result = validateSolventCompatibility(drug, 'NS');
      expect(result).toBeNull();
    });

    it('handles case-insensitive and normalized solvent names', () => {
      const drug: Drug = {
        name: 'Test Drug',
        dosage: '100',
        unit: 'mg/m²',
        route: 'IV',
        availableSolvents: ['Normal Saline 0.9%']
      };
      
      const result = validateSolventCompatibility(drug, 'ns');
      expect(result).toBeNull();
    });
  });

  describe('calculateCompleteDose', () => {
    it('performs complete dose calculation with all adjustments', () => {
      const drug: Drug = {
        name: 'Doxorubicin',
        dosage: '60',
        unit: 'mg/m²',
        route: 'IV'
      };
      
      const result = calculateCompleteDose(drug, 1.8, 70, 75, 90, 'q21d');
      
      expect(result.calculatedDose).toBe(91.8); // 60 * 1.8 * 0.85 (age adjustment)
      expect(result.finalDose).toBe(91.8);
      expect(result.reductionPercentage).toBe(0);
    });

    it('calculates AUC-based dose with GFR capping', () => {
      const drug: Drug = {
        name: 'Carboplatin',
        dosage: '6',
        unit: 'AUC',
        route: 'IV'
      };
      
      const result = calculateCompleteDose(drug, 1.8, 70, 60, 150, 'q21d');
      
      expect(result.calculatedDose).toBe(900); // 6 * (125 + 25), GFR capped at 125
    });

    it('includes dose alerts when limits are exceeded', () => {
      const drug: Drug = {
        name: 'Doxorubicin',
        dosage: '100', // Exceeds typical limit
        unit: 'mg/m²',
        route: 'IV'
      };
      
      const result = calculateCompleteDose(drug, 2.0, 80, 50, 100, 'q21d');
      
      expect(result.doseAlert).toBeDefined();
      expect(result.doseAlert?.isExceeded).toBe(true);
    });

    it('includes concentration alerts when provided', () => {
      const drug: Drug = {
        name: 'Paclitaxel',
        dosage: '175',
        unit: 'mg/m²',
        route: 'IV'
      };
      
      const result = calculateCompleteDose(drug, 2.0, 80, 50, 100, 'q3w', 100); // High concentration
      
      expect(result.concentrationAlert).toBeDefined();
      expect(result.concentrationAlert).toContain('depășește limita');
    });
  });

  describe('calculateCumulativeDose', () => {
    it('calculates cumulative dose correctly', () => {
      const drug: Drug = {
        name: 'Doxorubicin',
        dosage: '60',
        unit: 'mg/m²',
        route: 'IV'
      };
      
      const result = calculateCumulativeDose(drug, 108, 4); // 108 mg per cycle, 4 cycles
      
      expect(result.cumulativeDose).toBe(432);
      expect(result.isLimitExceeded).toBe(false);
    });

    it('detects when cumulative limit is exceeded', () => {
      const drug: Drug = {
        name: 'Doxorubicin',
        dosage: '60',
        unit: 'mg/m²',
        route: 'IV'
      };
      
      const result = calculateCumulativeDose(drug, 108, 6); // 648 mg total, exceeds 550 limit
      
      expect(result.cumulativeDose).toBe(648);
      expect(result.isLimitExceeded).toBe(true);
      expect(result.warning).toContain('depășește limita de 550');
    });

    it('handles drugs without cumulative limits', () => {
      const drug: Drug = {
        name: 'Pembrolizumab',
        dosage: '200',
        unit: 'mg',
        route: 'IV'
      };
      
      const result = calculateCumulativeDose(drug, 200, 10);
      
      expect(result.cumulativeDose).toBe(2000);
      expect(result.isLimitExceeded).toBe(false);
      expect(result.warning).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('handles zero BSA gracefully', () => {
      const drug: Drug = {
        name: 'Doxorubicin',
        dosage: '60',
        unit: 'mg/m²',
        route: 'IV'
      };
      
      const result = calculateBSADose(drug, 0);
      expect(result).toBe(0);
    });

    it('handles negative values gracefully', () => {
      const drug: Drug = {
        name: 'Doxorubicin',
        dosage: '60',
        unit: 'mg/m²',
        route: 'IV'
      };
      
      const result = calculateCompleteDose(drug, -1, -70, -30, -50);
      expect(result.calculatedDose).toBeGreaterThanOrEqual(0);
    });

    it('handles missing drug properties', () => {
      const drug: Drug = {
        name: '',
        dosage: '',
        unit: 'mg/m²',
        route: 'IV'
      };
      
      const result = calculateCompleteDose(drug, 1.8, 70, 60, 90);
      expect(result.calculatedDose).toBe(0);
    });
  });
});