import React from 'react';
import { useLanguage } from '../localization/useLanguage';
import FlightSearchPanel from '../components/search/FlightSearchPanel';
import './SubPages.css';

export const FlightsPage = () => {
  const { t } = useLanguage();

  return (
    <div className="subpage">
      <header className="page-header">
        <div className="container page-header-container">
          <h1 className="page-title">{t('nav.flights')}</h1>
          <p className="page-subtitle">{t('hero.description')}</p>
        </div>
      </header>

      <main className="page-body">
        <div className="container">
          <FlightSearchPanel />
        </div>
      </main>
    </div>
  );
};

export default FlightsPage;
