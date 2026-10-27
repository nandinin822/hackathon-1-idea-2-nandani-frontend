import React, { useState, useEffect } from 'react';
import { LanguageContext } from './language-context-instance';
import { translations } from './translations';

export const LanguageProvider = ({ children }) => {
  // Check stored preference or browser language, default to Spanish ('es')
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('app_language');
      if (saved === 'en' || saved === 'es') return saved;
      if (typeof navigator !== 'undefined' && navigator.language?.startsWith('es')) {
        return 'es';
      }
    } catch {
      // LocalStorage error fallback
    }
    return 'es';
  });

  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'es') {
      setLanguageState(lang);
      try {
        localStorage.setItem('app_language', lang);
      } catch {
        // LocalStorage error fallback
      }
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  // Update HTML document lang attribute
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  /**
   * Translates a dot-separated key, e.g., 'brand.tagline'
   */
  const t = (keyPath, fallback = '') => {
    if (!keyPath) return fallback;
    const keys = keyPath.split('.');
    
    // Look up in active language
    let current = translations[language];
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        current = undefined;
        break;
      }
    }

    if (typeof current === 'string') {
      return current;
    }

    // Fallback to English if not found in active language
    if (language !== 'en') {
      let enFallback = translations.en;
      for (const key of keys) {
        if (enFallback && typeof enFallback === 'object' && key in enFallback) {
          enFallback = enFallback[key];
        } else {
          enFallback = undefined;
          break;
        }
      }
      if (typeof enFallback === 'string') return enFallback;
    }

    return fallback || keyPath;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
