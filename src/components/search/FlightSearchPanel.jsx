import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../localization/useLanguage';
import './FlightSearchPanel.css';

const POPULAR_AIRPORTS = [
  { code: 'MAD', city: 'Madrid', country: 'España' },
  { code: 'JNB', city: 'Johannesburgo', country: 'Sudáfrica' },
  { code: 'JFK', city: 'Nueva York', country: 'Estados Unidos' },
  { code: 'CDG', city: 'París', country: 'Francia' },
  { code: 'NRT', city: 'Tokio', country: 'Japón' },
  { code: 'CPT', city: 'Ciudad del Cabo', country: 'Sudáfrica' },
  { code: 'MIA', city: 'Miami', country: 'Estados Unidos' },
  { code: 'LHR', city: 'Londres', country: 'Reino Unido' },
  { code: 'BCN', city: 'Barcelona', country: 'España' },
  { code: 'EZE', city: 'Buenos Aires', country: 'Argentina' },
  { code: 'MEX', city: 'Ciudad de México', country: 'México' },
  { code: 'BOG', city: 'Bogotá', country: 'Colombia' },
];

export const FlightSearchPanel = ({ onSearch }) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('quick'); // 'quick' | 'full'
  const [tripType, setTripType] = useState('roundTrip'); // 'roundTrip' | 'oneWay'

  // Dynamic future dates: departure 14 days ahead, return 28 days ahead
  const getDefaultDates = () => {
    const today = new Date();
    const dep = new Date(today);
    dep.setDate(dep.getDate() + 14);
    const ret = new Date(today);
    ret.setDate(ret.getDate() + 28);
    return {
      departureDate: dep.toISOString().split('T')[0],
      returnDate: ret.toISOString().split('T')[0],
    };
  };

  const defaultDates = getDefaultDates();

  const [formData, setFormData] = useState({
    origin: 'MAD',
    destination: 'JNB',
    departureDate: defaultDates.departureDate,
    returnDate: defaultDates.returnDate,
    passengers: '1',
    cabinClass: 'business',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSwapAirports = () => {
    setFormData((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.origin.trim()) errs.origin = t('search.errorOrigin');
    if (!formData.destination.trim()) errs.destination = t('search.errorDestination');
    if (formData.origin && formData.destination && formData.origin === formData.destination) {
      errs.destination = t('search.errorSameAirport');
    }
    if (!formData.departureDate) {
      errs.departureDate = t('search.errorDeparture');
    } else {
      const depDate = new Date(formData.departureDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (depDate < today) {
        errs.departureDate = t('search.errorPastDate');
      }
    }
    if (tripType === 'roundTrip') {
      if (!formData.returnDate) {
        errs.returnDate = t('search.errorReturn');
      } else if (formData.returnDate < formData.departureDate) {
        errs.returnDate = t('search.errorReturnAfter');
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const query = new URLSearchParams({
      origin: formData.origin,
      destination: formData.destination,
      departure: formData.departureDate,
      ...(tripType === 'roundTrip' ? { return: formData.returnDate } : {}),
      tripType,
      passengers: formData.passengers,
      cabin: formData.cabinClass,
    }).toString();

    navigate(`/results?${query}`);
    setIsSubmitting(false);
  };

  return (
    <div className="search-widget-container">
      {/* Top Tabs */}
      <div className="search-top-tabs">
        <button
          type="button"
          className={`search-top-tab ${activeTab === 'quick' ? 'active' : ''}`}
          onClick={() => setActiveTab('quick')}
        >
          <span className="tab-icon" aria-hidden="true">✈️</span>
          <span>{t('search.tabQuick')}</span>
        </button>
        <button
          type="button"
          className={`search-top-tab ${activeTab === 'full' ? 'active' : ''}`}
          onClick={() => setActiveTab('full')}
        >
          <span className="tab-icon" aria-hidden="true">📅</span>
          <span>{t('search.tabFull')}</span>
        </button>
      </div>

      {/* Main Search Card */}
      <div className="search-main-card">
        <form onSubmit={handleSubmit} noValidate>
          {/* Trip Type Pills & Points Perk */}
          <div className="trip-type-bar">
            <div className="trip-pills-wrap">
              <button
                type="button"
                className={`trip-pill ${tripType === 'roundTrip' ? 'active' : ''}`}
                onClick={() => setTripType('roundTrip')}
              >
                {t('search.tripRoundTrip')}
              </button>
              <button
                type="button"
                className={`trip-pill ${tripType === 'oneWay' ? 'active' : ''}`}
                onClick={() => setTripType('oneWay')}
              >
                {t('search.tripOneWay')}
              </button>
            </div>

            <div className="trip-points-perk">
              <span className="sparkle-icon" aria-hidden="true">✦</span>
              <span>{t('search.pointsPerk')}</span>
            </div>
          </div>

          {/* Form Grid with full comfortable spacing */}
          <div className="search-inputs-grid">
            {/* Origin (Desde) */}
            <div className={`search-cell cell-route ${errors.origin ? 'cell-error' : ''}`}>
              <label className="cell-label" htmlFor="select-origin">
                {t('search.from')}
              </label>
              <div className="cell-content">
                <span className="cell-icon" aria-hidden="true">✈️</span>
                <select
                  id="select-origin"
                  className="cell-route-select"
                  value={formData.origin}
                  onChange={(e) => setFormData((prev) => ({ ...prev, origin: e.target.value }))}
                >
                  {POPULAR_AIRPORTS.map((apt) => (
                    <option key={`orig-${apt.code}`} value={apt.code}>
                      {apt.code} &nbsp; {apt.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="swap-cell-wrap">
              <button
                type="button"
                className="cell-swap-btn"
                onClick={handleSwapAirports}
                aria-label={t('search.swapAirports')}
                title={t('search.swapAirports')}
              >
                ⇄
              </button>
            </div>

            {/* Destination (Hasta) */}
            <div className={`search-cell cell-route ${errors.destination ? 'cell-error' : ''}`}>
              <label className="cell-label" htmlFor="select-dest">
                {t('search.to')}
              </label>
              <div className="cell-content">
                <span className="cell-icon" aria-hidden="true">✈️</span>
                <select
                  id="select-dest"
                  className="cell-route-select"
                  value={formData.destination}
                  onChange={(e) => setFormData((prev) => ({ ...prev, destination: e.target.value }))}
                >
                  {POPULAR_AIRPORTS.map((apt) => (
                    <option key={`dest-${apt.code}`} value={apt.code}>
                      {apt.code} &nbsp; {apt.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Departure (Salida) */}
            <div className={`search-cell cell-date ${errors.departureDate ? 'cell-error' : ''}`}>
              <label className="cell-label" htmlFor="input-dept">
                {t('search.departure')}
              </label>
              <div className="cell-content">
                <span className="cell-icon" aria-hidden="true">📅</span>
                <input
                  id="input-dept"
                  type="date"
                  className="cell-input-date"
                  value={formData.departureDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, departureDate: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* Return (Regreso) */}
            {tripType === 'roundTrip' && (
              <div className={`search-cell cell-date ${errors.returnDate ? 'cell-error' : ''}`}>
                <label className="cell-label" htmlFor="input-ret">
                  {t('search.returnDate')}
                </label>
                <div className="cell-content">
                  <span className="cell-icon" aria-hidden="true">📅</span>
                  <input
                    id="input-ret"
                    type="date"
                    className="cell-input-date"
                    value={formData.returnDate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, returnDate: e.target.value }))
                    }
                  />
                </div>
              </div>
            )}

            {/* Passengers */}
            <div className="search-cell cell-passengers">
              <label className="cell-label" htmlFor="input-pax">
                {t('search.passengers')}
              </label>
              <div className="cell-content">
                <span className="cell-icon" aria-hidden="true">👤</span>
                <select
                  id="input-pax"
                  className="cell-select"
                  value={formData.passengers}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, passengers: e.target.value }))
                  }
                >
                  <option value="1">1 {language === 'es' ? 'adulto' : 'adult'}</option>
                  <option value="2">2 {language === 'es' ? 'adultos' : 'adults'}</option>
                  <option value="3">3 {language === 'es' ? 'adultos' : 'adults'}</option>
                  <option value="4">4 {language === 'es' ? 'adultos' : 'adults'}</option>
                </select>
              </div>
            </div>

            {/* Cabin */}
            <div className="search-cell cell-cabin">
              <label className="cell-label" htmlFor="input-cabin">
                {t('search.cabin')}
              </label>
              <div className="cell-content">
                <span className="cell-icon" aria-hidden="true">💺</span>
                <select
                  id="input-cabin"
                  className="cell-select"
                  value={formData.cabinClass}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, cabinClass: e.target.value }))
                  }
                >
                  <option value="business">{t('search.cabinBusiness')}</option>
                  <option value="economy">{t('search.cabinEconomy')}</option>
                  <option value="premiumEconomy">{t('search.cabinPremiumEconomy')}</option>
                  <option value="first">{t('search.cabinFirst')}</option>
                </select>
              </div>
            </div>

            {/* Compare CTA Button */}
            <div className="cta-cell-wrap">
              <button
                type="submit"
                className="search-cta-btn"
                disabled={isSubmitting}
              >
                <span className="btn-search-icon" aria-hidden="true">🔍</span>
                <span>{isSubmitting ? t('search.searching') : t('search.searchBtn')}</span>
              </button>
            </div>
          </div>

          {/* Validation errors banner */}
          {Object.keys(errors).length > 0 && (
            <div className="search-error-banner" role="alert">
              ⚠️ {Object.values(errors)[0]}
            </div>
          )}
        </form>
      </div>

      {/* Quick Value Proposition Bar sitting directly under search */}
      <div className="search-benefits-row">
        <div className="search-benefit-item">
          <div className="benefit-circle-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h4 className="benefit-title">{t('quickBenefits.transparentTitle')}</h4>
            <p className="benefit-desc">{t('quickBenefits.transparentDesc')}</p>
          </div>
        </div>

        <div className="search-benefit-item">
          <div className="benefit-circle-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="8" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="12" y2="16" />
            </svg>
          </div>
          <div>
            <h4 className="benefit-title">{t('quickBenefits.milesTitle')}</h4>
            <p className="benefit-desc">{t('quickBenefits.milesDesc')}</p>
          </div>
        </div>

        <div className="search-benefit-item">
          <div className="benefit-circle-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a6 6 0 0 1 6 6c0 2.5-1.5 4.5-3 5.5v2.5a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V13.5C7.5 12.5 6 10.5 6 8a6 6 0 0 1 6-6z" />
              <line x1="9" y1="21" x2="15" y2="21" />
            </svg>
          </div>
          <div>
            <h4 className="benefit-title">{t('quickBenefits.savingsTitle')}</h4>
            <p className="benefit-desc">{t('quickBenefits.savingsDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchPanel;
