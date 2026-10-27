import React from 'react';
import { useLanguage } from '../../localization/useLanguage';
import './LanguageSwitcher.css';

export const LanguageSwitcher = ({ className = '' }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      className={`lang-switcher ${className}`}
      role="group"
      aria-label={t('language.switchLabel', 'Change Language')}
    >
      <button
        type="button"
        className={`lang-link ${language === 'es' ? 'active' : ''}`}
        onClick={() => setLanguage('es')}
        aria-pressed={language === 'es'}
      >
        ES
      </button>
      <span className="lang-divider">|</span>
      <button
        type="button"
        className={`lang-link ${language === 'en' ? 'active' : ''}`}
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
