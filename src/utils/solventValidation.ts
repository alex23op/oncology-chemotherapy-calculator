import { SOLVENT_COMPATIBILITY, validateSolventCompatibility } from './validation';
import { logger } from './logger';
import { toast } from "@/hooks/use-toast";

export interface SolventValidationResult {
  isValid: boolean;
  error?: string;
  alternatives?: string[];
}

export const validateDrugSolventCompatibility = (
  drugName: string, 
  solvent: string
): SolventValidationResult => {
  const error = validateSolventCompatibility(drugName, solvent);
  
  if (error) {
    const compatibleSolvents = SOLVENT_COMPATIBILITY[drugName as keyof typeof SOLVENT_COMPATIBILITY];
    return {
      isValid: false,
      error,
      alternatives: compatibleSolvents ? [...compatibleSolvents] : []
    };
  }
  
  return { isValid: true };
};

export const showSolventValidationError = (
  drugName: string,
  solvent: string,
  t: (key: string, options?: any) => string
) => {
  const validation = validateDrugSolventCompatibility(drugName, solvent);
  
  if (!validation.isValid) {
    logger.warn('Solvent compatibility validation failed', {
      component: 'solventValidation',
      data: { drugName, solvent, error: validation.error }
    });
    
    toast({
      variant: "destructive",
      title: t('validation.solventError', { default: 'Solvent Incompatibility' }),
      description: validation.error || t('validation.incompatibleSolvent', { 
        default: `${drugName} is not compatible with ${solvent}`,
        drug: drugName,
        solvent
      }),
    });
    
    return false;
  }
  
  return true;
};