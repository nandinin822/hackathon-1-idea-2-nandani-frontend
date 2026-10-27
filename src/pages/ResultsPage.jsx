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
  return { miles: miles.toLocaleString(), taxes, savings };
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

  const fetchFlights = async () => {
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
    fetchFlights();
  }, [origin, destination, departure, returnDate, cabin, passengers]);

  const toggleExpand = (id) => {
    setExpandedOfferId((prev) => (prev === id ? null : id));
  };

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
                📅 {departure} {returnDate ? `— ${returnDate}` : `(${tripType === 'oneWay' ? 'Solo ida' : 'One Way'})`} • 👤 {passengers} {language === 'es' ? 'pasajero(s)' : 'passenger(s)'} • 💺 {cabin.toUpperCase()}
              </span>
            </div>
            <Link to="/#vuelos">
              <Button variant="outline" size="sm">
                ✏️ {t('results.modifySearch')}
              </Button>
            </Link>
          </div>

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
                  <Button variant="primary" size="sm" onClick={fetchFlights}>
                    🔄 {t('results.retryBtn')}
                  </Button>
                  <Link to="/#vuelos">
                    <Button variant="outline" size="sm">
                      {t('results.backToSearch')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Success State with Live Duffel Offers */}
          {!loading && !error && data && (
            <>
              {/* Offers Count & Live Pill */}
              <div className="results-status-banner">
                <div className="results-count-wrap">
                  <span className="results-count-num">{data.total_offers}</span>
                  <span className="results-count-text">
                    {t('results.offersFound')} {t('results.forRoute')} <strong>{origin} ➔ {destination}</strong>
                  </span>
                </div>
                <div className="duffel-live-tag">
                  <span className="live-pulse" /> Powered by Duffel API
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
                    const returnSlice = offer.slices?.[1];
                    const firstSegment = firstSlice?.segments?.[0];
                    const lastSegment = firstSlice?.segments?.[firstSlice.segments.length - 1];

                    const airline = offer.airline_name || firstSegment?.carrier_name || 'Commercial Airline';
                    const flightNum = firstSegment?.flight_number ? `${firstSegment.carrier_code} ${firstSegment.flight_number}` : offer.airline_code || 'Scheduled';
                    const departTime = formatFlightTime(firstSegment?.departing_at);
                    const arriveTime = formatFlightTime(lastSegment?.arriving_at);
                    const durationText = formatDuration(firstSlice?.duration);
                    const stopsCount = (firstSlice?.segments?.length || 1) - 1;

                    const award = calculateAwardEstimation(offer.total_price, cabin);
                    const isExpanded = expandedOfferId === offer.id;

                    return (
                      <article key={offer.id} className="result-card-live">
                        {/* Top Metadata Pill */}
                        <div className="result-card-header">
                          <span className="result-provider-pill">
                            <span className="sparkle">⚡</span> Duffel #{offer.id.slice(0, 14)}
                          </span>
                          <span className="result-route-code">
                            {firstSlice?.origin?.iata_code || origin} ➔ {firstSlice?.destination?.iata_code || destination}
                          </span>
                        </div>

                        <div className="result-card-main-grid">
                          {/* Col 1: Flight Itinerary */}
                          <div className="result-col-itinerary">
                            <div className="airline-badge-row">
                              <span className="carrier-icon">✈️</span>
                              <div>
                                <h4 className="carrier-name">{airline}</h4>
                                <span className="flight-code-label">{flightNum}</span>
                              </div>
                            </div>

                            <div className="flight-timeline-row">
                              <div className="time-block">
                                <span className="time-val">{departTime}</span>
                                <span className="airport-val">{firstSlice?.origin?.iata_code || origin}</span>
                              </div>

                              <div className="duration-track">
                                <span className="duration-label">{durationText}</span>
                                <div className="track-line">
                                  <span className="track-dot start" />
                                  <span className="track-dot end" />
                                </div>
                                <span className="stops-label">
                                  {stopsCount === 0
                                    ? t('results.stopsDirect')
                                    : `${stopsCount} ${stopsCount === 1 ? t('results.stopsOne') : t('results.stopsMulti')}`}
                                </span>
                              </div>

                              <div className="time-block">
                                <span className="time-val">{arriveTime}</span>
                                <span className="airport-val">{firstSlice?.destination?.iata_code || destination}</span>
                              </div>
                            </div>

                            {/* Return slice preview if roundtrip */}
                            {returnSlice && (
                              <div className="return-slice-badge">
                                <span>↩️ {language === 'es' ? 'Regreso' : 'Return'}: {formatFlightTime(returnSlice.segments?.[0]?.departing_at)} ➔ {formatFlightTime(returnSlice.segments?.[returnSlice.segments.length - 1]?.arriving_at)} ({formatDuration(returnSlice.duration)})</span>
                              </div>
                            )}
                          </div>

                          {/* Col 2: Cash Price & Points Comparison Math */}
                          <div className="result-col-comparison">
                            <div className="cash-price-box">
                              <span className="comp-label">{t('results.cashPrice')}</span>
                              <div className="cash-amount-row">
                                <span className="cash-val">${offer.total_price}</span>
                                <span className="currency-val">{offer.currency}</span>
                              </div>
                            </div>

                            <div className="award-points-box">
                              <div className="award-header-row">
                                <span className="comp-label-award">{t('results.awardValue')}</span>
                                <span className="transfer-ratio-chip">1:1 Partners</span>
                              </div>
                              <div className="award-amount-row">
                                <span className="award-miles-val">{award.miles}</span>
                                <span className="award-miles-unit">millas</span>
                                <span className="award-tax-val">+${award.taxes} {t('results.taxesFees')}</span>
                              </div>
                              <div className="award-savings-highlight">
                                <span>✨ {t('results.potentialSavings')}: <strong>~${award.savings} USD</strong></span>
                              </div>
                            </div>
                          </div>

                          {/* Col 3: Actions */}
                          <div className="result-col-actions">
                            <button
                              type="button"
                              className="view-details-btn"
                              onClick={() => toggleExpand(offer.id)}
                            >
                              {isExpanded ? (language === 'es' ? 'Ocultar detalles' : 'Hide details') : (language === 'es' ? 'Ver detalles' : 'Flight details')}
                            </button>
                            <Button
                              variant="primary"
                              size="sm"
                              className="select-offer-btn"
                              onClick={() => {
                                alert(`Redirigiendo a reserva oficial con ${airline} (${flightNum}) por ${offer.total_amount} ${offer.currency}.`);
                              }}
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
                              💡 <strong>{language === 'es' ? 'Estrategia recomendada:' : 'Recommended Strategy:'}</strong> {language === 'es' ? `Transfiere ${award.miles} puntos de Amex o Chase hacia la alianza de ${airline} para ahorrar hasta $${award.savings} USD frente al pago íntegro en efectivo.` : `Transfer ${award.miles} points from Amex or Chase to ${airline}'s alliance to save up to $${award.savings} USD compared to paying full cash.`}
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
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;
