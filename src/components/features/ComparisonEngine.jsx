import React, { useState } from 'react';
import { useLanguage } from '../../localization/useLanguage';
import './ComparisonEngine.css';

export const ENGINE_ROUTES = {
  jfk: {
    key: 'jfk',
    pill: 'MAD → JFK (Business)',
    title: 'Madrid (MAD) → Nueva York (JFK) · 8h 25m',
    cashPrice: '$1,280',
    cashTime: '12:40 MAD → 15:05 JFK (Iberia IB6251)',
    cashOutPocket: '$1,280 USD',
    savingsBadge: 'Save $580 vs Cash',
    milesAmount: '25,000 miles',
    milesAmountEs: '25.000 millas',
    taxesAmount: '+ $84',
    cppBadge: 'Valor: 4.78¢ / milla',
    awardTime: '12:40 MAD → 15:05 JFK (IB6251)',
    pointsValuation: '~$616 USD (2.46¢ cpp)',
    awardOutPocket: 'Solo $84 USD',
  },
  jnb: {
    key: 'jnb',
    pill: 'MAD → JNB (Business)',
    title: 'Madrid (MAD) → Johannesburgo (JNB) · 10h 15m',
    cashPrice: '$1,890',
    cashTime: '23:45 MAD → 10:00+1 JNB (Iberia / BA)',
    cashOutPocket: '$1,890 USD',
    savingsBadge: 'Save $1,120 vs Cash',
    milesAmount: '42,500 miles',
    milesAmountEs: '42.500 millas',
    taxesAmount: '+ $118',
    cppBadge: 'Valor: 4.17¢ / milla',
    awardTime: '23:45 MAD → 10:00+1 JNB',
    pointsValuation: '~$652 USD (2.35¢ cpp)',
    awardOutPocket: 'Solo $118 USD',
  },
  nrt: {
    key: 'nrt',
    pill: 'MAD → NRT (First/Biz)',
    title: 'Madrid (MAD) → Tokio Narita (NRT) · 13h 50m',
    cashPrice: '$2,640',
    cashTime: '11:55 MAD → 09:45+1 NRT (Iberia Directo)',
    cashOutPocket: '$2,640 USD',
    savingsBadge: 'Save $1,580 vs Cash',
    milesAmount: '59,500 miles',
    milesAmountEs: '59.500 millas',
    taxesAmount: '+ $142',
    cppBadge: 'Valor: 4.20¢ / milla',
    awardTime: '11:55 MAD → 09:45+1 NRT (IB281)',
    pointsValuation: '~$918 USD (2.28¢ cpp)',
    awardOutPocket: 'Solo $142 USD',
  },
};

