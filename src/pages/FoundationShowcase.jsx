import React, { useState } from 'react';
import { useLanguage } from '../localization/useLanguage';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { apiService } from '../services/api';
import './FoundationShowcase.css';

export const FoundationShowcase = () => {
  const { t, language } = useLanguage();
  const [clickCount, setClickCount] = useState(0);
  const [testLoading, setTestLoading] = useState(false);

  const handleInteractiveClick = () => {
    setClickCount((prev) => prev + 1);
  };

  const handleSimulateLoad = () => {
    setTestLoading(true);
    setTimeout(() => {
      setTestLoading(false);
    }, 1200);
  };

  return (
    <div className="showcase-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-eyebrow">
            <Badge variant="sage" showDot>
              {t('status.milestone')}
            </Badge>
          </div>

          <h1 className="hero-title">
            {language === 'es' ? (
              <>
                El mismo viaje. <em>Mucho menos dinero.</em>
              </>
            ) : (
              <>
                Same trip. <em>Much less money.</em>
              </>
            )}
          </h1>

          <p className="hero-desc">{t('hero.description')}</p>

          <div className="hero-actions">
            <Button
              variant="primary"
              size="lg"
              onClick={handleInteractiveClick}
              iconRight="→"
            >
              {t('hero.ctaPrimary')} ({clickCount})
            </Button>

            <a href="#design-tokens">
              <Button variant="outline" size="lg">
                {t('hero.ctaSecondary')}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Brand Color Tokens Palette */}
      <section className="container section-block" id="design-tokens">
        <div className="section-header">
          <p className="section-eyebrow">{t('foundation.paletteTitle')}</p>
          <h2 className="section-title">{t('foundation.title')}</h2>
          <p className="section-subtitle">{t('foundation.subtitle')}</p>
        </div>

        <div className="palette-grid">
          {/* Warm Ivory */}
          <div className="swatch-card">
            <div className="swatch-visual swatch-ivory" />
            <div className="swatch-details">
              <h4 className="swatch-title">Warm Ivory</h4>
              <p className="swatch-desc">{t('foundation.paletteIvoryDesc')}</p>
            </div>
          </div>

          {/* Deep Espresso */}
          <div className="swatch-card">
            <div className="swatch-visual swatch-espresso" />
            <div className="swatch-details">
              <h4 className="swatch-title">Deep Espresso</h4>
              <p className="swatch-desc">{t('foundation.paletteEspressoDesc')}</p>
            </div>
          </div>

          {/* Terracotta */}
          <div className="swatch-card">
            <div className="swatch-visual swatch-terracotta" />
            <div className="swatch-details">
              <h4 className="swatch-title">Terracotta</h4>
              <p className="swatch-desc">{t('foundation.paletteTerracottaDesc')}</p>
            </div>
          </div>

          {/* Sage */}
          <div className="swatch-card">
            <div className="swatch-visual swatch-sage" />
            <div className="swatch-details">
              <h4 className="swatch-title">Sage</h4>
              <p className="swatch-desc">{t('foundation.paletteSageDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive UI Components Showcase */}
      <section className="container section-block" id="foundation">
        <div className="showcase-grid">
          {/* Button Variants */}
          <div className="card component-card">
            <div className="component-group-title">
              <span>{t('foundation.buttonVariants')}</span>
              <Badge variant="outline">Interactive</Badge>
            </div>

            <div className="buttons-flow">
              <Button variant="primary">{t('buttons.primary')}</Button>
              <Button variant="secondary">{t('buttons.secondary')}</Button>
              <Button variant="sage">{t('buttons.sage')}</Button>
              <Button variant="outline">{t('buttons.outline')}</Button>
              <Button variant="ghost">{t('buttons.ghost')}</Button>
            </div>

            <div className="buttons-flow">
              <Button
                variant="primary"
                size="sm"
                loading={testLoading}
                onClick={handleSimulateLoad}
              >
                {testLoading ? 'Processing...' : 'Simulate Loading'}
              </Button>
              <Button variant="outline" size="sm" disabled>
                Disabled
              </Button>
            </div>
          </div>

          {/* Badges & Data Integrity */}
          <div className="card component-card">
            <div className="component-group-title">
              <span>{t('foundation.badgesTitle')}</span>
              <Badge variant="sage" showDot>Live</Badge>
            </div>

            <div className="badges-flow">
              <Badge variant="demo" showDot>
                {t('badges.demo')}
              </Badge>
              <Badge variant="sage">
                {t('badges.award')}
              </Badge>
              <Badge variant="espresso">
                {t('badges.cash')}
              </Badge>
              <Badge variant="neutral">
                {t('badges.savings')}
              </Badge>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: 'var(--space-4)', borderTop: '1px dashed var(--border-subtle)' }}>
              <h4 style={{ fontSize: 'var(--font-size-sm)', marginBottom: '4px' }}>
                {t('foundation.dataDisclaimer')}
              </h4>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-espresso-500)', lineHeight: '1.5' }}>
                {t('foundation.dataDisclaimerDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Backend & Environment Integration Box */}
        <div className="architecture-box" id="architecture">
          <div>
            <h3 className="arch-col-title">{t('apiNotice.title')}</h3>
            <p className="arch-col-desc">{t('apiNotice.desc')}</p>
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-ivory-300)', marginRight: '8px' }}>
                {t('apiNotice.envLabel')}
              </span>
              <code className="code-pill">{apiService.baseUrl}</code>
            </div>
          </div>

          <div>
            <h3 className="arch-col-title">Milestone 1 Architecture Status</h3>
            <div className="arch-list">
              <div className="arch-item">
                <span className="arch-bullet">✓</span>
                <span><strong>Frontend:</strong> React 19 + Vite deployed to Vercel</span>
              </div>
              <div className="arch-item">
                <span className="arch-bullet">✓</span>
                <span><strong>Design:</strong> CSS tokens with Warm Ivory, Espresso, Terracotta & Sage</span>
              </div>
              <div className="arch-item">
                <span className="arch-bullet">✓</span>
                <span><strong>i18n:</strong> Real-time English & Spanish dictionary switching</span>
              </div>
              <div className="arch-item">
                <span className="arch-bullet">✓</span>
                <span><strong>Security:</strong> All secrets isolated, zero keys in frontend bundle</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FoundationShowcase;
