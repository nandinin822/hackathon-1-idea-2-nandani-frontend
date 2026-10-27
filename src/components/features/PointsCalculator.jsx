import React, { useState } from 'react';
import { useLanguage } from '../../localization/useLanguage';
import './PointsCalculator.css';

const BANK_DATA = {
  amex: {
    key: 'amex',
    name: 'Amex Membership Rewards',
    sub: '21 aerolíneas',
    partners: [
      {
        airline: 'Iberia Plus (Avios)',
        alliance: 'Oneworld',
        ratio: 1.0,
        bonus: '+20% Bono Activo',
        isBonus: true,
        multiplier: 1.2,
        speed: 'Transferencia instantánea',
        sweetSpot: 'Madrid ↔ Nueva York desde 25.000 Avios en Business',
      },
      {
        airline: 'Air France / KLM Flying Blue',
        alliance: 'SkyTeam',
        ratio: 1.0,
        bonus: 'Ratio estándar 1:1',
        isBonus: false,
        multiplier: 1.0,
        speed: 'Instantánea (< 5 min)',
        sweetSpot: 'Europa ↔ Latinoamérica desde 45.000 millas en Business',
      },
      {
        airline: 'ANA Mileage Club',
        alliance: 'Star Alliance',
        ratio: 1.0,
        bonus: 'Alto valor CPP',
        isBonus: false,
        multiplier: 1.0,
        speed: '24 a 48 horas',
        sweetSpot: 'Ida y vuelta a Japón en Business por 90.000 millas',
      },
      {
        airline: 'Qatar Airways Privilege Club',
        alliance: 'Oneworld',
        ratio: 1.0,
        bonus: 'Qsuite elegible',
        isBonus: false,
        multiplier: 1.0,
        speed: 'Instantánea',
        sweetSpot: 'Madrid → Doha → Ciudad del Cabo en Qsuite',
      },
    ],
  },
  chase: {
    key: 'chase',
    name: 'Chase Ultimate Rewards',
    sub: '11 aerolíneas',
    partners: [
      {
        airline: 'British Airways / Iberia Avios',
        alliance: 'Oneworld',
        ratio: 1.0,
        bonus: '+30% Bono Temporal',
        isBonus: true,
        multiplier: 1.3,
        speed: 'Transferencia instantánea',
        sweetSpot: 'Vuelos directos transatlánticos con tasas mínimas',
      },
      {
        airline: 'Air Canada Aeroplan',
        alliance: 'Star Alliance',
        ratio: 1.0,
        bonus: 'Sin recargos YQ',
        isBonus: false,
        multiplier: 1.0,
        speed: 'Instantánea',
        sweetSpot: 'Acceso a +45 aerolíneas socias con escalas por 5.000 pts',
      },
      {
        airline: 'Virgin Atlantic Flying Club',
        alliance: 'SkyTeam',
        ratio: 1.0,
        bonus: 'Sweet Spot ANA',
        isBonus: false,
        multiplier: 1.0,
        speed: 'Instantánea',
        sweetSpot: 'Canjes ultra bajos hacia Tokio y Londres',
      },
      {
        airline: 'United MileagePlus',
        alliance: 'Star Alliance',
        ratio: 1.0,
        bonus: 'Impuestos desde $5.60',
        isBonus: false,
        multiplier: 1.0,
        speed: 'Instantánea',
        sweetSpot: 'Excursionist Perk gratis en itinerarios multi-ciudad',
      },
    ],
  },
  capone: {
    key: 'capone',
    name: 'Capital One Miles',
    sub: '15+ aerolíneas',
    partners: [
      {
        airline: 'Avianca LifeMiles',
        alliance: 'Star Alliance',
        ratio: 1.0,
        bonus: '0$ recargo combustible',
        isBonus: false,
        multiplier: 1.0,
        speed: 'Instantánea',
        sweetSpot: 'Lufthansa y Swiss Business sin tasas exorbitantes',
      },
      {
        airline: 'Turkish Airlines Miles&Smiles',
        alliance: 'Star Alliance',
        ratio: 1.0,
        bonus: 'Ratio 1:1 directo',
        isBonus: false,
        multiplier: 1.0,
        speed: 'Instantánea a 12h',
        sweetSpot: 'Business Class hacia Estambul y Asia con gran disponibilidad',
      },
      {
        airline: 'British Airways Executive Club',
        alliance: 'Oneworld',
        ratio: 1.0,
        bonus: '+15% Bono socio',
        isBonus: true,
        multiplier: 1.15,
        speed: 'Instantánea',
        sweetSpot: 'Conecta Avios entre BA, Iberia y Qatar sin coste',
      },
      {
        airline: 'Cathay Pacific Asia Miles',
        alliance: 'Oneworld',
        ratio: 1.0,
        bonus: 'Ratio 1:1',
        isBonus: false,
        multiplier: 1.0,
        speed: '24 horas',
        sweetSpot: 'Rutas de largo radio a Asia y Oceanía en cabina Business',
      },
    ],
  },
};

