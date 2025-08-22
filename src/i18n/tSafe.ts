import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

// Known fallbacks for commonly missing keys
const KNOWN_FALLBACKS: Record<string, { ro: string; en: string }> = {
  'unifiedSelector.solvent': { ro: 'Solvent', en: 'Solvent' },
  'unifiedSelector.selectSolventDesc': { ro: 'Selectați solventul pentru acest PEV', en: 'Select solvent for this PEV' },
  'doseCalculator.solvents.waterForInjection': { ro: 'Apă pentru preparate injectabile', en: 'Water for injections' },
  'doseCalculator.selectSolvent': { ro: 'Selectează solventul', en: 'Select solvent' },
  'solventGroups.pevNumber': { ro: 'PEV {{number}}', en: 'PEV {{number}}' },
  'solventGroups.individual': { ro: 'Medicamente individuale', en: 'Individual Medications' },
  'solventGroups.unassigned': { ro: 'Medicamente neasignate', en: 'Unassigned Medications' },
  'solventGroups.dropHere': { ro: 'Trageți medicamentele aici pentru a le grupa', en: 'Drop medications here to group them' },
  'solventGroups.noIndividual': { ro: 'Niciun medicament individual', en: 'No individual medications' },
  'solventGroups.validation.title': { ro: 'Vă rugăm să corectați următoarele probleme:', en: 'Please fix the following issues:' },
  'solventGroups.validation.noSolvent': { ro: '{{pev}} PEV: Niciun solvent selectat', en: '{{pev}} PEV: No solvent selected' },
  'solventGroups.validation.emptyPev': { ro: '{{pev}} PEV: Niciun medicament asignat', en: '{{pev}} PEV: No medications assigned' }
};

/**
 * Humanizes a key by taking the last component and making it readable
 * Examples: 
 * - "unifiedSelector.solvent" → "Solvent"
 * - "patientForm.weightUnit" → "Weight Unit"
 * - "doseCalculator.selectSolvent" → "Select Solvent"
 */
function humanizeKey(key: string): string {
  const lastPart = key.split('.').pop() || key;
  
  // Split camelCase, snake_case, and kebab-case
  return lastPart
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase
    .replace(/[_-]/g, ' ') // snake_case and kebab-case
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Checks if a string looks like an untranslated i18n key
 */
function looksLikeKey(text: string): boolean {
  return (
    typeof text === 'string' &&
    text.includes('.') &&
    !text.includes(' ') &&
    /^[a-zA-Z0-9._-]+$/.test(text)
  );
}

/**
 * Safe translation function that provides fallbacks for missing keys
 */
export function createTSafe(t: (key: string, options?: any) => string, currentLanguage: string) {
  return function tSafe(key: string, fallback?: string, options?: any): string {
    try {
      const result = t(key, options);
      
      // If the result equals the key or looks like a key, we need a fallback
      if (result === key || looksLikeKey(result)) {
        // Check known fallbacks first
        const knownFallback = KNOWN_FALLBACKS[key]?.[currentLanguage as 'en' | 'ro'];
        if (knownFallback) {
          // Handle interpolation in known fallbacks
          if (options && knownFallback.includes('{{')) {
            return knownFallback.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => 
              options[paramKey] || match
            );
          }
          return knownFallback;
        }
        
        // Use provided fallback
        if (fallback) {
          return fallback;
        }
        
        // Last resort: humanize the key
        return humanizeKey(key);
      }
      
      return result;
    } catch (error) {
      console.warn('[tSafe] Translation error for key:', key, error);
      
      // Fallback chain: known fallbacks → provided fallback → humanized key
      const knownFallback = KNOWN_FALLBACKS[key]?.[currentLanguage as 'en' | 'ro'];
      if (knownFallback) return knownFallback;
      if (fallback) return fallback;
      return humanizeKey(key);
    }
  };
}

/**
 * React hook for safe translation
 */
export function useTSafe() {
  const { t, i18n } = useTranslation();
  
  return useMemo(
    () => createTSafe(t, i18n.language),
    [t, i18n.language]
  );
}

/**
 * Safe placeholder generator for form fields
 */
export function getPlaceholderSafe(key: string, fallback?: string): string {
  // This is a non-hook version for use in non-React contexts
  // We'll implement a simpler fallback mechanism
  const knownFallback = KNOWN_FALLBACKS[key]?.ro || KNOWN_FALLBACKS[key]?.en;
  if (knownFallback) return knownFallback;
  if (fallback) return fallback;
  return humanizeKey(key);
}

export default useTSafe;