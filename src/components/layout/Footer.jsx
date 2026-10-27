import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../localization/useLanguage';
import logoWhiteImg from '../../assets/images/logo-white.png';
import './Footer.css';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  const { t } = useLanguage();
  const [currency, setCurrency] = useState('EUR');

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid-top">
          {/* Brand Col */}
          <div className="footer-col-brand">
            <div className="footer-brand-title-wrap">
              <Link to="/" aria-label="BookMyFlight Home">
                <img src={logoWhiteImg} alt="BookMyFlight" className="footer-brand-logo-img" />
              </Link>
            </div>
            <p className="footer-brand-desc">{t('footer.tagline')}</p>

            {/* Currency Selector */}
            <div className="footer-currency-row">
              <label htmlFor="footer-currency" className="footer-currency-label">
                {t('footer.currency')}
              </label>
              <select
                id="footer-currency"
                className="footer-currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="EUR">€ EUR (Euro)</option>
                <option value="USD">$ USD (Dólar EE.UU.)</option>
                <option value="MXN">$ MXN (Peso Mexicano)</option>
              </select>
            </div>
          </div>

          {/* Product Col */}
          <div className="footer-col">
            <h4 className="footer-col-title">{t('footer.product')}</h4>
            <ul className="footer-links-list">
              <li>
                <button type="button" className="footer-text-btn" onClick={() => scrollToSection('vuelos')}>
                  {t('nav.flights')}
                </button>
              </li>
              <li>
                <button type="button" className="footer-text-btn" onClick={() => scrollToSection('soluciones')}>
                  {t('engine.title')}
                </button>
              </li>
              <li>
                <button type="button" className="footer-text-btn" onClick={() => scrollToSection('calculadora')}>
                  {t('calculator.title')}
                </button>
              </li>
              <li>
                <button type="button" className="footer-text-btn" onClick={() => scrollToSection('destinos')}>
                  {t('destinations.eyebrow')}
                </button>
              </li>
              <li>
                <button type="button" className="footer-text-btn" onClick={() => scrollToSection('como-funciona')}>
                  {t('howItWorks.sectionTitle')}
                </button>
              </li>
            </ul>
          </div>

          {/* Supported Ecosystems Col */}
          <div className="footer-col">
            <h4 className="footer-col-title">{t('footer.ecosystems')}</h4>
            <ul className="footer-links-list">
              <li>Avios (Iberia Plus, British Airways, Qatar)</li>
              <li>Flying Blue (Air France & KLM)</li>
              <li>Amex Membership Rewards & Chase UR</li>
              <li>LifeMiles, Aeroplan & United MileagePlus</li>
              <li>Capital One, Citi ThankYou & Bilt</li>
            </ul>
          </div>

          {/* Legal Col */}
          <div className="footer-col">
            <h4 className="footer-col-title">{t('footer.legal')}</h4>
            <ul className="footer-links-list">
              <li>
                <button type="button" className="footer-text-btn" onClick={() => scrollToSection('como-funciona')}>
                  Metodología de valoración (CPP)
                </button>
              </li>
              <li>
                <button type="button" className="footer-text-btn" onClick={() => scrollToSection('soluciones')}>
                  Política de independencia
                </button>
              </li>
              <li>
                <Link to="/trip-planner" className="footer-text-link">
                  {t('nav.tripPlanner')}
                </Link>
              </li>
              <li>
                <Link to="/miles-and-points" className="footer-text-link">
                  {t('nav.awardHacking')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom with Disclaimer & Copyright */}
        <div className="footer-bottom-row">
          <p className="footer-disclaimer-text">
            {t('footer.disclaimer')}
          </p>
          <p className="footer-copyright-text">
            © {CURRENT_YEAR} {t('brand.name')}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
