type TFunction = (key: string, options?: any) => string;

/**
 * Translation helper with fallback support
 * Converts camelCase keys to human-readable format if translation is missing
 */
export const tWithFallback = (t: TFunction, key: string, fallback?: string): string => {
  const translated = t(key);
  
  // If translation returns the key itself, it means translation is missing
  if (translated === key) {
    if (fallback) {
      return fallback;
    }
    
    // Generate human-readable fallback from key
    const keyParts = key.split('.');
    const lastPart = keyParts[keyParts.length - 1];
    
    // Convert camelCase to Title Case
    return lastPart
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }
  
  return translated;
};

/**
 * Get solvent label with fallback
 */
export const getSolventLabel = (t: TFunction, solventCode: string): string => {
  const key = `doseCalculator.solvents.${solventCode}`;
  const fallbacks: Record<string, string> = {
    normalSaline: 'Normal Saline',
    dextrose5: 'Dextrose 5%',
    ringer: 'Ringer Solution',
    waterForInjection: 'Water for Injection'
  };
  
  return tWithFallback(t, key, fallbacks[solventCode]);
};