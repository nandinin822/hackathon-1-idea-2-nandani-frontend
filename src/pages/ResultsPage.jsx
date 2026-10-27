import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../localization/useLanguage';
import { searchCashFlights } from '../services/flightApi';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import './SubPages.css';
import './ResultsPage.css';

function formatDuration(isoDuration) {
  if (!isoDuration) return 'Nonstop';
  const matches = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!matches) return isoDuration;
  const hours = matches[1] ? `${matches[1]}h` : '';
  const mins = matches[2] ? `${matches[2]}m` : '';
  return `${hours} ${mins}`.trim() || isoDuration;
}

function formatFlightTime(isoString) {
  if (!isoString) return '--:--';
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch {
    return isoString.slice(11, 16);
  }
}

function calculateAwardEstimation(cashPrice, cabinClass = 'economy') {
  const price = typeof cashPrice === 'number' ? cashPrice : parseFloat(cashPrice) || 500;
  let miles;
  let taxes;
  if (cabinClass === 'business' || cabinClass === 'first') {
    miles = Math.round((price * 30) / 500) * 500;
    if (miles < 35000) miles = 42500;
    taxes = 84;
  } else {
    miles = Math.round((price * 22) / 500) * 500;
    if (miles < 15000) miles = 20000;
    taxes = 35;
  }
  const pointsCashValue = (miles * 0.012) + taxes;
  const savings = Math.max(45, Math.round(price - pointsCashValue));
  return { miles: miles.toLocaleString(), rawMiles: miles, taxes, savings };
}

