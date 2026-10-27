import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../localization/useLanguage';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import PointsCalculator from '../components/features/PointsCalculator';
import './SubPages.css';

export const CalculatorPage = () => {
  const { t, language } = useLanguage();
  const isEs = language === 'es';

  return (
    <div className="subpage">
      <header className="page-header">
        <div className="container page-header-container">
          <div className="subpage-badge">
            <Badge variant="terracotta">
              {isEs ? 'Calculadora de Transferencias' : 'Points Transfer Tool'}
            </Badge>
          </div>
          <h1 className="page-title">
            {isEs ? 'Calculadora de Transferencia de Puntos' : 'Points Transfer Calculator'}
          </h1>
          <p className="page-subtitle">
            {isEs
              ? 'Calcula cuántas millas recibes en cada aerolínea al transferir tus puntos de Amex, Chase o Capital One. Compara el valor del portal bancario frente al valor optimizado con canjes directos.'
              : 'Calculate exactly how many airline miles you receive when transferring Amex, Chase, or Capital One points. Compare bank portal redemption value against direct airline award transfers.'}
          </p>
        </div>
      </header>

      <main className="page-body">
        <div className="container">
          {/* Transparency Callout */}
          <div
            style={{
              background: 'rgba(220, 210, 195, 0.35)',
              border: '1px solid rgba(220, 210, 195, 0.9)',
              borderRadius: '8px',
              padding: '12px 18px',
              fontSize: '13px',
              color: 'var(--color-espresso-700)',
              marginBottom: '24px',
              lineHeight: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span>ℹ️</span>
            <div>
              <strong>{isEs ? 'Ratios y Socios Verificados:' : 'Verified Ratios & Partners:'}</strong>{' '}
              {isEs
                ? 'Los ratios de transferencia 1:1 reflejan las asociaciones estándar entre los programas bancarios y las aerolíneas. Los bonos de transferencia promocionales temporales (+15% a +30%) se indican con fines demostrativos.'
                : '1:1 transfer ratios represent standard contractual partnerships between credit card issuers and airline loyalty programs. Promotional transfer bonuses (+15% to +30%) are indicated as illustrative examples.'}
            </div>
          </div>

          {/* Reused Interactive PointsCalculator Component */}
          <PointsCalculator />

          {/* Step by step transfer guide */}
          <div
            style={{
              background: '#FAF7F2',
              border: '1px solid rgba(220, 210, 195, 0.9)',
              borderRadius: '12px',
              padding: '28px',
              marginTop: '36px',
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-espresso-950)', margin: '0 0 16px 0' }}>
              📝 {isEs ? 'Cómo Realizar la Transferencia en 3 Pasos Seguros' : 'How to Complete Transfers in 3 Safe Steps'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid rgba(220, 210, 195, 0.7)' }}>
                <span style={{ color: 'var(--color-terracotta, #1648a3)', fontWeight: 800, fontSize: '1.2rem', display: 'block', marginBottom: '4px' }}>01</span>
                <strong style={{ display: 'block', fontSize: '13px', color: 'var(--color-espresso-950)', marginBottom: '4px' }}>
                  {isEs ? 'Verifica la plaza disponible' : 'Confirm Award Seat First'}
                </strong>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-espresso-600)', lineHeight: 1.5 }}>
                  {isEs
                    ? 'Nunca transfieras puntos a ciegas. Busca primero en la web de la aerolínea que exista billete con millas en tu fecha.'
                    : 'Never transfer points blindly. Search the airline website first to ensure an award seat is available on your target date.'}
                </p>
              </div>

              <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid rgba(220, 210, 195, 0.7)' }}>
                <span style={{ color: 'var(--color-terracotta, #1648a3)', fontWeight: 800, fontSize: '1.2rem', display: 'block', marginBottom: '4px' }}>02</span>
                <strong style={{ display: 'block', fontSize: '13px', color: 'var(--color-espresso-950)', marginBottom: '4px' }}>
                  {isEs ? 'Vincula tu número de viajero' : 'Link Frequent Flyer Account'}
                </strong>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-espresso-600)', lineHeight: 1.5 }}>
                  {isEs
                    ? 'En tu portal bancario (Amex/Chase/CapOne), añade tu número de viajero frecuente de la aerolínea receptora.'
                    : 'Inside your bank portal, add your frequent flyer account number for the recipient airline program.'}
                </p>
              </div>

              <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid rgba(220, 210, 195, 0.7)' }}>
                <span style={{ color: 'var(--color-terracotta, #1648a3)', fontWeight: 800, fontSize: '1.2rem', display: 'block', marginBottom: '4px' }}>03</span>
                <strong style={{ display: 'block', fontSize: '13px', color: 'var(--color-espresso-950)', marginBottom: '4px' }}>
                  {isEs ? 'Transfiere y reserva de inmediato' : 'Transfer & Book Immediately'}
                </strong>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-espresso-600)', lineHeight: 1.5 }}>
                  {isEs
                    ? 'Transfiere la cantidad exacta necesaria (la mayoría de transferencias tardan de 1 a 15 minutos) y emite tu billete.'
                    : 'Transfer the exact required points (most programs transfer within 1–15 minutes) and issue your flight.'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/wallet">
                <Button variant="primary" size="md">
                  💳 {isEs ? 'Configurar Mis Tarjetas en la Billetera' : 'Configure Card Wallet'}
                </Button>
              </Link>
              <Link to="/flights">
                <Button variant="outline" size="md">
                  ✈️ {isEs ? 'Buscar Vuelos' : 'Search Flights'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalculatorPage;
