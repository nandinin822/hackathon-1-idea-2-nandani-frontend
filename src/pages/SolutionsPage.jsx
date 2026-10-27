import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../localization/useLanguage';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import './SubPages.css';

export const SolutionsPage = () => {
  const { t, language } = useLanguage();
  const isEs = language === 'es';

  const solutionsList = [
    {
      icon: '⚖️',
      title: isEs ? 'Comparación Transparente: Efectivo vs. Puntos' : 'Transparent Side-by-Side: Cash vs. Points',
      desc: isEs
        ? 'Consulta tarifas oficiales en efectivo obtenidas vía Duffel API frente a los puntos necesarios en programas de fidelización. Evalúa si te conviene pagar en dinero o transferir tus puntos bancarios.'
        : 'Compare verified cash airfares from flight providers alongside required award miles. Evaluate whether paying cash or transferring bank points yields higher value.',
    },
    {
      icon: '🔄',
      title: isEs ? 'Ecosistema de Transferencia Bancaria 1:1' : '1:1 Transfer Partner Ecosystem',
      desc: isEs
        ? 'Aprende a qué aerolíneas se transfieren tus puntos de Amex, Chase o Capital One en segundos. Olvídate de los portales bancarios que deprecian tus puntos a solo 1 centavo cada uno.'
        : 'Discover which global airlines accept 1:1 point transfers from Amex, Chase, and Capital One. Avoid bank travel portals that devalue your points to a flat 1 cent each.',
    },
    {
      icon: '🗺️',
      title: isEs ? 'Planificación de Itinerarios Complejos Multi-Ciudad' : 'Multi-City Journey & Stopover Planning',
      desc: isEs
        ? 'Diseña viajes con múltiples paradas intercontinentales. Usa billetes de largo radio con millas y conecta tramos regionales con operadores locales de bajo coste.'
        : 'Architect multi-destination journeys across global hubs. Combine long-haul award flights with regional carriers for seamless, cost-effective travel.',
    },
    {
      icon: '📊',
      title: isEs ? 'Cálculo de Ahorro Neto y Tasas de Aeropuerto' : 'Net Savings & Fee Transparency',
      desc: isEs
        ? 'Todo billete con millas requiere abonar tasas aeroportuarias gubernamentales. Desglosamos con total claridad los impuestos en efectivo y el valor real de ahorro neto.'
        : 'Every award flight incurs government airport taxes and carrier fees. We disclose estimated cash taxes clearly so you understand your true net savings.',
    },
    {
      icon: '💳',
      title: isEs ? 'Planificador Futuro de Puntos por Gasto Diario' : 'Future Rewards Accumulator Engine',
      desc: isEs
        ? 'Calcula cuántos puntos puedes generar en los próximos 1 a 12 meses canalizando tus compras habituales (comida, viajes, compras) hacia tarjetas con multiplicadores verificados.'
        : 'Estimate point accumulation over 1 to 12 months by channeling everyday spend (dining, groceries, travel) onto cards with verified bonus categories.',
    },
    {
      icon: '🛡️',
      title: isEs ? 'Privacidad Total y Cero Datos Bancarios' : 'Complete Privacy & Zero Banking Credentials',
      desc: isEs
        ? 'Jamás te pediremos números de tarjeta, CVV, contraseñas bancarias ni accesos a tus cuentas. El sistema funciona con los datos que tú decidas configurar en tu billetera local.'
        : 'We never request card numbers, CVVs, passwords, or bank login credentials. Everything operates locally through the card profiles you choose to select.',
    },
  ];

  return (
    <div className="subpage">
      <header className="page-header">
        <div className="container page-header-container">
          <div className="subpage-badge">
            <Badge variant="terracotta">
              {isEs ? 'Soluciones de Producto' : 'Product Solutions'}
            </Badge>
          </div>
          <h1 className="page-title">
            {isEs ? 'Cómo BookMyFlight Transforma tu Forma de Viajar' : 'How BookMyFlight Powers Smarter Travel'}
          </h1>
          <p className="page-subtitle">
            {isEs
              ? 'Herramientas de ingeniería y matemáticas transparentes para viajar en cabinas superiores pagando hasta un 70% menos en efectivo.'
              : 'Engineering tools and transparent valuation math to access premium travel cabins for up to 70% less cash.'}
          </p>
        </div>
      </header>

      <main className="page-body">
        <div className="container" style={{ maxWidth: '960px' }}>
          {/* Solutions 3x2 Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '36px' }}>
            {solutionsList.map((sol, idx) => (
              <div
                key={idx}
                style={{
                  background: '#FAF7F2',
                  border: '1px solid rgba(220, 210, 195, 0.9)',
                  borderRadius: '12px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>{sol.icon}</span>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--color-espresso-950)', margin: '0 0 8px 0' }}>
                    {sol.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-espresso-700)', lineHeight: 1.6, margin: 0 }}>
                    {sol.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Strong Dual CTAs */}
          <div
            style={{
              background: '#FFFFFF',
              border: '2px solid var(--color-terracotta, #1648a3)',
              borderRadius: '16px',
              padding: '32px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(22, 72, 163, 0.08)',
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-espresso-950)', margin: '0 0 10px 0' }}>
              {isEs ? 'Comienza a comparar tus opciones de vuelo hoy mismo' : 'Start Comparing Your Flight Options Today'}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--color-espresso-600)', maxWidth: '560px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
              {isEs
                ? 'Busca vuelos en efectivo o diseña un plan completo para tu próximo gran viaje con tus tarjetas de puntos.'
                : 'Search cash airfares or build a comprehensive multi-city itinerary tailored to your points wallet.'}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/">
                <Button variant="primary" size="md">
                  ✈️ {isEs ? 'Buscar Vuelos en Efectivo' : 'Compare Flight Fares'}
                </Button>
              </Link>
              <Link to="/trip-planner">
                <Button variant="outline" size="md">
                  🗺️ {isEs ? 'Diseñar Itinerario Completo' : 'Multi-City Trip Planner'}
                </Button>
              </Link>
              <Link to="/rewards-planner">
                <Button variant="ghost" size="md">
                  📊 {isEs ? 'Calcular Mis Recompensas' : 'Rewards Spend Planner'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SolutionsPage;
