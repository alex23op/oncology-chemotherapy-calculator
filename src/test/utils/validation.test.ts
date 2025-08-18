import { describe, it, expect } from 'vitest';
import { 
  validateTreatmentData, 
  validateSolventCompatibility,
  SOLVENT_COMPATIBILITY,
  TreatmentDataSchema 
} from '@/utils/validation';

describe('validation utilities', () => {
  describe('validateTreatmentData', () => {
    it('validates complete treatment data correctly', () => {
      const validData = {
        patient: {
          cnp: '1234567890123',
          fullName: 'Test Patient',
          weight: 70,
          height: 175,
          age: 45,
          sex: 'M',
          bsa: 1.85,
          creatinineClearance: 90,
          cycleNumber: 1,
          treatmentDate: '2024-01-15'
        },
        regimen: {
          id: 'test-001',
          name: 'Test Regimen',
          description: 'Test regimen description',
          category: 'adjuvant',
          drugs: [{
            name: 'Carboplatin',
            dosage: 'AUC 6',
            unit: 'AUC',
            route: 'IV',
            day: 'Day 1'
          }]
        },
        calculatedDrugs: [{
          name: 'Carboplatin',
          calculatedDose: '750',
          finalDose: '750',
          unit: 'mg',
          route: 'IV',
          solvent: 'Dextrose 5%'
        }],
        emetogenicRisk: {
          level: 'moderate',
          justification: 'Carboplatin AUC 6',
          acuteRisk: 'Moderate',
          delayedRisk: 'Low'
        },
        premedications: {
          antiemetics: [],
          infusionReactionProphylaxis: [],
          gastroprotection: [],
          organProtection: [],
          other: []
        },
        clinicalNotes: 'Test notes'
      };
      
      const result = validateTreatmentData(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('rejects invalid treatment data', () => {
      const invalidData = {
        patient: {
          weight: -10, // Invalid negative weight
          height: 175,
          age: 200, // Invalid age > 150
          sex: 'invalid', // Invalid sex
          bsa: -1, // Invalid negative BSA
          creatinineClearance: -50 // Invalid negative clearance
        },
        regimen: {
          id: '', // Empty ID
          name: '', // Empty name
          drugs: [] // Empty drugs array
        }
      };
      
      const result = validateTreatmentData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });
  });

  describe('validateSolventCompatibility', () => {
    it('allows compatible drug-solvent combinations', () => {
      const result = validateSolventCompatibility('Oxaliplatin', 'Dextrose 5%');
      expect(result).toBeNull();
    });

    it('rejects incompatible drug-solvent combinations', () => {
      const result = validateSolventCompatibility('Oxaliplatin', 'Normal Saline 0.9%');
      expect(result).toContain('not compatible');
      expect(result).toContain('Oxaliplatin');
      expect(result).toContain('Normal Saline 0.9%');
    });

    it('allows any solvent for drugs without restrictions', () => {
      const result = validateSolventCompatibility('UnknownDrug', 'Any Solvent');
      expect(result).toBeNull();
    });

    it('validates all defined drug-solvent compatibility rules', () => {
      // Test known compatible combinations
      expect(validateSolventCompatibility('Cisplatin', 'Normal Saline 0.9%')).toBeNull();
      expect(validateSolventCompatibility('Carboplatin', 'Dextrose 5%')).toBeNull();
      expect(validateSolventCompatibility('Paclitaxel', 'Normal Saline 0.9%')).toBeNull();
      expect(validateSolventCompatibility('Gemcitabine', 'Normal Saline 0.9%')).toBeNull();
      
      // Test known incompatible combinations
      expect(validateSolventCompatibility('Gemcitabine', 'Dextrose 5%')).toContain('not compatible');
    });
  });

  describe('SOLVENT_COMPATIBILITY', () => {
    it('contains expected drug entries', () => {
      expect(SOLVENT_COMPATIBILITY).toHaveProperty('Oxaliplatin');
      expect(SOLVENT_COMPATIBILITY).toHaveProperty('Cisplatin');
      expect(SOLVENT_COMPATIBILITY).toHaveProperty('Carboplatin');
      expect(SOLVENT_COMPATIBILITY).toHaveProperty('Paclitaxel');
      expect(SOLVENT_COMPATIBILITY).toHaveProperty('Gemcitabine');
    });

    it('has valid solvent arrays for each drug', () => {
      Object.entries(SOLVENT_COMPATIBILITY).forEach(([drug, solvents]) => {
        expect(Array.isArray(solvents)).toBe(true);
        expect(solvents.length).toBeGreaterThan(0);
        solvents.forEach(solvent => {
          expect(typeof solvent).toBe('string');
          expect(solvent.length).toBeGreaterThan(0);
        });
      });
    });
  });
});