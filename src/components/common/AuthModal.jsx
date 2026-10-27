import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../localization/useLanguage';
import { useAuth } from '../../context/AuthContext';
import './AuthModal.css';

export const AuthModal = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const { t } = useLanguage();
  const { user, signIn, signUp, signOut, resendConfirmation, loading: authLoading } = useAuth();

  const [mode, setMode] = useState(initialMode); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setFormError(null);
      setSuccessMsg(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      setFormError(t('authModal.passwordMinLength') || 'Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'signup') {
        const { data, error } = await signUp(email, password);
        if (error) {
          setFormError(error.message);
        } else {
          // If Supabase requires email verification or auto logs in
          if (data?.session) {
            setSuccessMsg('Account created and signed in successfully!');
            setTimeout(() => {
              onClose();
            }, 1200);
          } else {
            setSuccessMsg(
              t('authModal.signUpSuccess') ||
                'Account registered! If confirmation is required, please verify your inbox.'
            );
          }
        }
      } else {
        const { data, error } = await signIn(email, password);
        if (error) {
          setFormError(error.message);
        } else {
          setSuccessMsg('Signed in successfully!');
          setTimeout(() => {
            onClose();
          }, 800);
        }
      }
    } catch (err) {
      setFormError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setSubmitting(true);
    await signOut();
    setSubmitting(false);
    onClose();
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

        {user ? (
          // Logged-in state view
          <div className="auth-modal-loggedin-view">
            <div className="auth-modal-eyebrow">✦ {t('authModal.title')}</div>
            <h3 className="auth-modal-heading">{t('authModal.signedInAs')}</h3>
            <div className="auth-modal-user-pill">
              <span className="user-avatar-icon">👤</span>
              <span className="user-email-text">{user.email}</span>
            </div>
            <p className="auth-modal-subtext">
              Your session is active and securely saved across browser visits.
            </p>
            <div className="auth-modal-actions">
              <button
                type="button"
                className="auth-submit-btn auth-signout-btn"
                onClick={handleSignOut}
                disabled={submitting}
              >
                {submitting ? t('authModal.loading') : t('authModal.signOut')}
              </button>
            </div>
          </div>
        ) : (
          // Sign In / Sign Up form
          <>
            <div className="auth-modal-eyebrow">✦ {t('authModal.title')}</div>
            <h3 className="auth-modal-heading">
              {mode === 'signup' ? t('authModal.submitSignUp') : t('authModal.heading')}
            </h3>
            <p className="auth-modal-subtext">{t('authModal.subtext')}</p>

            {/* Mode Switcher Tabs */}
            <div className="auth-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signin'}
                className={`auth-tab-btn ${mode === 'signin' ? 'active' : ''}`}
                onClick={() => {
                  setMode('signin');
                  setFormError(null);
                }}
              >
                {t('authModal.signInTab')}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signup'}
                className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => {
                  setMode('signup');
                  setFormError(null);
                }}
              >
                {t('authModal.signUpTab')}
              </button>
            </div>

            {/* Error & Success Messages */}
            {formError && (
              <div className="auth-modal-error" role="alert">
                <span>⚠️</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{formError}</div>
                  {formError.toLowerCase().includes('email not confirmed') && (
                    <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#7f1d1d' }}>
                      <p style={{ margin: '0 0 6px 0', lineHeight: 1.4 }}>
                        Supabase requires confirming your email before logging in. Please check your inbox or spam folder for the verification link.
                      </p>
                      <p style={{ margin: '0 0 8px 0', fontSize: '0.78rem', color: 'var(--color-espresso-700)' }}>
                        💡 <em>Tip for instant demo:</em> Disable <strong>"Confirm email"</strong> in your Supabase Dashboard under <strong>Authentication → Providers → Email</strong>.
                      </p>
                      <button
                        type="button"
                        style={{
                          background: '#dc2626',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '5px 10px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                        onClick={async () => {
                          if (!email) return;
                          setSubmitting(true);
                          const { error } = await resendConfirmation(email);
                          setSubmitting(false);
                          if (error) {
                            setFormError(error.message);
                          } else {
                            setSuccessMsg('Confirmation email resent! Please check your inbox.');
                            setFormError(null);
                          }
                        }}
                        disabled={submitting || !email}
                      >
                        {submitting ? 'Sending...' : 'Resend verification email'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {successMsg && (
              <div className="auth-modal-success" role="status">
                <span>✓</span>
                <p>{successMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-modal-form">
              <div className="auth-field">
                <label htmlFor="auth-email-input" className="auth-label">
                  {t('authModal.emailLabel')}
                </label>
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  autoComplete="email"
                  className="auth-input"
                  placeholder={t('authModal.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="auth-password-input" className="auth-label">
                  {t('authModal.passwordLabel')}
                </label>
                <input
                  id="auth-password-input"
                  type="password"
                  required
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  className="auth-input"
                  placeholder={t('authModal.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={submitting}
              >
                {submitting
                  ? t('authModal.loading')
                  : mode === 'signup'
                  ? t('authModal.submitSignUp')
                  : t('authModal.submitSignIn')}
              </button>
            </form>

            <div className="auth-toggle-mode">
              {mode === 'signup' ? (
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => {
                    setMode('signin');
                    setFormError(null);
                  }}
                >
                  {t('authModal.alreadyHaveAccount')}
                </button>
              ) : (
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => {
                    setMode('signup');
                    setFormError(null);
                  }}
                >
                  {t('authModal.dontHaveAccount')}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
