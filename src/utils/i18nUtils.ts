import { useTranslation } from "react-i18next";
import { toast } from "@/hooks/use-toast";
import { logger } from "./logger";

export const useSafeTranslation = () => {
  const { t, i18n } = useTranslation();
  
  return (key: string, defaultValue?: string, options?: any) => {
    try {
      const exists = i18n.exists(key);
      
      if (!exists) {
        logger.warn(`Missing i18n key: ${key}`, {
          component: 'i18nUtils',
          key,
          language: i18n.language,
          defaultValue
        });
        
        // Show toast warning for missing translations in development
        if (import.meta.env.MODE === 'development') {
          toast({
            variant: "destructive",
            title: "Translation Missing",
            description: `Missing translation key: ${key}`,
          });
        }
        
        // Return the default value or the key itself
        return defaultValue || key;
      }
      
      return t(key, options);
    } catch (error) {
      logger.error(`Error in translation: ${key}`, {
        component: 'i18nUtils',
        error,
        key,
        defaultValue
      });
      
      return defaultValue || key;
    }
  };
};

// Utility function to validate translation keys during build
export const validateTranslationKey = (key: string, i18n: any): boolean => {
  try {
    return i18n.exists(key);
  } catch (error) {
    logger.error(`Translation key validation failed: ${key}`, error);
    return false;
  }
};

// Helper function to check if a key has the correct format
export const isValidTranslationKey = (key: string): boolean => {
  // Check for invalid characters at the end
  if (key.endsWith(':') || key.endsWith('.')) {
    return false;
  }
  
  // Check for double dots or other invalid patterns
  if (key.includes('..') || key.includes('.:') || key.includes(':.')) {
    return false;
  }
  
  return true;
};

// Function to suggest corrections for malformed keys
export const suggestKeyCorrection = (key: string): string => {
  // Remove trailing invalid characters
  let corrected = key.replace(/[:.]$/, '');
  
  // Fix double dots
  corrected = corrected.replace(/\.+/g, '.');
  
  return corrected;
};