export const ResultsPage = () => {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const origin = (searchParams.get('origin') || 'JFK').toUpperCase();
  const destination = (searchParams.get('destination') || 'LHR').toUpperCase();
  const departure = searchParams.get('departure') || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
  const returnDate = searchParams.get('return') || null;
  const cabin = searchParams.get('cabin') || 'economy';
  const passengers = searchParams.get('passengers') || '1';
  const tripType = searchParams.get('tripType') || (returnDate ? 'roundTrip' : 'oneWay');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [expandedOfferId, setExpandedOfferId] = useState(null);
  const [selectedOfferForModal, setSelectedOfferForModal] = useState(null);
  const [walletProfile, setWalletProfile] = useState(null);

  // Load saved Card Wallet from localStorage (Milestone D)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bmf_card_wallet');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.cards?.length > 0 || parsed.primaryCard)) {
          setWalletProfile(parsed);
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const fetchFlights = async (useDemo = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await searchCashFlights({
        origin,
        destination,
        departureDate: departure,
        returnDate: tripType === 'roundTrip' ? returnDate : null,
        passengers: parseInt(passengers, 10) || 1,
        cabinClass: cabin,
        demoMode: useDemo,
      });
      setData(response);
    } catch (err) {
      console.error('Failed to load cash flights:', err);
      setError(err.message || 'An unexpected error occurred while searching for flights.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights(false);
  }, [origin, destination, departure, returnDate, cabin, passengers]);

  const toggleExpand = (id) => {
    setExpandedOfferId((prev) => (prev === id ? null : id));
  };

  const isDuffelUnconfigured = error && error.toLowerCase().includes('not configured');

  return (
    <div className="subpage results-page-view">
      {/* Editorial Header */}
      <header className="page-header">
        <div className="container page-header-container">
          <div className="results-badge-wrap">
            <span className="results-telemetry-badge">
              <span className="telemetry-live-dot" /> {t('results.liveBadge')}
            </span>
          </div>
          <h1 className="page-title">{t('results.pageTitle')}</h1>
          <p className="page-subtitle">{t('results.pageSubtitle')}</p>
        </div>
      </header>

      <main className="page-body">
        <div className="results-container">
          {/* Query Summary Bar */}
          <div className="results-query-bar">
            <div className="results-route-summary">
              <span className="results-airports">
                {origin} ➔ {destination}
              </span>
              <span className="results-meta">
                📅 {departure} {returnDate ? `— ${returnDate}` : `(${tripType === 'oneWay' ? (language === 'es' ? 'Solo ida' : 'One Way') : (language === 'es' ? 'Ida y vuelta' : 'Round Trip')})`} • 👤 {passengers} {language === 'es' ? 'pasajero(s)' : 'passenger(s)'} • 💺 {cabin.toUpperCase()}
              </span>
            </div>
            <Link to="/#vuelos">
              <Button variant="outline" size="sm">
                ✏️ {t('results.modifySearch')}
              </Button>
            </Link>
          </div>

          {/* User's Connected Wallet Profile Callout (Milestone D) */}
          {walletProfile && (
            <div className="results-wallet-card" role="region" aria-label="Wallet Profile Context">
              <div className="results-wallet-info">
                <h4>💳 {language === 'es' ? 'Billetera Conectada' : 'Connected Card Wallet'}: {walletProfile.primaryCard?.cardName || (language === 'es' ? 'Tarjetas guardadas' : 'Saved Cards')}</h4>
                <p>
                  {language === 'es'
                    ? `Mercado: ${walletProfile.market || 'EE. UU.'} • Programa: ${walletProfile.primaryCard?.programName || 'Transferible'} • Disponible para canje`
                    : `Market: ${walletProfile.market || 'US'} • Programme: ${walletProfile.primaryCard?.programName || 'Transferable'} • Available for award flights`}
                </p>
              </div>
              <div className="results-wallet-balance">
                <span className="wallet-bal-num">{(walletProfile.primaryCard?.pointsBalance || 0).toLocaleString()} pts</span>
                <span className="wallet-bal-label">{language === 'es' ? 'Saldo de puntos' : 'Points Balance'}</span>
              </div>
            </div>
          )}

          {/* Loading State Skeleton */}
          {loading && (
            <div className="results-loading-state" role="status" aria-live="polite">
              <div className="flight-radar-loader">
                <div className="radar-circle" />
                <div className="radar-sweep" />
                <span className="radar-plane-icon">✈️</span>
              </div>
              <h3 className="loading-title">{t('results.searching')}</h3>
              <p className="loading-subtitle">{t('results.searchingSub')}</p>
              <div className="skeleton-card-pulse" />
              <div className="skeleton-card-pulse" />
              <div className="skeleton-card-pulse" />
            </div>
          )}

          {/* Error State Banner */}
          {!loading && error && (
            <div className="results-error-card" role="alert">
              <div className="error-icon-box">⚠️</div>
              <div className="error-content-body">
                <h3 className="error-title">{t('results.errorTitle')}</h3>
                <p className="error-message">{error}</p>
                <div className="error-actions-row">
                  <Button variant="primary" size="sm" onClick={() => fetchFlights(false)}>
                    🔄 {t('results.retryBtn')}
                  </Button>
                  {isDuffelUnconfigured && (
                    <Button variant="secondary" size="sm" onClick={() => fetchFlights(true)}>
                      🧪 {language === 'es' ? 'Ver con datos de demostración' : 'Explore with Demo Offers'}
                    </Button>
                  )}
                  <Link to="/#vuelos">
                    <Button variant="outline" size="sm">
                      {t('results.backToSearch')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Success State with Live or Demo Duffel Offers */}
          {!loading && !error && data && (
            <>
              {/* Provenance Banner */}
              {data.is_demo ? (
                <div className="data-provenance-banner demo">
                  <span>⚠️</span>
                  <div>
                    <strong>{language === 'es' ? 'MODO DEMOSTRACIÓN:' : 'DEMO FIXTURE MODE:'}</strong>{' '}
                    {data.demo_notice || (language === 'es'
                      ? 'La API en vivo de Duffel no está configurada en el servidor. Estas ofertas son datos de prueba ilustrativos.'
                      : 'Duffel live API key is unconfigured on the backend. These offers are illustrative test fixtures.')}
                  </div>
                </div>
              ) : !data.live_mode ? (
                <div className="data-provenance-banner sandbox">
                  <span>🧪</span>
                  <div>
                    <strong>{language === 'es' ? 'ENTORNO SANDBOX DUFFEL:' : 'DUFFEL SANDBOX MODE:'}</strong>{' '}
                    {language === 'es'
                      ? 'Conectado a la API de prueba de Duffel. Estructura de vuelo real con horarios y tarifas simuladas del proveedor de pruebas.'
                      : 'Connected to Duffel Test API. Real flight query structure with simulated schedules and test fares.'}
                  </div>
                </div>
              ) : null}

              {/* Offers Count & Live Pill */}
              <div className="results-status-banner">
                <div className="results-count-wrap">
                  <span className="results-count-num">{data.total_offers}</span>
                  <span className="results-count-text">
                    {t('results.offersFound')} {t('results.forRoute')} <strong>{origin} ➔ {destination}</strong>
                  </span>
                </div>
                <div className="duffel-live-tag">
                  <span className="live-pulse" /> {data.is_demo ? 'Demo Flight Fixtures' : 'Powered by Duffel API'}
                </div>
              </div>

              {/* Empty state */}
              {data.offers.length === 0 ? (
                <div className="results-empty-card">
                  <span className="empty-icon" aria-hidden="true">🛫</span>
                  <h3 className="empty-title">{t('results.emptyTitle')}</h3>
                  <p className="empty-desc">{t('results.emptySubtitle')}</p>
                  <Link to="/#vuelos">
                    <Button variant="primary" size="md">
                      {t('results.modifySearch')}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="results-list">
                  {data.offers.map((offer) => {
                    const firstSlice = offer.slices?.[0];
                    const firstSegment = firstSlice?.segments?.[0];
                    const lastSegment = firstSlice?.segments?.[firstSlice.segments.length - 1];
                    const stopsCount = (firstSlice?.segments?.length || 1) - 1;
                    const airline = offer.airline_name || firstSegment?.carrier_name || 'Airline Partner';
                    const flightNum = firstSegment?.flight_number ? `${firstSegment.carrier_code || ''} ${firstSegment.flight_number}` : '';
                    const award = calculateAwardEstimation(offer.total_price, cabin);
                    const isExpanded = expandedOfferId === offer.id;

                    // Milestone D: Wallet balance vs needed comparison
                    const userBalance = walletProfile?.primaryCard?.pointsBalance || 0;
                    const hasEnoughPoints = userBalance >= award.rawMiles;

                    return (
                      <article key={offer.id} className="result-flight-card">
                        <div className="result-card-main-grid">
                          {/* 1. Airline branding */}
                          <div className="result-col-airline">
                            <div className="airline-badge-icon" aria-hidden="true">
                              {offer.airline_code || '✈️'}
                            </div>
                            <div className="airline-text-wrap">
                              <h4 className="airline-name-title">{airline}</h4>
                              <span className="airline-flight-num">{flightNum} • {cabin.toUpperCase()}</span>
                            </div>
                          </div>

                          {/* 2. Schedule and route */}
                          <div className="result-col-schedule">
                            <div className="schedule-point">
                              <span className="schedule-time">{formatFlightTime(firstSegment?.departing_at)}</span>
                              <span className="schedule-code">{firstSlice?.origin?.iata_code || origin}</span>
                            </div>

                            <div className="schedule-flight-path">
                              <span className="flight-duration">{formatDuration(firstSlice?.duration)}</span>
                              <div className="flight-route-line">
                                <div className="route-line-bar" />
                                <span className="route-plane-dot">✈</span>
                              </div>
                              <span className="flight-stops-label">
                                {stopsCount === 0
                                  ? t('results.stopsDirect')
                                  : `${stopsCount} ${stopsCount === 1 ? t('results.stopsOne') : t('results.stopsMulti')}`}
                              </span>
                            </div>

                            <div className="schedule-point text-right">
                              <span className="schedule-time">{formatFlightTime(lastSegment?.arriving_at)}</span>
                              <span className="schedule-code">{firstSlice?.destination?.iata_code || destination}</span>
                            </div>
                          </div>

                          {/* 3. Pricing & Award Comparison (Separated & Disclosed) */}
                          <div className="result-col-comparison">
                            <div className="comp-item-cash">
                              <span className="comp-label">{t('results.cashPrice')}</span>
                              <span className="comp-price-cash">
                                ${offer.total_amount} <small>{offer.currency}</small>
                              </span>
                              <span className="comp-cash-disclaimer">
                                {offer.is_demo ? 'Demo fare' : 'Duffel cash fare'}
                              </span>
                            </div>

                            <div className="comp-divider-arrow" aria-hidden="true">⇄</div>

                            <div className="comp-item-award">
                              <span className="comp-label-award">{t('results.awardValue')}</span>
                              <span className="comp-miles-amount font-mono">
                                {award.miles} <small>pts/millas</small>
                              </span>
                              <span className="award-tax-val">+${award.taxes} {t('results.taxesFees')}</span>
                              <div className="comp-savings-tag">
                                <span>✨ {t('results.potentialSavings')}: <strong>~${award.savings} USD</strong></span>
                              </div>
                              {walletProfile && (
                                <div style={{ fontSize: '11px', marginTop: '4px', color: hasEnoughPoints ? 'var(--color-sage, #2E6F40)' : 'var(--color-terracotta, #C85A32)' }}>
                                  {hasEnoughPoints
                                    ? `✓ ${language === 'es' ? 'Tienes suficientes puntos en tu billetera' : 'You have enough points in your wallet'}`
                                    : `⚠️ ${language === 'es' ? `Te faltan ${(award.rawMiles - userBalance).toLocaleString()} puntos` : `Need ${(award.rawMiles - userBalance).toLocaleString()} more points`}`}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 4. Action Buttons */}
                          <div className="result-col-actions">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="btn-expand-details"
                              onClick={() => toggleExpand(offer.id)}
                              aria-expanded={isExpanded}
                            >
                              {isExpanded ? (language === 'es' ? 'Ocultar detalles ▴' : 'Hide details ▴') : (language === 'es' ? 'Ver segmentos ▾' : 'View segments ▾')}
                            </Button>

                            <Button
                              variant="primary"
                              size="sm"
                              className="btn-select-offer"
                              onClick={() => setSelectedOfferForModal(offer)}
                            >
                              {t('results.viewOffer')} ➔
                            </Button>
                          </div>
                        </div>

                        {/* Collapsible Details Drawer */}
                        {isExpanded && (
                          <div className="result-expanded-drawer">
                            <h5 className="drawer-title">{language === 'es' ? 'Segmentos e itinerario de vuelo' : 'Flight Segments & Itinerary'}</h5>
                            <div className="drawer-segments-list">
                              {firstSlice?.segments?.map((seg, idx) => (
                                <div key={seg.id || idx} className="segment-detail-row">
                                  <div className="segment-order">#{idx + 1}</div>
                                  <div className="segment-info">
                                    <strong>{seg.carrier_name} ({seg.carrier_code} {seg.flight_number})</strong>
                                    <span>{seg.origin.city_name || seg.origin.iata_code} ({seg.origin.iata_code}) ➔ {seg.destination.city_name || seg.destination.iata_code} ({seg.destination.iata_code})</span>
                                  </div>
                                  <div className="segment-times">
                                    <span>{formatFlightTime(seg.departing_at)} – {formatFlightTime(seg.arriving_at)}</span>
                                    <span className="seg-duration">{formatDuration(seg.duration)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="drawer-award-tip">
                              💡 <strong>{language === 'es' ? 'Estrategia ilustrativa de canje:' : 'Illustrative Redemption Strategy:'}</strong>{' '}
                              {language === 'es'
                                ? `Transfiere ${award.miles} puntos de programas bancarios asociados hacia la aerolínea para ahorrar hasta $${award.savings} USD frente al pago íntegro en efectivo. (Estimación demostrativa sujeta a disponibilidad de plazas award).`
                                : `Transfer ${award.miles} points from transferable bank programs to the airline to save up to $${award.savings} USD over full cash fare. (Illustrative calculation; award seats subject to airline award inventory).`}
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Modal for Next Supported Step (Milestone A Rule 6) */}
          {selectedOfferForModal && (
            <div className="modal-backdrop" onClick={() => setSelectedOfferForModal(null)} role="dialog" aria-modal="true">
              <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3 className="modal-title">{language === 'es' ? 'Siguiente paso: Revisar con la aerolínea' : 'Next Step: Review with Airline'}</h3>
                  <button className="modal-close-btn" onClick={() => setSelectedOfferForModal(null)} aria-label="Close modal">✕</button>
                </div>
                <div className="modal-body">
                  <p>
                    {language === 'es'
                      ? `Has seleccionado la oferta con ${selectedOfferForModal.airline_name || 'la aerolínea'} para la ruta ${origin} ➔ ${destination}.`
                      : `You selected the offer with ${selectedOfferForModal.airline_name || 'the carrier'} for route ${origin} ➔ ${destination}.`}
                  </p>
                  <div className="modal-summary-box">
                    <div><strong>{language === 'es' ? 'Tarifa en efectivo:' : 'Cash Fare:'}</strong> ${selectedOfferForModal.total_amount} {selectedOfferForModal.currency}</div>
                    <div><strong>{language === 'es' ? 'Cabina:' : 'Cabin:'}</strong> {cabin.toUpperCase()}</div>
                    <div><strong>{language === 'es' ? 'Proveedor de datos:' : 'Data Provider:'}</strong> {selectedOfferForModal.provider}</div>
                  </div>
                  <div className="modal-disclaimer-note">
                    ℹ️ <strong>{language === 'es' ? 'Alcance de Hackathon MVP:' : 'Hackathon MVP Scope:'}</strong>{' '}
                    {language === 'es'
                      ? 'La emisión automática de billetes y pasarelas de pago bancario no están activadas en esta fase del prototipo. El siguiente paso recomendado es verificar la disponibilidad directamente en la web del transportista o transferir tus puntos bancarios.'
                      : 'Automatic ticket issuance and bank payment processing are not active in this prototype milestone. The recommended next step is to confirm availability directly on the carrier website or initiate points transfer.'}
                  </div>
                  <div className="modal-actions">
                    <Button variant="outline" size="sm" onClick={() => setSelectedOfferForModal(null)}>
                      {language === 'es' ? 'Cerrar' : 'Close'}
                    </Button>
                    <a
                      href={selectedOfferForModal.booking_url || `https://www.google.com/travel/flights?q=${origin}+to+${destination}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="primary" size="sm">
                        🌐 {language === 'es' ? `Visitar portal de ${selectedOfferForModal.airline_name || 'la aerolínea'}` : `Visit ${selectedOfferForModal.airline_name || 'Airline'} Site`}
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;
