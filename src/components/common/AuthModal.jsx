import React, { useState } from 'react';
import { useLanguage } from '../../localization/useLanguage';
import './AuthModal.css';

export const AuthModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="auth-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <div className="auth-modal-eyebrow">
          ✦ {t('authModal.title')}
        </div>
        <h3 className="auth-modal-heading">{t('authModal.heading')}</h3>
        <p className="auth-modal-subtext">{t('authModal.subtext')}</p>

        {submitted ? (
          <div className="auth-modal-success" role="status">
            <span>✓</span>
            <p>{t('authModal.successMsg')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-modal-form">
            <div className="auth-field">
              <label htmlFor="auth-email-input" className="auth-label">
                {t('authModal.emailLabel')}
              </label>
              <input
                id="auth-email-input"
                type="email"
                required
                className="auth-input"
                placeholder={t('authModal.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="auth-submit-btn">
              {t('authModal.submitBtn')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
