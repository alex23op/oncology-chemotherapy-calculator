import { describe, it, expect } from 'vitest';
import { validateSolventType, AVAILABLE_SOLVENTS, SolventType } from '@/types/solvents';

describe('Solvent Type Validation', () => {
  it('should accept valid solvent types', () => {
    AVAILABLE_SOLVENTS.forEach(solvent => {
      expect(validateSolventType(solvent)).toBe(true);
    });
  });

  it('should accept null as valid solvent type', () => {
    expect(validateSolventType(null)).toBe(true);
  });

  it('should reject invalid solvent types', () => {
    const invalidSolvents = [
      'Invalid Solvent',
      'Normal Saline 0.45%', // Different concentration
      'Glucose 10%', // Different concentration
      'Lactated Ringers', // Different name
      'Sterile Water' // Different name
    ];

    invalidSolvents.forEach(solvent => {
      expect(validateSolventType(solvent)).toBe(false);
    });
  });

  it('should have exactly 7 available solvents', () => {
    expect(AVAILABLE_SOLVENTS).toHaveLength(7);
    expect(AVAILABLE_SOLVENTS).toContain('Soluție glucoză 5% 100ml');
    expect(AVAILABLE_SOLVENTS).toContain('Soluție glucoză 5% 250ml');
    expect(AVAILABLE_SOLVENTS).toContain('Soluție glucoză 5% 500ml');
    expect(AVAILABLE_SOLVENTS).toContain('Soluție NaCl 0.9% 100ml');
    expect(AVAILABLE_SOLVENTS).toContain('Soluție NaCl 0.9% 250ml');
    expect(AVAILABLE_SOLVENTS).toContain('Soluție NaCl 0.9% 500ml');
    expect(AVAILABLE_SOLVENTS).toContain('Water for Injection');
  });

  it('should maintain type safety for SolventType', () => {
    // Type-only test - this ensures the union type is correctly defined
    const validSolvent: SolventType = 'Soluție NaCl 0.9% 250ml';
    const nullSolvent: SolventType = null;
    
    expect(typeof validSolvent).toBe('string');
    expect(nullSolvent).toBe(null);
  });
});