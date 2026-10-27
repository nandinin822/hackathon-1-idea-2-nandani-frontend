import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../localization/useLanguage';
import { useAuth } from '../../context/AuthContext';
import LanguageSwitcher from '../common/LanguageSwitcher';
import AuthModal from '../common/AuthModal';
import logoImg from '../../assets/images/logo-dualtone.png';
import './Navbar.css';

export const Navbar = () => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U';

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
          <Link to="/" className="navbar-logo" onClick={closeMobile} aria-label="BookMyFlight Home">
            <img src={logoImg} alt="BookMyFlight" className="navbar-brand-logo-img" />
          </Link>

          {/* Center Desktop Navigation */}
          <nav className="navbar-links" aria-label="Main Navigation">
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
            <NavLink
              to="/solutions"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {t('nav.solutions')}
            </NavLink>
            <NavLink
              to="/calculator"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {t('nav.calculator')}
            </NavLink>
            <NavLink
              to="/wallet"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {t('nav.wallet')}
            </NavLink>
            <NavLink
              to="/rewards-planner"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {t('nav.rewardsPlanner')}
            </NavLink>
          </nav>

          {/* Right Actions */}
          <div className="navbar-actions">
            <LanguageSwitcher />

            {user ? (
              <div className="nav-auth-user-group">
                <button
                  type="button"
                  className="nav-user-initial-badge"
                  onClick={() => setAuthModalOpen(true)}
                  title={user.email}
                  aria-label={`Account (${user.email})`}
                >
                  {userInitial}
                </button>
                <button
                  type="button"
                  className="nav-signout-btn"
                  onClick={() => signOut()}
                >
                  {t('nav.signOut')}
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="nav-signin-btn"
                onClick={() => setAuthModalOpen(true)}
              >
                {t('nav.signIn')}
              </button>
            )}

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
            <NavLink
              to="/solutions"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobile}
            >
              {t('nav.solutions')}
            </NavLink>
            <NavLink
              to="/calculator"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobile}
            >
              {t('nav.calculator')}
            </NavLink>
            <NavLink
              to="/wallet"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobile}
            >
              {t('nav.wallet')}
            </NavLink>
            <NavLink
              to="/rewards-planner"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobile}
            >
              {t('nav.rewardsPlanner')}
            </NavLink>
            <div className="mobile-nav-actions">
              {user ? (
                <div className="mobile-user-box">
                  <div className="mobile-user-info">
                    <span className="nav-user-initial-badge mobile-initial">{userInitial}</span>
                    <span className="user-email-text">{user.email}</span>
                  </div>
                  <button
                    type="button"
                    className="nav-signout-btn mobile-btn"
                    onClick={() => {
                      closeMobile();
                      signOut();
                    }}
                  >
                    {t('nav.signOut')}
                  </button>
                </div>
              ) : (
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
              )}
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
