import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../localization/useLanguage';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import './SubPages.css';

export const TripPlannerPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [origin, setOrigin] = useState('Madrid (MAD)');
  const [stops, setStops] = useState([
    { city: 'Tokyo (NRT)', stayDays: 5 },
    { city: 'Kyoto / Osaka (KIX)', stayDays: 4 },
  ]);
  const [departureDate, setDepartureDate] = useState(
    new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0]
  );
  const [returnDate, setReturnDate] = useState(
    new Date(Date.now() + 31 * 86400000).toISOString().split('T')[0]
  );
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('economy');

  // Step 3 optional preferences (clearly marked as illustrative/estimates)
  const [hotelPref, setHotelPref] = useState('boutique');
  const [activityPref, setActivityPref] = useState('culture_food');
  const [hotelBudget, setHotelBudget] = useState('medium');

  const [errorMsg, setErrorMsg] = useState(null);

  const addStop = () => {
    if (stops.length >= 5) return;
    setStops([...stops, { city: '', stayDays: 3 }]);
  };

  const removeStop = (idx) => {
    if (stops.length <= 1) return;
    setStops(stops.filter((_, i) => i !== idx));
  };

  const updateStopCity = (idx, val) => {
    const updated = [...stops];
    updated[idx].city = val;
    setStops(updated);
  };

  const updateStopDays = (idx, val) => {
    const updated = [...stops];
    updated[idx].stayDays = Math.max(1, parseInt(val, 10) || 1);
    setStops(updated);
  };

  const validateStep1 = () => {
    if (!origin.trim()) {
      setErrorMsg(language === 'es' ? 'Por favor introduce una ciudad o aeropuerto de origen.' : 'Please enter an origin airport or city.');
      return false;
    }
    for (let i = 0; i < stops.length; i++) {
      if (!stops[i].city.trim()) {
        setErrorMsg(language === 'es' ? `Completa el destino para la parada #${i + 1}.` : `Please enter a city for stop #${i + 1}.`);
        return false;
      }
    }
    setErrorMsg(null);
    return true;
  };

  const validateStep2 = () => {
    if (!departureDate) {
      setErrorMsg(language === 'es' ? 'Selecciona una fecha de salida.' : 'Please select a departure date.');
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setErrorMsg(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const totalTripDays = stops.reduce((acc, s) => acc + (s.stayDays || 0), 0);

  return (
    <div className="subpage">
      <header className="page-header">
        <div className="container page-header-container">
          <div className="subpage-badge">
            <Badge variant="terracotta">
              {language === 'es' ? 'Planificador Multi-Parada' : 'Multi-City Trip Planner'}
            </Badge>
          </div>
          <h1 className="page-title">{t('nav.tripPlanner')}</h1>
          <p className="page-subtitle">
            {language === 'es'
              ? 'Diseña itinerarios complejos con múltiples ciudades, gestiona estancias y optimiza canjes de billetes combinados.'
              : 'Design multi-destination itineraries, manage stops, and plan connected award hops.'}
          </p>
        </div>
      </header>

      <main className="page-body">
        <div className="container" style={{ maxWidth: '820px' }}>
          {/* Progress Indicator */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '1px solid rgba(220, 210, 195, 0.7)', paddingBottom: '16px' }}>
            {[
              { step: 1, label: language === 'es' ? '1. Ruta y Paradas' : '1. Route & Stops' },
              { step: 2, label: language === 'es' ? '2. Fechas y Pasajeros' : '2. Dates & Cabin' },
              { step: 3, label: language === 'es' ? '3. Alojamiento (Demo)' : '3. Stays & Prefs (Demo)' },
              { step: 4, label: language === 'es' ? '4. Resumen Itinerario' : '4. Itinerary Review' },
            ].map((s) => (
              <div
                key={s.step}
                style={{
                  fontSize: '13px',
                  fontWeight: currentStep === s.step ? 700 : 500,
                  color: currentStep === s.step ? 'var(--color-terracotta, #1648a3)' : (currentStep > s.step ? 'var(--color-sage, #2E6F40)' : 'var(--color-espresso-500)'),
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{currentStep > s.step ? '✓' : `Step ${s.step}:`}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          {errorMsg && (
            <div style={{ background: 'rgba(22, 72, 163, 0.1)', color: 'var(--color-terracotta, #1648a3)', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', fontWeight: 600 }}>
              ⚠️ {errorMsg}
            </div>
          )}

          {/* STEP 1: ROUTE & MULTI-STOP DESTINATIONS */}
          {currentStep === 1 && (
            <div style={{ background: '#FAF7F2', border: '1px solid rgba(220, 210, 195, 0.9)', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-espresso-950)', margin: '0 0 16px 0' }}>
                🛫 {language === 'es' ? 'Origen y Ciudades del Viaje' : 'Origin & Destinations'}
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--color-espresso-800)', marginBottom: '4px' }}>
                  {language === 'es' ? 'Punto de Partida (Origen):' : 'Departure Point (Origin):'}
                </label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Madrid (MAD), New York (JFK)"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid rgba(220, 210, 195, 0.9)', background: '#FFFFFF', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--color-espresso-800)', marginBottom: '8px' }}>
                  {language === 'es' ? 'Paradas / Destinos Intermedios:' : 'Journey Stops / Intermediate Cities:'}
                </label>
                {stops.map((stop, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 140px 40px', gap: '8px', marginBottom: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={stop.city}
                      onChange={(e) => updateStopCity(idx, e.target.value)}
                      placeholder={`Stop #${idx + 1} (e.g. Paris, Tokyo)`}
                      style={{ padding: '9px 12px', borderRadius: '6px', border: '1px solid rgba(220, 210, 195, 0.9)', background: '#FFFFFF', fontSize: '13px' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#FFFFFF', padding: '0 8px', borderRadius: '6px', border: '1px solid rgba(220, 210, 195, 0.9)' }}>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={stop.stayDays}
                        onChange={(e) => updateStopDays(idx, e.target.value)}
                        style={{ width: '50px', border: 'none', padding: '8px 0', fontSize: '13px', textAlign: 'center', fontWeight: 600 }}
                      />
                      <span style={{ fontSize: '11px', color: 'var(--color-espresso-600)' }}>
                        {language === 'es' ? 'días' : 'days'}
                      </span>
                    </div>
                    {stops.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeStop(idx)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--color-terracotta, #1648a3)', cursor: 'pointer', fontSize: '18px', padding: '0' }}
                        title="Remove stop"
                      >
                        ✕
                      </button>
                    ) : <span />}
                  </div>
                ))}

                {stops.length < 5 && (
                  <button
                    type="button"
                    onClick={addStop}
                    style={{ background: 'transparent', border: '1px dashed var(--color-terracotta, #1648a3)', color: 'var(--color-terracotta, #1648a3)', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', marginTop: '6px' }}
                  >
                    + {language === 'es' ? 'Añadir otra parada / destino' : 'Add another stop'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: DATES, PASSENGERS & CABIN */}
          {currentStep === 2 && (
            <div style={{ background: '#FAF7F2', border: '1px solid rgba(220, 210, 195, 0.9)', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-espresso-950)', margin: '0 0 16px 0' }}>
                📅 {language === 'es' ? 'Fechas, Cabina y Pasajeros' : 'Dates, Cabin & Passengers'}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--color-espresso-800)', marginBottom: '4px' }}>
                    {language === 'es' ? 'Fecha de inicio del viaje:' : 'Trip Departure Date:'}
                  </label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(220, 210, 195, 0.9)', background: '#FFFFFF', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--color-espresso-800)', marginBottom: '4px' }}>
                    {language === 'es' ? 'Fecha estimada de regreso:' : 'Estimated Return Date:'}
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(220, 210, 195, 0.9)', background: '#FFFFFF', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--color-espresso-800)', marginBottom: '4px' }}>
                    {language === 'es' ? 'Número de pasajeros:' : 'Number of Passengers:'}
                  </label>
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(parseInt(e.target.value, 10) || 1)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(220, 210, 195, 0.9)', background: '#FFFFFF', fontSize: '13px' }}
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? (language === 'es' ? 'pasajero' : 'passenger') : (language === 'es' ? 'pasajeros' : 'passengers')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--color-espresso-800)', marginBottom: '4px' }}>
                    {language === 'es' ? 'Clase de cabina:' : 'Cabin Class:'}
                  </label>
                  <select
                    value={cabinClass}
                    onChange={(e) => setCabinClass(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(220, 210, 195, 0.9)', background: '#FFFFFF', fontSize: '13px' }}
                  >
                    <option value="economy">Economy</option>
                    <option value="premium_economy">Premium Economy</option>
                    <option value="business">Business Class (Lie-Flat)</option>
                    <option value="first">First Class</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: OPTIONAL HOTEL & ACTIVITIES PREFERENCES (DEMO LABELLED) */}
          {currentStep === 3 && (
            <div style={{ background: '#FAF7F2', border: '1px solid rgba(220, 210, 195, 0.9)', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-espresso-950)', margin: 0 }}>
                  🏨 {language === 'es' ? 'Preferencias de Estancia y Actividades' : 'Hotel & Activities Preferences'}
                </h3>
                <Badge variant="terracotta">
                  {language === 'es' ? 'DATOS DEMO / ESTIMACIÓN' : 'DEMO ESTIMATES ONLY'}
                </Badge>
              </div>

              <div style={{ background: 'rgba(220, 210, 195, 0.35)', padding: '10px 14px', borderRadius: '6px', fontSize: '12px', color: 'var(--color-espresso-700)', marginBottom: '18px', lineHeight: 1.5 }}>
                ℹ️ <strong>{language === 'es' ? 'Aviso de Transparencia:' : 'Transparency Notice:'}</strong>{' '}
                {language === 'es'
                  ? 'Las APIs de reservas hoteleras en vivo no están conectadas en este MVP. Estas preferencias se usan únicamente para estimar el presupuesto del itinerario y calcular puntos transferibles hacia cadenas hoteleras (Hyatt, Marriott).'
                  : 'Live hotel and activity booking APIs are not connected in this prototype. These preferences are used strictly for rough itinerary budgeting and loyalty transfer estimates (Hyatt, Marriott).'}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--color-espresso-800)', marginBottom: '4px' }}>
                    {language === 'es' ? 'Tipo de Alojamiento preferido:' : 'Preferred Accommodation:'}
                  </label>
                  <select
                    value={hotelPref}
                    onChange={(e) => setHotelPref(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(220, 210, 195, 0.9)', background: '#FFFFFF', fontSize: '13px' }}
                  >
                    <option value="boutique">{language === 'es' ? 'Hoteles Boutique / Diseño' : 'Boutique / Design Hotels'}</option>
                    <option value="chain_loyalty">{language === 'es' ? 'Cadenas con Puntos (Hyatt / Marriott)' : 'Points Chains (Hyatt / Marriott)'}</option>
                    <option value="apartment">{language === 'es' ? 'Apartamentos céntricos' : 'Centric Apartments'}</option>
                    <option value="budget">{language === 'es' ? 'Hostels y B&B económicos' : 'Budget Hostels / B&B'}</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--color-espresso-800)', marginBottom: '4px' }}>
                    {language === 'es' ? 'Rango de presupuesto estimado / noche:' : 'Estimated Nightly Budget:'}
                  </label>
                  <select
                    value={hotelBudget}
                    onChange={(e) => setHotelBudget(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(220, 210, 195, 0.9)', background: '#FFFFFF', fontSize: '13px' }}
                  >
                    <option value="budget">$70 - $120 USD / {language === 'es' ? 'noche' : 'night'}</option>
                    <option value="medium">$150 - $250 USD / {language === 'es' ? 'noche' : 'night'}</option>
                    <option value="luxury">$350+ USD / {language === 'es' ? 'noche' : 'night'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--color-espresso-800)', marginBottom: '4px' }}>
                  {language === 'es' ? 'Enfoque principal de experiencias:' : 'Core Activity Focus:'}
                </label>
                <select
                  value={activityPref}
                  onChange={(e) => setActivityPref(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(220, 210, 195, 0.9)', background: '#FFFFFF', fontSize: '13px' }}
                >
                  <option value="culture_food">{language === 'es' ? 'Gastronomía local, museos y cultura' : 'Local Gastronomy, Museums & Culture'}</option>
                  <option value="nature_adventure">{language === 'es' ? 'Senderismo, naturaleza y escapadas' : 'Nature, Hiking & Outdoor Adventures'}</option>
                  <option value="shopping_relaxation">{language === 'es' ? 'Compras, spas y relajación urbana' : 'Shopping, Spas & Urban Relaxation'}</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 4: ITINERARY REVIEW & SUMMARY */}
          {currentStep === 4 && (
            <div style={{ background: '#FAF7F2', border: '1px solid rgba(220, 210, 195, 0.9)', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-espresso-950)', margin: '0 0 16px 0' }}>
                🗺️ {language === 'es' ? 'Resumen Completo de tu Itinerario' : 'Itinerary Overview & Summary'}
              </h3>

              <div style={{ background: '#FFFFFF', borderRadius: '8px', border: '1px solid rgba(220, 210, 195, 0.8)', padding: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', borderBottom: '1px solid rgba(220, 210, 195, 0.5)', paddingBottom: '8px' }}>
                  <strong>{language === 'es' ? 'Ruta Principal:' : 'Primary Route:'}</strong>
                  <span style={{ color: 'var(--color-terracotta, #1648a3)', fontWeight: 700 }}>
                    {origin} ➔ {stops.map((s) => s.city).join(' ➔ ')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-espresso-700)', padding: '4px 0' }}>
                  <span>{language === 'es' ? 'Salida:' : 'Departure:'}</span>
                  <strong>{departureDate}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-espresso-700)', padding: '4px 0' }}>
                  <span>{language === 'es' ? 'Regreso estimado:' : 'Return:'}</span>
                  <strong>{returnDate}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-espresso-700)', padding: '4px 0' }}>
                  <span>{language === 'es' ? 'Duración total de paradas:' : 'Total stops stay duration:'}</span>
                  <strong>{totalTripDays} {language === 'es' ? 'días' : 'days'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-espresso-700)', padding: '4px 0' }}>
                  <span>{language === 'es' ? 'Pasajeros y Cabina:' : 'Passengers & Cabin:'}</span>
                  <strong>{passengers} • {cabinClass.toUpperCase()}</strong>
                </div>
              </div>

              <div style={{ background: 'rgba(46, 111, 64, 0.08)', border: '1px solid rgba(46, 111, 64, 0.25)', borderRadius: '8px', padding: '14px', marginBottom: '18px' }}>
                <strong style={{ display: 'block', color: 'var(--color-sage, #2E6F40)', marginBottom: '4px', fontSize: '13px' }}>
                  ✨ {language === 'es' ? 'Estrategia de Emisión Multi-Ciudad:' : 'Multi-City Award Strategy:'}
                </strong>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-espresso-800)', lineHeight: 1.5 }}>
                  {language === 'es'
                    ? `Puedes emitir el primer tramo intercontinental (${origin} ➔ ${stops[0]?.city}) mediante canje de millas (ej. Flying Blue o Avios), y conectar las ciudades intermedias con billetes locales de bajo coste o pases de tren de alta velocidad.`
                    : `Issue the long-haul leg (${origin} ➔ ${stops[0]?.city}) using transferable airline points (e.g. Flying Blue or Avios), and connect intermediate cities with regional budget fares or rail passes.`}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Link
                  to={`/results?origin=${encodeURIComponent(origin.slice(-4, -1)) || 'JFK'}&destination=${encodeURIComponent(stops[0]?.city.slice(-4, -1)) || 'NRT'}&departure=${departureDate}&cabin=${cabinClass}&passengers=${passengers}`}
                  style={{ flex: 1 }}
                >
                  <Button variant="primary" size="md" style={{ width: '100%' }}>
                    ✈️ {language === 'es' ? 'Buscar Vuelos para el Tramo 1' : 'Search Flights for Leg 1'}
                  </Button>
                </Link>
                <Link to="/wallet" style={{ flex: 1 }}>
                  <Button variant="outline" size="md" style={{ width: '100%' }}>
                    💳 {language === 'es' ? 'Verificar Mis Puntos en Wallet' : 'Check Points in Wallet'}
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            {currentStep > 1 ? (
              <Button variant="outline" size="sm" onClick={handleBack}>
                ← {language === 'es' ? 'Atrás' : 'Back'}
              </Button>
            ) : <span />}

            {currentStep < 4 ? (
              <Button variant="primary" size="sm" onClick={handleNext}>
                {language === 'es' ? 'Siguiente paso →' : 'Next Step →'}
              </Button>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TripPlannerPage;
