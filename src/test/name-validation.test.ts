import { describe, it, expect } from 'vitest';
import { sanitizeName, validateFullName } from '@/utils/inputValidation';

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

  describe('validateFullName function', () => {
    it('should validate correct names with spaces', () => {
      const validation = validateFullName('Ion Popescu');
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should validate multi-word names', () => {
      const validation = validateFullName('Ion Mihai Popescu');
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should validate hyphenated names', () => {
      const validation = validateFullName('Ana-Maria Ionescu');
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should reject names with numbers', () => {
      const validation = validateFullName('Ion123 Popescu');
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Numele nu poate conține cifre');
    });

    it('should reject names with special characters', () => {
      const validation = validateFullName('Ion@Popescu');
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Numele conține caractere nevalide');
    });

    it('should warn about single word names', () => {
      const validation = validateFullName('Ion');
      expect(validation.isValid).toBe(true); // Still valid but with warning
      expect(validation.warnings).toContain('Vă rugăm să introduceți atât numele cât și prenumele');
    });

    it('should reject empty names', () => {
      const validation = validateFullName('');
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Numele și prenumele sunt obligatorii');
    });

    it('should reject very short names', () => {
      const validation = validateFullName('I');
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Numele trebuie să conțină cel puțin 2 caractere');
    });

    it('should handle Romanian characters in validation', () => {
      const validation = validateFullName('Ștefan Ânghelescu');
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });
  });
});