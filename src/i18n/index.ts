import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '@/locales/en/common.json';
import ro from '@/locales/ro/common.json';

// Runtime missing key detection
const missingKeysThisSession = new Set<string>();

// Initialize i18n
void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ro: { translation: ro },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'ro'],
    interpolation: { escapeValue: false },
    detection: {
      // We'll still offer a prompt before switching automatically
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

// Add missing key handler for runtime detection
i18n.on('missingKey', (lng, namespace, key, defaultValue) => {
  const fullKey = namespace ? `${namespace}:${key}` : key;
  
  // Only log each missing key once per session
  if (!missingKeysThisSession.has(fullKey)) {
    missingKeysThisSession.add(fullKey);
    console.warn(`[i18n-missing] Key: "${fullKey}", Language: ${lng}, Default: "${defaultValue || 'none'}"`);
  }
});

export default i18n;
