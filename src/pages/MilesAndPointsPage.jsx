import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../localization/useLanguage';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import './SubPages.css';

export const MilesAndPointsPage = () => {
  const { t, language } = useLanguage();

  const isEs = language === 'es';

  return (
    <div className="subpage">
      <header className="page-header">
        <div className="container page-header-container">
          <div className="subpage-badge">
            <Badge variant="sage">
              {isEs ? 'Guía de Estrategia' : 'Strategy Guide'}
            </Badge>
          </div>
          <h1 className="page-title">
            {t('milesGuide.title', isEs ? 'Millas y Puntos: La Guía Esencial' : 'Miles & Points: The Essential Guide')}
          </h1>
          <p className="page-subtitle">
            {t(
              'milesGuide.subtitle',
              isEs
                ? 'Aprende cómo los puntos transferibles de tarjetas bancarias te permiten pagar billetes de avión por una fracción de su precio en efectivo.'
                : 'Learn how transferable credit card points unlock high-value flight redemptions for a fraction of their cash fare.'
            )}
          </p>
        </div>
      </header>

      <main className="page-body">
        <div className="container" style={{ maxWidth: '920px' }}>
          {/* Core Concept: Fixed Miles vs Transferable Points */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
            <div style={{ background: '#FAF7F2', border: '1px solid rgba(220, 210, 195, 0.9)', borderRadius: '12px', padding: '24px' }}>
              <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '8px' }}>✈️</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--color-espresso-950)', margin: '0 0 8px 0' }}>
                {isEs ? 'Millas de Aerolínea (Fijas)' : 'Airline Frequent Flyer Miles'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-espresso-700)', lineHeight: 1.6, margin: 0 }}>
                {isEs
                  ? 'Puntos asociados a una única compañía (ej. Iberia Plus Avios, Flying Blue de Air France/KLM, United MileagePlus). Solo pueden canjearse dentro de esa aerolínea o sus socios de alianza, y caducan según las reglas de cada programa.'
                  : 'Points tied to a single carrier program (e.g., Iberia Plus Avios, Flying Blue, United MileagePlus). They can only be redeemed within that program or its alliance partners.'}
              </p>
            </div>

            <div style={{ background: '#FAF7F2', border: '2px solid var(--color-terracotta, #C85A32)', borderRadius: '12px', padding: '24px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '12px', right: '14px' }}>
                <Badge variant="terracotta">{isEs ? 'MÁXIMA FLEXIBILIDAD' : 'HIGH VALUE'}</Badge>
              </div>
              <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '8px' }}>💳</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--color-espresso-950)', margin: '0 0 8px 0' }}>
                {isEs ? 'Puntos Bancarios Transferibles' : 'Transferable Bank Points'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-espresso-700)', lineHeight: 1.6, margin: 0 }}>
                {isEs
                  ? 'Puntos acumulados en tarjetas bancarias (Amex Membership Rewards, Chase Ultimate Rewards, Capital One Miles). No caducan mientras la tarjeta esté activa y se transfieren a ratio 1:1 en segundos hacia más de 15 aerolíneas.'
                  : 'Flexible rewards from bank cards (Amex MR, Chase UR, Capital One). They never expire while your account is open and transfer 1:1 instantly to 15+ global airline partners.'}
              </p>
            </div>
          </div>

          {/* How Alliances Work */}
          <div style={{ background: '#FFFFFF', border: '1px solid rgba(220, 210, 195, 0.9)', borderRadius: '12px', padding: '24px', marginBottom: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-espresso-950)', margin: '0 0 12px 0' }}>
              🌐 {isEs ? 'Las 3 Grandes Alianzas Globales' : 'The 3 Major Global Alliances'}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-espresso-700)', lineHeight: 1.6, marginBottom: '16px' }}>
              {isEs
                ? 'El secreto del travel hacking es que puedes usar millas de una aerolínea para volar en cualquiera de sus socias de alianza:'
                : 'The key travel hacking principle: you can use miles from one airline program to book flights on any of its alliance partners:'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              <div style={{ background: '#FAF7F2', padding: '14px', borderRadius: '8px', border: '1px solid rgba(220, 210, 195, 0.7)' }}>
                <strong style={{ display: 'block', color: 'var(--color-espresso-950)', marginBottom: '4px', fontSize: '13px' }}>Oneworld</strong>
                <span style={{ fontSize: '12px', color: 'var(--color-espresso-600)' }}>Iberia, British Airways, American Airlines, Qatar Airways, Finnair, Cathay Pacific.</span>
              </div>
              <div style={{ background: '#FAF7F2', padding: '14px', borderRadius: '8px', border: '1px solid rgba(220, 210, 195, 0.7)' }}>
                <strong style={{ display: 'block', color: 'var(--color-espresso-950)', marginBottom: '4px', fontSize: '13px' }}>Star Alliance</strong>
                <span style={{ fontSize: '12px', color: 'var(--color-espresso-600)' }}>Lufthansa, Swiss, United Airlines, Avianca LifeMiles, Turkish Airlines, Singapore Airlines.</span>
              </div>
              <div style={{ background: '#FAF7F2', padding: '14px', borderRadius: '8px', border: '1px solid rgba(220, 210, 195, 0.7)' }}>
                <strong style={{ display: 'block', color: 'var(--color-espresso-950)', marginBottom: '4px', fontSize: '13px' }}>SkyTeam</strong>
                <span style={{ fontSize: '12px', color: 'var(--color-espresso-600)' }}>Air France, KLM (Flying Blue), Delta Air Lines, Virgin Atlantic, Aeroméxico.</span>
              </div>
            </div>
          </div>

          {/* Illustrative Sweet Spots with DEMO DATA Badge */}
          <div style={{ background: '#FAF7F2', border: '1px solid rgba(220, 210, 195, 0.9)', borderRadius: '12px', padding: '24px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-espresso-950)', margin: 0 }}>
                💡 {isEs ? 'Ejemplos Clásicos de Canje (Sweet Spots)' : 'Illustrative Redemption Examples (Sweet Spots)'}
              </h3>
              <Badge variant="terracotta">
                {isEs ? 'EJEMPLOS ILUSTRATIVOS / DEMO' : 'DEMO / ILLUSTRATIVE EXAMPLES'}
              </Badge>
            </div>

            <div style={{ background: 'rgba(220, 210, 195, 0.35)', padding: '10px 14px', borderRadius: '6px', fontSize: '12px', color: 'var(--color-espresso-700)', marginBottom: '16px', lineHeight: 1.5 }}>
              ⚠️ <strong>{isEs ? 'Aviso Importante de Disponibilidad:' : 'Important Availability Notice:'}</strong>{' '}
              {isEs
                ? 'Las plazas de canje con millas (award seats) son limitadas y dependen del inventario que cada aerolínea libera en cada vuelo. Los siguientes valores ilustran tablas oficiales de canje estándar y no garantizan disponibilidad en fechas específicas.'
                : 'Award seat inventory fluctuates dynamically based on airline revenue management. The following examples represent standard saver-award pricing charts and do not guarantee live availability.'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid rgba(220, 210, 195, 0.7)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <strong style={{ fontSize: '14px', display: 'block', color: 'var(--color-espresso-950)' }}>
                    Madrid (MAD) ➔ Nueva York (JFK) en Business Class
                  </strong>
                  <span style={{ fontSize: '12px', color: 'var(--color-espresso-600)' }}>
                    Programa: Iberia Plus Avios • Tarifa efectivo típica: ~$1,850 USD
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-terracotta, #C85A32)', fontFamily: 'monospace', display: 'block' }}>
                    34,000 – 42,500 Avios
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-sage, #2E6F40)', fontWeight: 600 }}>
                    + ~$110 USD {isEs ? 'tasas' : 'taxes'} (~65% {isEs ? 'ahorro' : 'savings'})
                  </span>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid rgba(220, 210, 195, 0.7)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <strong style={{ fontSize: '14px', display: 'block', color: 'var(--color-espresso-950)' }}>
                    París (CDG) ➔ Tokio (HND) en Economy
                  </strong>
                  <span style={{ fontSize: '12px', color: 'var(--color-espresso-600)' }}>
                    Programa: Air France/KLM Flying Blue • Tarifa efectivo típica: ~$920 USD
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-terracotta, #C85A32)', fontFamily: 'monospace', display: 'block' }}>
                    25,000 – 35,000 Flying Blue
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-sage, #2E6F40)', fontWeight: 600 }}>
                    + ~$90 USD {isEs ? 'tasas' : 'taxes'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            <Link to="/calculator">
              <Button variant="primary" size="md" style={{ width: '100%' }}>
                🧮 {isEs ? 'Calculadora de Transferencia 1:1' : '1:1 Transfer Calculator'}
              </Button>
            </Link>
            <Link to="/wallet">
              <Button variant="outline" size="md" style={{ width: '100%' }}>
                💳 {isEs ? 'Gestionar Billetera de Tarjetas' : 'Configure Card Wallet'}
              </Button>
            </Link>
            <Link to="/flights">
              <Button variant="outline" size="md" style={{ width: '100%' }}>
                ✈️ {isEs ? 'Buscar Vuelos en Efectivo' : 'Search Cash Flights'}
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MilesAndPointsPage;