export const ComparisonEngine = ({ activeRouteKey = 'jfk', onSelectRoute }) => {
  const { t, language } = useLanguage();
  const [selectedRoute, setSelectedRoute] = useState(activeRouteKey);

  const routeData = ENGINE_ROUTES[selectedRoute] || ENGINE_ROUTES.jfk;

  const handleRouteSwitch = (key) => {
    setSelectedRoute(key);
    if (onSelectRoute) onSelectRoute(key);
  };

  const scrollToCalculator = () => {
    const el = document.getElementById('calculadora');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="engine-section" id="soluciones">
      <div className="container">
        {/* Header & Route Selector */}
        <div className="engine-top-bar">
          <div>
            <span className="engine-eyebrow">{t('engine.eyebrow')}</span>
            <h2 className="engine-title">{t('engine.title')}</h2>
            <p className="engine-subtitle">{t('engine.subtitle')}</p>
          </div>

          <div className="engine-route-pills">
            {Object.values(ENGINE_ROUTES).map((route) => (
              <button
                key={route.key}
                type="button"
                className={`engine-pill-btn ${selectedRoute === route.key ? 'active' : ''}`}
                onClick={() => handleRouteSwitch(route.key)}
              >
                {route.pill}
              </button>
            ))}
          </div>
        </div>

        {/* Side-by-Side Comparison Card */}
        <div className="engine-comparison-card">
          {/* Active Flight Context Bar */}
          <div className="engine-card-header">
            <div className="engine-header-left">
              <span className="engine-cabin-badge">
                {t('engine.cabinBadge')}
              </span>
              <span className="engine-route-heading">
                {routeData.title}
              </span>
            </div>
            <div className="engine-verified-tag">
              <span className="verified-dot" />
              <span>{t('engine.verifiedSeats')}</span>
            </div>
          </div>

          {/* 2-Column Comparison Grid */}
          <div className="engine-grid">
            {/* Left: Traditional Cash Airline Fare */}
            <div className="engine-col-cash">
              <div className="col-top-meta">
                <div>
                  <span className="col-opt-label">{t('engine.cashLabel')}</span>
                  <h3 className="col-opt-title">{t('engine.cashTitle')}</h3>
                </div>
                <span className="col-badge-neutral">{t('engine.cashStandard')}</span>
              </div>

              <div className="col-price-row">
                <span className="col-price-big">{routeData.cashPrice}</span>
                <span className="col-price-sub">{t('engine.cashTaxesIncluded')}</span>
              </div>

              <div className="col-specs-list">
                <div className="spec-row">
                  <span className="spec-label">🕒 {t('engine.flightTimeLabel')}</span>
                  <span className="spec-val font-bold">{routeData.cashTime}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">🧳 {t('engine.baggageLabel')}</span>
                  <span className="spec-val">{t('engine.baggageValue')}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">💺 {t('engine.seatLabel')}</span>
                  <span className="spec-val">{t('engine.seatValue')}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">🔄 {t('engine.flexibilityLabel')}</span>
                  <span className="spec-val text-muted">{t('engine.flexibilityValue')}</span>
                </div>
              </div>

              <div className="col-bottom-bar">
                <span>{t('engine.outOfPocketCash')}</span>
                <span className="out-pocket-amount">{routeData.cashOutPocket}</span>
              </div>
            </div>

            {/* Right: Award Cost with Miles + Low Taxes */}
            <div className="engine-col-award">
              <div className="col-top-meta">
                <div>
                  <span className="col-opt-label text-terracotta">{t('engine.awardLabel')}</span>
                  <h3 className="col-opt-title">{t('engine.awardTitle')}</h3>
                </div>
                <span className="savings-highlight-badge">
                  ↓ {routeData.savingsBadge}
                </span>
              </div>

              <div className="col-price-row award-row">
                <span className="col-price-big text-terracotta">
                  {language === 'es' ? routeData.milesAmountEs : routeData.milesAmount}
                </span>
                <span className="col-price-taxes">
                  {routeData.taxesAmount} {t('engine.awardTaxes')}
                </span>
                <span className="cpp-badge">{routeData.cppBadge}</span>
              </div>

              <div className="col-specs-list">
                <div className="spec-row">
                  <span className="spec-label">✓ {t('engine.exactFlightLabel')}</span>
                  <span className="spec-val font-bold">{routeData.awardTime}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">✓ {t('engine.pointsValuationLabel')}</span>
                  <span className="spec-val">{routeData.pointsValuation}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">✓ {t('engine.awardBaggageLabel')}</span>
                  <span className="spec-val">{t('engine.awardBaggageValue')}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">✓ {t('engine.cancellationLabel')}</span>
                  <span className="spec-val text-sage font-bold">{t('engine.cancellationValue')}</span>
                </div>
              </div>

              <div className="col-bottom-bar award-bottom">
                <div>
                  <span className="text-muted block text-xs">{t('engine.outOfPocketAward')}</span>
                  <span className="out-pocket-amount text-sage">{routeData.awardOutPocket}</span>
                </div>
                <button
                  type="button"
                  className="simulate-btn"
                  onClick={scrollToCalculator}
                >
                  <span>{t('engine.simulateBtn')}</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Banner: Eligible Credit Card Transfer Partners */}
          <div className="engine-partners-bar">
            <div className="partners-label">
              <span>⇄</span>
              <span>{t('engine.partnersBanner')}</span>
            </div>
            <div className="partners-badges">
              <span className="partner-chip">
                <span className="dot dot-amex" /> Amex Membership Rewards
              </span>
              <span className="partner-chip">
                <span className="dot dot-chase" /> Chase Ultimate Rewards
              </span>
              <span className="partner-chip">
                <span className="dot dot-capone" /> Capital One Miles
              </span>
              <span className="partner-chip">
                <span className="dot dot-citi" /> Citi ThankYou
              </span>
              <span className="partner-chip">
                <span className="dot dot-bilt" /> Bilt Rewards
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonEngine;
