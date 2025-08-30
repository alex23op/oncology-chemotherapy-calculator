export type TFunction = (key: string, options?: { defaultValue?: string; [key: string]: unknown }) => string;

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
 * Format day display in Romanian
 * Converts "Day X" to "Ziua X"
 */
export const formatDayInRomanian = (day: string): string => {
  if (typeof day !== 'string') return day;
  
  // Match "Day X" pattern and extract the number
  const dayMatch = day.match(/Day\s+(\d+)/i);
  if (dayMatch) {
    return `Ziua ${dayMatch[1]}`;
  }
  
  // Return original if no match
  return day;
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