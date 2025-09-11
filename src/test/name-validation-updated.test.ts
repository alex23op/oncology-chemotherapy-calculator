import { describe, it, expect } from 'vitest';
import { sanitizeName, validateFirstName, validateLastName, getFullName } from '@/utils/inputValidation';

describe('Name Validation Tests', () => {
  describe('sanitizeName function', () => {
    it('should preserve single spaces between words', () => {
      const input = 'Ion Popescu';
      const result = sanitizeName(input);
      expect(result).toBe('Ion Popescu');
      expect(result.includes(' ')).toBe(true);
    });

    it('should preserve spaces in multi-word names', () => {
      const input = 'Ion Mihai Popescu';
      const result = sanitizeName(input);
      expect(result).toBe('Ion Mihai Popescu');
      expect(result.split(' ').length).toBe(3);
    });

    it('should normalize multiple spaces to single spaces', () => {
      const input = 'Ion    Popescu';
      const result = sanitizeName(input);
      expect(result).toBe('Ion Popescu');
    });

    it('should allow hyphens in names', () => {
      const input = 'Ana-Maria Ionescu';
      const result = sanitizeName(input);
      expect(result).toBe('Ana-Maria Ionescu');
      expect(result.includes('-')).toBe(true);
      expect(result.includes(' ')).toBe(true);
    });

    it('should allow apostrophes in names', () => {
      const input = "Ion O'Connor";
      const result = sanitizeName(input);
      expect(result).toBe("Ion O'Connor");
    });

    it('should remove numbers from names', () => {
      const input = 'Ion123 Popescu';
      const result = sanitizeName(input);
      expect(result).toBe('Ion Popescu');
    });

    it('should remove special characters but keep spaces', () => {
      const input = 'Ion@#$ Popescu';
      const result = sanitizeName(input);
      expect(result).toBe('Ion Popescu');
    });

    it('should handle Romanian characters correctly', () => {
      const input = 'Ștefan Ânghelescu-Cătănă';
      const result = sanitizeName(input);
      expect(result).toBe('Ștefan Ânghelescu-Cătănă');
    });

    it('should trim leading and trailing spaces', () => {
      const input = '  Ion Popescu  ';
      const result = sanitizeName(input);
      expect(result).toBe('Ion Popescu');
    });

    it('should handle empty strings', () => {
      expect(sanitizeName('')).toBe('');
      expect(sanitizeName('   ')).toBe('');
    });
  });

  describe('validateFirstName function', () => {
    it('should validate correct first names', () => {
      const validation = validateFirstName('Ion');
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should validate hyphenated first names', () => {
      const validation = validateFirstName('Ana-Maria');
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should reject first names with numbers', () => {
      const validation = validateFirstName('Ion123');
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Prenumele nu poate conține cifre');
    });

    it('should reject first names with special characters', () => {
      const validation = validateFirstName('Ion@');
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Prenumele conține caractere nevalide');
    });

    it('should reject empty first names', () => {
      const validation = validateFirstName('');
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Prenumele este obligatoriu');
    });

    it('should reject very short first names', () => {
      const validation = validateFirstName('I');
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Prenumele trebuie să conțină cel puțin 2 caractere');
    });

    it('should handle Romanian characters in first names', () => {
      const validation = validateFirstName('Ștefan');
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });
  });

  describe('validateLastName function', () => {
    it('should validate correct last names', () => {
      const validation = validateLastName('Popescu');
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should validate hyphenated last names', () => {
      const validation = validateLastName('Ionescu-Popescu');
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should reject last names with numbers', () => {
      const validation = validateLastName('Popescu123');
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Numele de familie nu poate conține cifre');
    });

    it('should reject last names with special characters', () => {
      const validation = validateLastName('Popescu@');
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Numele de familie conține caractere nevalide');
    });

    it('should reject empty last names', () => {
      const validation = validateLastName('');
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Numele de familie este obligatoriu');
    });

    it('should reject very short last names', () => {
      const validation = validateLastName('P');
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Numele de familie trebuie să conțină cel puțin 2 caractere');
    });

    it('should handle Romanian characters in last names', () => {
      const validation = validateLastName('Ânghelescu');
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });
  });

  describe('getFullName function', () => {
    it('should concatenate first and last names correctly', () => {
      expect(getFullName('Ion', 'Popescu')).toBe('Ion Popescu');
    });

    it('should handle empty first name', () => {
      expect(getFullName('', 'Popescu')).toBe('Popescu');
    });

    it('should handle empty last name', () => {
      expect(getFullName('Ion', '')).toBe('Ion');
    });

    it('should handle both empty names', () => {
      expect(getFullName('', '')).toBe('');
    });

    it('should handle undefined parameters', () => {
      expect(getFullName()).toBe('');
    });

    it('should trim spaces', () => {
      expect(getFullName('  Ion  ', '  Popescu  ')).toBe('Ion Popescu');
    });
  });
});