export const PointsCalculator = () => {
  const { t } = useLanguage();
  const [selectedBank, setSelectedBank] = useState('amex');
  const [points, setPoints] = useState(50000);

  const bank = BANK_DATA[selectedBank];
  const portalVal = Math.round(points * 0.01);
  const optimizedVal = Math.round(points * 0.043);

  return (
    <section className="calc-section" id="calculadora">
      <div className="container">
        <div className="calc-layout-grid">
          {/* Left Column: Bank Selection & Points Slider */}
          <div className="calc-card-controls">
            <span className="calc-eyebrow">{t('calculator.eyebrow')}</span>
            <h2 className="calc-title">{t('calculator.title')}</h2>
            <p className="calc-subtitle">{t('calculator.subtitle')}</p>

            {/* Step 1: Bank ecosystem */}
            <div className="calc-step-block">
              <label className="step-label">{t('calculator.step1')}</label>
              <div className="bank-buttons-grid">
                <button
                  type="button"
                  className={`bank-btn ${selectedBank === 'amex' ? 'active' : ''}`}
                  onClick={() => setSelectedBank('amex')}
                >
                  <span className="bank-name">Amex MR</span>
                  <span className="bank-sub">21 aerolíneas</span>
                </button>
                <button
                  type="button"
                  className={`bank-btn ${selectedBank === 'chase' ? 'active' : ''}`}
                  onClick={() => setSelectedBank('chase')}
                >
                  <span className="bank-name">Chase UR</span>
                  <span className="bank-sub">11 aerolíneas</span>
                </button>
                <button
                  type="button"
                  className={`bank-btn ${selectedBank === 'capone' ? 'active' : ''}`}
                  onClick={() => setSelectedBank('capone')}
                >
                  <span className="bank-name">Capital One</span>
                  <span className="bank-sub">15+ aerolíneas</span>
                </button>
              </div>
            </div>

            {/* Step 2: Points Amount Slider */}
            <div className="calc-step-block">
              <div className="slider-header">
                <label htmlFor="points-slider-input" className="step-label">
                  {t('calculator.step2')}
                </label>
                <span className="points-display-val">
                  {points.toLocaleString()} pts
                </span>
              </div>
              <input
                id="points-slider-input"
                type="range"
                min="10000"
                max="200000"
                step="5000"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="points-slider"
              />
              <div className="slider-ticks">
                <span>10.000 pts</span>
                <span>100.000 pts</span>
                <span>200.000 pts</span>
              </div>
            </div>

            {/* Value comparison callout */}
            <div className="calc-valuation-box">
              <div>
                <span className="val-label">{t('calculator.bankPortalVal')}</span>
                <span className="val-amount font-mono">${portalVal.toLocaleString()} USD</span>
              </div>
              <div className="text-right">
                <span className="val-label text-terracotta">{t('calculator.optimizedVal')}</span>
                <span className="val-amount text-sage font-bold font-mono">
                  Hasta ${optimizedVal.toLocaleString()} USD
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Airline Partner Cards */}
          <div className="calc-results-wrap">
            <div className="results-header-bar">
              <h3 className="results-heading">
                {t('calculator.recommendedTitle')} (<span>{bank.name}</span>)
              </h3>
              <span className="verified-today-badge">
                {t('calculator.verifiedToday')}
              </span>
            </div>

            <div className="partners-cards-grid">
              {bank.partners.map((partner, idx) => {
                const received = Math.round(points * partner.ratio * partner.multiplier);

                return (
                  <div key={idx} className="partner-card">
                    <div>
                      <div className="partner-card-top">
                        <span className="partner-alliance">{partner.alliance}</span>
                        <span className={`partner-bonus-tag ${partner.isBonus ? 'bonus-active' : ''}`}>
                          {partner.bonus}
                        </span>
                      </div>
                      <h4 className="partner-airline-name">{partner.airline}</h4>

                      <div className="transfer-result-box">
                        <span className="transfer-result-label">{t('calculator.youReceive')}</span>
                        <span className="transfer-result-val">
                          {received.toLocaleString()} millas
                        </span>
                      </div>

                      <p className="partner-sweetspot">
                        <strong>{t('calculator.sweetSpotLabel')}</strong> {partner.sweetSpot}
                      </p>
                    </div>

                    <div className="partner-card-footer">
                      <span className="speed-info">⚡ {partner.speed}</span>
                      <span className="ratio-tag">{t('calculator.ratioLabel')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PointsCalculator;
