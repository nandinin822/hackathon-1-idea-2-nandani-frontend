import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../localization/useLanguage';
import FlightSearchPanel from '../components/search/FlightSearchPanel';
import ComparisonEngine from '../components/features/ComparisonEngine';
import PointsCalculator from '../components/features/PointsCalculator';
import heroWingImg from '../assets/images/hero-airplane-wing.jpg';
import destNyImg from '../assets/images/dest-newyork.jpg';
import destTokyoImg from '../assets/images/dest-tokyo.jpg';
import destCapeTownImg from '../assets/images/dest-capetown.jpg';
import './HomePage.css';

export const HomePage = () => {
  const { t } = useLanguage();
  const [activeEngineRoute, setActiveEngineRoute] = useState('jfk');

  const handleDestinationOptionClick = (engineKey) => {
    setActiveEngineRoute(engineKey);
    const el = document.getElementById('soluciones');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="homepage-wrapper">
      {/* 1. Hero Section with Airplane Wing & Telemetry Pill */}
      <section className="hero-split-section" id="vuelos" aria-label="Flight Travel Hacking">
        <div className="hero-banner-container">
          {/* Background Airplane Wing & Ocean Photo on the right side */}
          <div
            className="hero-wing-bg"
            style={{ backgroundImage: `url(${heroWingImg})` }}
          />
          {/* Smooth blend overlay into warm ivory on left and bottom */}
          <div className="hero-gradient-overlay" />

          {/* Top Split Content */}
          <div className="hero-top-row">
            {/* Left Column: Eyebrow, Headline, Value Proposition */}
            <div className="hero-text-content">
              <span className="hero-eyebrow-tag">
                {t('hero.eyebrow')}
              </span>
              <h1 className="hero-main-heading">
                <span className="heading-line-1">{t('hero.title')}</span>
                <span className="heading-line-2">{t('hero.titleAccent')}</span>
              </h1>
              <p className="hero-subtext">
                {t('hero.description')}
              </p>
            </div>

            {/* Right Column: Floating Live Aviation Telemetry Pill over the Wing */}
            <div className="hero-telemetry-col">
              <div className="telemetry-pill-card">
                <div className="telemetry-top-row">
                  <span className="telemetry-sweetspot-tag">
                    <span className="pulse-dot" />
                    {t('hero.activeSweetspot')}
                  </span>
                  <span className="telemetry-discount-tag">
                    {t('hero.sweetspotDiscount')}
                  </span>
                </div>
                <div className="telemetry-route-row">
                  <span>MAD</span>
                  <div className="telemetry-divider">
                    <span className="line" />
                    <span className="airplane-icon">✈</span>
                    <span className="line" />
                  </div>
                  <span>JNB</span>
                </div>
                <p className="telemetry-notice">
                  {t('hero.sweetspotNotice')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Search Panel & Inline Value Props */}
        <div className="hero-search-container">
          <FlightSearchPanel />
        </div>
      </section>

      {/* 2. Feature Solution Section: "The Cash vs. Miles Comparison Engine" */}
      <ComparisonEngine
        activeRouteKey={activeEngineRoute}
        onSelectRoute={(key) => setActiveEngineRoute(key)}
      />

      {/* 3. Interactive Miles & Points Transfer Calculator */}
      <PointsCalculator />

      {/* 4. Featured Destinations (DESTINOS DESTACADOS) */}
      <section className="destinations-showcase-section" id="destinos">
        <div className="container">
          {/* Section Header with Eyebrow and View All link */}
          <div className="destinations-top-bar">
            <div>
              <span className="destinations-eyebrow">{t('destinations.eyebrow')}</span>
              <h2 className="destinations-title">{t('destinations.sectionTitle')}</h2>
            </div>
            <Link to="/flights" className="view-all-link">
              {t('destinations.viewAll')}
            </Link>
          </div>

          {/* 3 Destination Cards */}
          <div className="destinations-cards-grid">
            {/* Card 1: Nueva York */}
            <article className="destination-preview-card">
              <div className="card-thumb-wrap">
                <img
                  src={destNyImg}
                  alt={t('destinations.ny.city')}
                  className="card-thumb-img"
                  loading="lazy"
                />
                <span className="card-example-pill">{t('destinations.badgeExample')}</span>
              </div>
              <div className="card-details-body">
                <div className="card-title-row">
                  <div>
                    <h3 className="card-city-name">{t('destinations.ny.city')}</h3>
                    <span className="card-country-name">{t('destinations.ny.country')}</span>
                  </div>
                </div>

                <div className="card-meta-flight">
                  <div className="flight-meta-item">
                    <span className="meta-icon" aria-hidden="true">✈️</span>
                    <span>{t('destinations.ny.route')}</span>
                  </div>
                  <div className="flight-meta-item">
                    <span className="meta-icon" aria-hidden="true">📅</span>
                    <span>{t('destinations.ny.dates')}</span>
                  </div>
                  <div className="flight-meta-item">
                    <span className="meta-icon" aria-hidden="true">👤</span>
                    <span>{t('destinations.ny.meta')}</span>
                  </div>
                </div>

                <div className="card-savings-box">
                  <div className="savings-col">
                    <span className="savings-label">{t('destinations.estimatedSavings')}</span>
                    <div className="savings-numbers">
                      <span className="savings-amount">{t('destinations.ny.savingsAmount')}</span>
                      <span className="savings-percent">{t('destinations.ny.savingsPercent')}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="card-action-link"
                  onClick={() => handleDestinationOptionClick('jfk')}
                >
                  {t('destinations.viewOptions')}
                </button>
              </div>
            </article>

            {/* Card 2: Tokio */}
            <article className="destination-preview-card">
              <div className="card-thumb-wrap">
                <img
                  src={destTokyoImg}
                  alt={t('destinations.tokyo.city')}
                  className="card-thumb-img"
                  loading="lazy"
                />
                <span className="card-example-pill">{t('destinations.badgeExample')}</span>
              </div>
              <div className="card-details-body">
                <div className="card-title-row">
                  <div>
                    <h3 className="card-city-name">{t('destinations.tokyo.city')}</h3>
                    <span className="card-country-name">{t('destinations.tokyo.country')}</span>
                  </div>
                </div>

                <div className="card-meta-flight">
                  <div className="flight-meta-item">
                    <span className="meta-icon" aria-hidden="true">✈️</span>
                    <span>{t('destinations.tokyo.route')}</span>
                  </div>
                  <div className="flight-meta-item">
                    <span className="meta-icon" aria-hidden="true">📅</span>
                    <span>{t('destinations.tokyo.dates')}</span>
                  </div>
                  <div className="flight-meta-item">
                    <span className="meta-icon" aria-hidden="true">👤</span>
                    <span>{t('destinations.tokyo.meta')}</span>
                  </div>
                </div>

                <div className="card-savings-box">
                  <div className="savings-col">
                    <span className="savings-label">{t('destinations.estimatedSavings')}</span>
                    <div className="savings-numbers">
                      <span className="savings-amount">{t('destinations.tokyo.savingsAmount')}</span>
                      <span className="savings-percent">{t('destinations.tokyo.savingsPercent')}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="card-action-link"
                  onClick={() => handleDestinationOptionClick('nrt')}
                >
                  {t('destinations.viewOptions')}
                </button>
              </div>
            </article>

            {/* Card 3: Ciudad del Cabo */}
            <article className="destination-preview-card">
              <div className="card-thumb-wrap">
                <img
                  src={destCapeTownImg}
                  alt={t('destinations.capetown.city')}
                  className="card-thumb-img"
                  loading="lazy"
                />
                <span className="card-example-pill">{t('destinations.badgeExample')}</span>
              </div>
              <div className="card-details-body">
                <div className="card-title-row">
                  <div>
                    <h3 className="card-city-name">{t('destinations.capetown.city')}</h3>
                    <span className="card-country-name">{t('destinations.capetown.country')}</span>
                  </div>
                </div>

                <div className="card-meta-flight">
                  <div className="flight-meta-item">
                    <span className="meta-icon" aria-hidden="true">✈️</span>
                    <span>{t('destinations.capetown.route')}</span>
                  </div>
                  <div className="flight-meta-item">
                    <span className="meta-icon" aria-hidden="true">📅</span>
                    <span>{t('destinations.capetown.dates')}</span>
                  </div>
                  <div className="flight-meta-item">
                    <span className="meta-icon" aria-hidden="true">👤</span>
                    <span>{t('destinations.capetown.meta')}</span>
                  </div>
                </div>

                <div className="card-savings-box">
                  <div className="savings-col">
                    <span className="savings-label">{t('destinations.estimatedSavings')}</span>
                    <div className="savings-numbers">
                      <span className="savings-amount">{t('destinations.capetown.savingsAmount')}</span>
                      <span className="savings-percent">{t('destinations.capetown.savingsPercent')}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="card-action-link"
                  onClick={() => handleDestinationOptionClick('jnb')}
                >
                  {t('destinations.viewOptions')}
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 5. How It Works (3-Step Roadmap) */}
      <section className="how-roadmap-section" id="como-funciona">
        <div className="container">
          <div className="how-header-box">
            <span className="how-eyebrow">{t('howItWorks.eyebrow')}</span>
            <h2 className="how-title">{t('howItWorks.sectionTitle')}</h2>
            <p className="how-subtitle">{t('howItWorks.subtitle')}</p>
          </div>

          <div className="how-steps-grid">
            <div className="how-step-card">
              <div className="step-card-top">
                <span className="step-num-badge">01</span>
                <span className="step-category-pill pill-azure">{t('howItWorks.step1Badge')}</span>
              </div>
              <h3 className="step-heading">{t('howItWorks.step1Title')}</h3>
              <p className="step-text">{t('howItWorks.step1Desc')}</p>
            </div>

            <div className="how-step-card">
              <div className="step-card-top">
                <span className="step-num-badge bg-espresso">02</span>
                <span className="step-category-pill pill-terracotta">{t('howItWorks.step2Badge')}</span>
              </div>
              <h3 className="step-heading">{t('howItWorks.step2Title')}</h3>
              <p className="step-text">{t('howItWorks.step2Desc')}</p>
            </div>

            <div className="how-step-card">
              <div className="step-card-top">
                <span className="step-num-badge bg-sage">03</span>
                <span className="step-category-pill pill-sage">{t('howItWorks.step3Badge')}</span>
              </div>
              <h3 className="step-heading">{t('howItWorks.step3Title')}</h3>
              <p className="step-text">{t('howItWorks.step3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Trust, Data Integrity & Verified Traveler Reviews */}
      <section className="trust-ethics-section">
        <div className="container">
          <div className="trust-layout-grid">
            {/* Left: 3 Pillars of Data Integrity */}
            <div className="trust-pillars-col">
              <span className="trust-eyebrow">{t('trust.eyebrow')}</span>
              <h2 className="trust-title">{t('trust.sectionTitle')}</h2>

              <div className="pillars-list">
                <div className="pillar-item">
                  <div className="pillar-icon-box box-terracotta">⚖️</div>
                  <div>
                    <h3 className="pillar-item-title">{t('trust.point1Title')}</h3>
                    <p className="pillar-item-desc">{t('trust.point1Desc')}</p>
                  </div>
                </div>

                <div className="pillar-item">
                  <div className="pillar-icon-box box-azure">🏦</div>
                  <div>
                    <h3 className="pillar-item-title">{t('trust.point2Title')}</h3>
                    <p className="pillar-item-desc">{t('trust.point2Desc')}</p>
                  </div>
                </div>

                <div className="pillar-item">
                  <div className="pillar-icon-box box-sage">🏷️</div>
                  <div>
                    <h3 className="pillar-item-title">{t('trust.point3Title')}</h3>
                    <p className="pillar-item-desc">{t('trust.point3Desc')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Verified Traveler Reviews */}
            <div className="trust-reviews-col">
              <div className="review-card">
                <div className="review-top-bar">
                  <div className="stars-row">★★★★★</div>
                  <span className="review-verified-pill">{t('testimonials.badge1')}</span>
                </div>
                <blockquote className="review-quote">
                  {t('testimonials.quote1')}
                </blockquote>
                <div className="review-footer">
                  <span className="review-author">{t('testimonials.author1')}</span>
                  <span className="review-savings">{t('testimonials.savings1')}</span>
                </div>
              </div>

              <div className="review-card">
                <div className="review-top-bar">
                  <div className="stars-row">★★★★★</div>
                  <span className="review-verified-pill pill-azure">{t('testimonials.badge2')}</span>
                </div>
                <blockquote className="review-quote">
                  {t('testimonials.quote2')}
                </blockquote>
                <div className="review-footer">
                  <span className="review-author">{t('testimonials.author2')}</span>
                  <span className="review-savings">{t('testimonials.savings2')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
