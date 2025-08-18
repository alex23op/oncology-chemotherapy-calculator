// Enhanced validation utilities with proper error handling

import { SolventType, validateSolventType } from '@/types/solvents';
import { logger } from './logger';

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult<T = any> {
  isValid: boolean;
  data?: T;
  errors: ValidationError[];
}

export const validateRequired = (value: unknown, fieldName: string): ValidationError | null => {
  if (value === null || value === undefined || value === '') {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
      code: 'REQUIRED'
    };
  }
  return null;
};

export const validateSolvent = (solvent: string | null, fieldName: string): ValidationError | null => {
  if (solvent !== null && !validateSolventType(solvent)) {
    logger.warn('Invalid solvent type detected', { 
      component: 'validation',
      data: { solvent, field: fieldName }
    });
    return {
      field: fieldName,
      message: `Invalid solvent type: ${solvent}`,
      code: 'INVALID_SOLVENT'
    };
  }
  return null;
};

export const validateNumericRange = (
  value: number, 
  min: number, 
  max: number, 
  fieldName: string
): ValidationError | null => {
  if (value < min || value > max) {
    return {
      field: fieldName,
      message: `${fieldName} must be between ${min} and ${max}`,
      code: 'OUT_OF_RANGE'
    };
  }
  return null;
};

export const safeParseNumber = (value: string | number, fieldName: string): ValidationResult<number> => {
  const num = typeof value === 'number' ? value : parseFloat(value);
  
  if (isNaN(num)) {
    return {
      isValid: false,
      errors: [{
        field: fieldName,
        message: `${fieldName} must be a valid number`,
        code: 'INVALID_NUMBER'
      }]
    };
  }
  
  return {
    isValid: true,
    data: num,
    errors: []
  };
};