import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../localization/useLanguage';
import LanguageSwitcher from '../common/LanguageSwitcher';
import AuthModal from '../common/AuthModal';
import './Navbar.css';

export const Navbar = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const closeMobile = () => setMobileMenuOpen(false);

  const scrollToSection = (id) => {
    closeMobile();
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className="navbar">
        <div className="container navbar-container">
          {/* Brand Logo */}
          <Link to="/" className="navbar-logo" onClick={closeMobile}>
            <div className="navbar-logo-icon-wrap" aria-hidden="true">
              <svg className="star-compass-svg" viewBox="0 0 32 32" fill="none">
                <path d="M16 2L19.2 12.8L30 16L19.2 19.2L16 30L12.8 19.2L2 16L12.8 12.8L16 2Z" fill="#C85A32"/>
                <path d="M8 8L14.2 14.2M24 8L17.8 14.2M24 24L17.8 17.8M8 24L14.2 17.8" stroke="#C85A32" strokeWidth="1.6" strokeLinecap="round"/>
                <circle cx="16" cy="16" r="2" fill="#FAF7F2"/>
              </svg>
            </div>
            <span className="navbar-brand-name">{t('brand.name')}</span>
          </Link>

          {/* Center Desktop Navigation */}
          <nav className="navbar-links" aria-label="Main Navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {t('nav.flights')}
            </NavLink>
            <NavLink
              to="/trip-planner"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {t('nav.tripPlanner')}
            </NavLink>
            <NavLink
              to="/miles-and-points"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {t('nav.awardHacking')}
            </NavLink>
            <button
              type="button"
              className="nav-link nav-btn-link"
              onClick={() => scrollToSection('soluciones')}
            >
              {t('nav.solutions')}
            </button>
            <button
              type="button"
              className="nav-link nav-btn-link nav-calc-link"
              onClick={() => scrollToSection('calculadora')}
            >
              <span>{t('nav.calculator')}</span>
              <span className="calc-pill-tag">1:1</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="navbar-actions">
            <LanguageSwitcher />

            <button
              type="button"
              className="nav-signin-btn"
              onClick={() => setAuthModalOpen(true)}
            >
              {t('nav.signIn')}
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="container mobile-nav open">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobile}
            >
              {t('nav.flights')}
            </NavLink>
            <NavLink
              to="/trip-planner"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobile}
            >
              {t('nav.tripPlanner')}
            </NavLink>
            <NavLink
              to="/miles-and-points"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobile}
            >
              {t('nav.awardHacking')}
            </NavLink>
            <button
              type="button"
              className="nav-link nav-btn-link"
              onClick={() => scrollToSection('soluciones')}
            >
              {t('nav.solutions')}
            </button>
            <button
              type="button"
              className="nav-link nav-btn-link"
              onClick={() => scrollToSection('calculadora')}
            >
              {t('nav.calculator')} (1:1)
            </button>
            <div className="mobile-nav-actions">
              <button
                type="button"
                className="nav-signin-btn"
                onClick={() => {
                  closeMobile();
                  setAuthModalOpen(true);
                }}
                style={{ width: '100%', textAlign: 'center' }}
              >
                {t('nav.signIn')}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
