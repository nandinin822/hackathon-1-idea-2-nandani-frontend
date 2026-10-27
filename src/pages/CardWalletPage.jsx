import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../localization/useLanguage';
import { MARKETS, CARDS_CATALOGUE } from '../data/cardsCatalog';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import './SubPages.css';
import './CardWalletPage.css';

export const CardWalletPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [selectedMarket, setSelectedMarket] = useState(language === 'es' ? 'ES' : 'US');
  const [selectedCardId, setSelectedCardId] = useState('');
  const [pointsBalance, setPointsBalance] = useState(50000);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isNoCardMode, setIsNoCardMode] = useState(false);

  // Available cards filtered by current market
  const marketCards = CARDS_CATALOGUE.filter((c) => c.market === selectedMarket);
  const activeCard = CARDS_CATALOGUE.find((c) => c.id === selectedCardId) || marketCards[0];

  // Initialize or load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bmf_card_wallet');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.market) setSelectedMarket(parsed.market);
        if (parsed.primaryCard?.cardId) setSelectedCardId(parsed.primaryCard.cardId);
        if (typeof parsed.primaryCard?.pointsBalance === 'number') {
          setPointsBalance(parsed.primaryCard.pointsBalance);
        }
        if (parsed.isNoCardMode) setIsNoCardMode(true);
      } else if (marketCards.length > 0) {
        setSelectedCardId(marketCards[0].id);
      }
    } catch {
      // Ignore parse error
    }
  }, []);

  // When market changes, select the first card of that market if active isn't in it
  const handleMarketChange = (marketCode) => {
    setSelectedMarket(marketCode);
    const inMarket = CARDS_CATALOGUE.filter((c) => c.market === marketCode);
    if (inMarket.length > 0) {
      setSelectedCardId(inMarket[0].id);
    }
    setIsNoCardMode(false);
  };

  const handleSaveWallet = () => {
    const walletData = {
      market: selectedMarket,
      isNoCardMode,
      primaryCard: isNoCardMode
        ? null
        : {
            cardId: activeCard?.id,
            cardName: activeCard?.name,
            programName: activeCard?.program,
            pointsBalance: Number(pointsBalance) || 0,
            annualFee: activeCard?.annualFee,
            verifiedDate: activeCard?.verifiedDate,
          },
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem('bmf_card_wallet', JSON.stringify(walletData));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleContinueWithoutCard = () => {
    setIsNoCardMode(true);
    const walletData = {
      market: selectedMarket,
      isNoCardMode: true,
      primaryCard: null,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem('bmf_card_wallet', JSON.stringify(walletData));
    navigate('/flights');
  };

  return (
    <div className="subpage wallet-page-view">
      <header className="page-header">
        <div className="container page-header-container">
          <div className="subpage-badge">
            <Badge variant="sage">
              {language === 'es' ? 'Billetera de Recompensas' : 'Rewards Wallet'}
            </Badge>
          </div>
          <h1 className="page-title">{t('wallet.title', 'Card & Rewards Wallet')}</h1>
          <p className="page-subtitle">
            {t(
              'wallet.subtitle',
              'Select your reward cards and current point balances to unlock personalized award flight valuations. Zero banking passwords or sensitive card numbers required.'
            )}
          </p>
        </div>
      </header>

      <main className="page-body">
        <div className="container">
          {savedSuccess && (
            <div
              style={{
                background: 'rgba(46, 111, 64, 0.12)',
                border: '1px solid var(--color-sage, #2E6F40)',
                color: 'var(--color-sage, #2E6F40)',
                padding: '12px 18px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              role="alert"
            >
              ✓ {language === 'es' ? 'Perfil de billetera guardado con éxito. Tus puntos ahora se usarán en las búsquedas.' : 'Card wallet saved successfully. Your points will now calculate in flight search comparisons.'}
            </div>
          )}

          <div className="wallet-grid">
            {/* Left Column: Market, Cards, and Points Balance */}
            <div className="wallet-main-card">
              <h3 className="wallet-section-title">
                <span>1.</span> {language === 'es' ? 'Selecciona tu mercado de emisión' : 'Select Card Market / Country'}
              </h3>
              <div className="market-pills" role="radiogroup" aria-label="Market selection">
                {MARKETS.map((m) => (
                  <button
                    key={m.code}
                    type="button"
                    className={`market-pill-btn ${selectedMarket === m.code ? 'active' : ''}`}
                    onClick={() => handleMarketChange(m.code)}
                  >
                    <span>{m.flag}</span>
                    <span>{m.name}</span>
                  </button>
                ))}
              </div>

              <h3 className="wallet-section-title">
                <span>2.</span> {language === 'es' ? 'Elige tu tarjeta o programa de puntos' : 'Choose Your Card or Rewards Programme'}
              </h3>
              <div className="cards-selection-grid">
                {marketCards.map((card) => {
                  const isSelected = !isNoCardMode && activeCard?.id === card.id;
                  return (
                    <div
                      key={card.id}
                      className={`card-option-box ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedCardId(card.id);
                        setIsNoCardMode(false);
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="card-opt-header">
                        <span className="card-issuer-tag">{card.issuer}</span>
                        {isSelected && <span style={{ color: 'var(--color-terracotta, #C85A32)' }}>✓</span>}
                      </div>
                      <h4 className="card-opt-title">{card.name}</h4>
                      <span className="card-opt-program">{card.program}</span>

                      <div className="card-badges-row">
                        <span className="fee-badge">
                          {card.annualFee > 0 ? `${card.currency === 'EUR' ? '€' : (card.currency === 'GBP' ? '£' : '$')}${card.annualFee}/año` : (language === 'es' ? 'Sin cuota anual' : '$0 Annual Fee')}
                        </span>
                        <span className="verified-badge">
                          ✓ {language === 'es' ? 'Verificado' : 'Verified'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step 3: Current Points Balance Input */}
              {!isNoCardMode && (
                <div className="points-input-section">
                  <div className="input-label-row">
                    <label htmlFor="points-balance-field" style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-espresso-950)' }}>
                      <span>3.</span> {language === 'es' ? `Saldo de puntos disponible (${activeCard?.program})` : `Current Available Points (${activeCard?.program})`}
                    </label>
                  </div>
                  <div className="balance-input-wrapper">
                    <input
                      id="points-balance-field"
                      type="number"
                      min="0"
                      step="1000"
                      value={pointsBalance}
                      onChange={(e) => setPointsBalance(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="balance-input"
                    />
                  </div>
                  <div className="points-quick-pills">
                    {[10000, 25000, 50000, 80000, 120000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        className="quick-pill-btn"
                        onClick={() => setPointsBalance(preset)}
                      >
                        +{preset.toLocaleString()} pts
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No Card Alternative */}
              <div className="no-card-option-box">
                <div>
                  <strong style={{ display: 'block', fontSize: '14px', color: 'var(--color-espresso-950)' }}>
                    {language === 'es' ? '¿No tienes tarjeta de puntos todavía?' : 'Don’t have a rewards card yet?'}
                  </strong>
                  <span style={{ fontSize: '12px', color: 'var(--color-espresso-600)' }}>
                    {language === 'es' ? 'Puedes continuar buscando vuelos en efectivo y calcular ahorros futuros.' : 'You can still search cash fares and plan future point goals.'}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={handleContinueWithoutCard}>
                  {language === 'es' ? 'Continuar sin tarjeta' : 'Continue without Card'}
                </Button>
              </div>
            </div>

            {/* Right Column: Card Summary & Actions */}
            <aside className="wallet-summary-card">
              <div className="wallet-summary-header">
                <h3 className="wallet-section-title" style={{ marginBottom: '4px' }}>
                  {language === 'es' ? 'Resumen del Programa' : 'Programme Summary'}
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--color-espresso-600)' }}>
                  {activeCard?.name}
                </span>
              </div>

              {!isNoCardMode ? (
                <>
                  <div className="summary-balance-display">
                    <span className="sum-pts-val">{Number(pointsBalance).toLocaleString()}</span>
                    <span className="sum-pts-label">
                      {language === 'es' ? 'Puntos Listos para Canjear' : 'Points Ready to Redeem'}
                    </span>
                  </div>

                  <h5 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-espresso-500)', marginBottom: '8px' }}>
                    {language === 'es' ? 'Socios de transferencia verificados (1:1):' : 'Verified Transfer Partners (1:1):'}
                  </h5>
                  <ul className="wallet-partners-list">
                    {activeCard?.transferPartners?.map((p, idx) => (
                      <li key={idx} className="partner-item">
                        <span>✈️</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="wallet-disclaimer-box">
                    ℹ️ <strong>{language === 'es' ? 'Términos Verificados:' : 'Verified Terms:'}</strong>{' '}
                    {activeCard?.notes}{' '}
                    <br />
                    <a
                      href={activeCard?.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--color-terracotta, #C85A32)', textDecoration: 'underline', marginTop: '4px', display: 'inline-block' }}
                    >
                      {language === 'es' ? 'Ver términos oficiales del emisor ↗' : 'Official Issuer Terms ↗'}
                    </a>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--color-espresso-600)' }}>
                  <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>💳</span>
                  <p style={{ margin: 0, fontSize: '14px' }}>
                    {language === 'es' ? 'Modo sin tarjeta activado.' : 'No-card mode selected.'}
                  </p>
                </div>
              )}

              <div className="wallet-actions-stack">
                <Button variant="primary" size="md" onClick={handleSaveWallet} style={{ width: '100%' }}>
                  💾 {language === 'es' ? 'Guardar Billetera' : 'Save Wallet Profile'}
                </Button>
                <Link to="/flights" style={{ width: '100%' }}>
                  <Button variant="outline" size="sm" style={{ width: '100%' }}>
                    ✈️ {language === 'es' ? 'Buscar Vuelos con Mis Puntos' : 'Search Flights with Points'}
                  </Button>
                </Link>
                <Link to="/rewards-planner" style={{ width: '100%' }}>
                  <Button variant="ghost" size="sm" style={{ width: '100%' }}>
                    📊 {language === 'es' ? 'Ir al Planificador de Recompensas' : 'Open Rewards Planner'}
                  </Button>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CardWalletPage;
