import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../localization/useLanguage';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import './SubPages.css';

export const TripPlannerPage = () => {
  const { t } = useLanguage();

  return (
    <div className="subpage">
      <header className="page-header">
        <div className="container page-header-container">
          <h1 className="page-title">{t('nav.tripPlanner')}</h1>
          <p className="page-subtitle">{t('search.fullTripNotice')}</p>
        </div>
      </header>

      <main className="page-body">
        <div className="container">
          <div className="subpage-card">
            <div className="subpage-badge">
              <Badge variant="terracotta">{t('common.comingSoon')}</Badge>
            </div>
            <h2 className="subpage-card-title">{t('nav.tripPlanner')}</h2>
            <p className="subpage-card-desc">
              {t('common.pageUnderConstruction')}
            </p>
            <Link to="/">
              <Button variant="primary">{t('common.backHome')}</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TripPlannerPage;
