import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../localization/useLanguage';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import './SubPages.css';

export const SignInPage = ({ defaultMode = 'signin' }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, signIn, signUp, signOut, resendConfirmation, loading: authLoading } = useAuth();

  const [mode, setMode] = useState(defaultMode); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMode(defaultMode);
    setFormError(null);
    setSuccessMsg(null);
  }, [defaultMode]);

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
          if (data?.session) {
            setSuccessMsg('Account created and signed in successfully!');
            setTimeout(() => navigate('/'), 1200);
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
          setTimeout(() => navigate('/'), 800);
        }
      }
    } catch (err) {
      setFormError(err.message || 'Authentication error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setSubmitting(true);
    await signOut();
    setSubmitting(false);
  };

  return (
    <div className="subpage">
      <header className="page-header">
        <div className="container page-header-container">
          <h1 className="page-title">
            {user ? t('authModal.signedInAs') : mode === 'signup' ? t('nav.signUp') : t('nav.signIn')}
          </h1>
          <p className="page-subtitle">{t('brand.shortTagline')}</p>
        </div>
      </header>

      <main className="page-body">
        <div className="container">
          <div className="auth-box" style={{ maxWidth: '440px', margin: '0 auto' }}>
            {user ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>👤</span>
                <h2 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--color-espresso-950)' }}>
                  {t('authModal.signedInAs')}
                </h2>
                <div
                  style={{
                    display: 'inline-block',
                    background: 'var(--color-ivory-200)',
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    fontWeight: 600,
                    color: 'var(--color-espresso-900)',
                    marginBottom: '20px',
                  }}
                >
                  {user.email}
                </div>
                <p style={{ color: 'var(--color-espresso-600)', fontSize: '14px', marginBottom: '24px' }}>
                  Your session is restored and active.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    disabled={submitting}
                  >
                    {submitting ? t('authModal.loading') : t('authModal.signOut')}
                  </Button>
                  <Link to="/">
                    <Button variant="primary" style={{ width: '100%' }}>
                      {t('common.backHome')}
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Mode Selector Tabs */}
                <div
                  style={{
                    display: 'flex',
                    background: 'var(--color-ivory-200)',
                    borderRadius: '10px',
                    padding: '4px',
                    marginBottom: '20px',
                    gap: '4px',
                  }}
                >
                  <button
                    type="button"
                    style={{
                      flex: 1,
                      padding: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: mode === 'signin' ? '#ffffff' : 'transparent',
                      color: mode === 'signin' ? 'var(--color-espresso-950)' : 'var(--color-espresso-700)',
                      boxShadow: mode === 'signin' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                    }}
                    onClick={() => {
                      setMode('signin');
                      setFormError(null);
                    }}
                  >
                    {t('authModal.signInTab')}
                  </button>
                  <button
                    type="button"
                    style={{
                      flex: 1,
                      padding: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: mode === 'signup' ? '#ffffff' : 'transparent',
                      color: mode === 'signup' ? 'var(--color-espresso-950)' : 'var(--color-espresso-700)',
                      boxShadow: mode === 'signup' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                    }}
                    onClick={() => {
                      setMode('signup');
                      setFormError(null);
                    }}
                  >
                    {t('authModal.signUpTab')}
                  </button>
                </div>

                {formError && (
                  <div
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      color: '#991b1b',
                      fontSize: '0.85rem',
                      marginBottom: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span>⚠️</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{formError}</div>
                        {formError.toLowerCase().includes('email not confirmed') && (
                          <div style={{ marginTop: '8px', fontSize: '0.82rem', color: '#7f1d1d' }}>
                            <p style={{ margin: '0 0 8px 0', lineHeight: 1.4 }}>
                              Supabase requires confirming your email before logging in. Please check your inbox or spam folder for the verification link.
                            </p>
                            <p style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: 'var(--color-espresso-700)' }}>
                              💡 <em>Tip for instant demo:</em> Disable <strong>"Confirm email"</strong> in your Supabase Dashboard under <strong>Authentication → Providers → Email</strong>.
                            </p>
                            <button
                              type="button"
                              style={{
                                background: '#dc2626',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                fontSize: '0.8rem',
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
                  </div>
                )}

                {successMsg && (
                  <div
                    style={{
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      color: '#166534',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      marginBottom: '16px',
                    }}
                  >
                    ✓ {successMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                  <div className="field-group">
                    <label className="field-label" htmlFor="auth-email">
                      {t('authModal.emailLabel')}
                    </label>
                    <input
                      id="auth-email"
                      type="email"
                      className="field-input"
                      placeholder={t('authModal.emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="field-group">
                    <label className="field-label" htmlFor="auth-password">
                      {t('authModal.passwordLabel')}
                    </label>
                    <input
                      id="auth-password"
                      type="password"
                      className="field-input"
                      placeholder={t('authModal.passwordPlaceholder')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={submitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    style={{ marginTop: '12px', width: '100%' }}
                    disabled={submitting}
                  >
                    {submitting
                      ? t('authModal.loading')
                      : mode === 'signup'
                      ? t('authModal.submitSignUp')
                      : t('authModal.submitSignIn')}
                  </Button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  {mode === 'signup' ? (
                    <button
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-terracotta-600)',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
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
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-terracotta-600)',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
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
      </main>
    </div>
  );
};

export default SignInPage;
