import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../localization/useLanguage';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import './SubPages.css';

export const MilesAndPointsPage = () => {
  const { t } = useLanguage();

  return (
    <div className="subpage">
      <header className="page-header">
        <div className="container page-header-container">
          <h1 className="page-title">{t('nav.awardHacking')}</h1>
          <p className="page-subtitle">{t('benefits.milesDesc')}</p>
        </div>
      </header>

      <main className="page-body">
        <div className="container">
          <div className="subpage-card">
            <div className="subpage-badge">
              <Badge variant="warning">{t('trust.demoBadge')}</Badge>
            </div>
            <h2 className="subpage-card-title">{t('benefits.milesTitle')}</h2>
            <p className="subpage-card-desc">
              {t('benefits.milesDesc')}
            </p>
            <p className="subpage-card-desc" style={{ fontSize: '13px', color: 'var(--color-espresso-500)' }}>
              {t('trust.demoNotice')}
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

export default MilesAndPointsPage;
