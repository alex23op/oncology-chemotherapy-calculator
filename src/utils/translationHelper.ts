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
  const key = `solvents.${solventCode}`;
  const fallbacks: Record<string, string> = {
    normalSaline: 'Ser fiziologic 0.9%',
    dextrose5: 'Glucoză 5%',
    ringer: 'Soluție Ringer',
    waterForInjection: 'Apă pentru preparate injectabile'
  };
  
  return tWithFallback(t, key, fallbacks[solventCode]);
};

/**
 * Format timing text in Romanian
 */
export const formatTimingInRomanian = (timing: string): string => {
  if (typeof timing !== 'string') return timing;
  
  // Handle common timing patterns
  const patterns = [
    { 
      pattern: /(\d+)\s*minutes?\s*before/i, 
      replacement: (match: string, minutes: string) => `${minutes} minute înainte` 
    },
    { 
      pattern: /(\d+)\s*min\s*before/i, 
      replacement: (match: string, minutes: string) => `${minutes} min înainte` 
    },
    { 
      pattern: /1\s*hour\s*before/i, 
      replacement: () => '1 oră înainte' 
    },
    { 
      pattern: /(\d+)\s*hours?\s*before/i, 
      replacement: (match: string, hours: string) => `${hours} ore înainte` 
    },
    { 
      pattern: /loading\s*dose/i, 
      replacement: () => 'Doză inițială' 
    }
  ];
  
  let result = timing;
  for (const { pattern, replacement } of patterns) {
    result = result.replace(pattern, replacement);
  }
  
  return result;
};