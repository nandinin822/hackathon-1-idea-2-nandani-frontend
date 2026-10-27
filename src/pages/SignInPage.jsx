import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../localization/useLanguage';
import Button from '../components/common/Button';
import './SubPages.css';

export const SignInPage = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="subpage">
      <header className="page-header">
        <div className="container page-header-container">
          <h1 className="page-title">{t('nav.signIn')}</h1>
          <p className="page-subtitle">{t('brand.shortTagline')}</p>
        </div>
      </header>

      <main className="page-body">
        <div className="container">
          <div className="auth-box">
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🔐</span>
                <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Authentication Hook</h2>
                <p style={{ color: 'var(--color-espresso-600)', fontSize: '14px', marginBottom: '24px' }}>
                  FastAPI JWT backend integration is connected and ready for Milestone 2.
                </p>
                <Link to="/">
                  <Button variant="primary">{t('common.backHome')}</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="field-group">
                  <label className="field-label" htmlFor="auth-email">
                    Email
                  </label>
                  <input
                    id="auth-email"
                    type="email"
                    className="field-input"
                    placeholder="traveler@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="field-group">
                  <label className="field-label" htmlFor="auth-password">
                    Password
                  </label>
                  <input
                    id="auth-password"
                    type="password"
                    className="field-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" style={{ marginTop: '12px' }}>
                  {t('nav.signIn')}
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignInPage;
