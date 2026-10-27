/**
 * Flight API Service for BookMyFlight
 * Connects frontend to the FastAPI backend (Duffel flight search)
 * Includes seamless offline / demo mode fallback when backend is sleeping or unreachable.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function generateClientDemoOffers({ origin, destination, departureDate, returnDate, passengers, cabinClass }) {
  const isBusiness = cabinClass === 'business' || cabinClass === 'first';
  const multiplier = isBusiness ? 3.2 : 1.0;

  const demoAirlines = [
    { name: 'Iberia', code: 'IB', flight: 'IB6251', dur: '8h 25m', priceBase: 480 * multiplier },
    { name: 'Lufthansa', code: 'LH', flight: 'LH401', dur: '9h 15m', priceBase: 520 * multiplier },
    { name: 'British Airways', code: 'BA', flight: 'BA175', dur: '8h 40m', priceBase: 510 * multiplier },
    { name: 'Air France', code: 'AF', flight: 'AF022', dur: '8h 50m', priceBase: 495 * multiplier },
  ];

  const offers = demoAirlines.map((airline, idx) => {
    const price = Math.round(airline.priceBase * (passengers || 1));
    const sliceId = `sli_demo_${idx}_${origin}_${destination}`;
    const slices = [
      {
        id: sliceId,
        origin: { iata_code: origin, name: `${origin} International`, city_name: origin },
        destination: { iata_code: destination, name: `${destination} International`, city_name: destination },
        duration: airline.dur,
        segments: [
          {
            id: `seg_${idx}_out`,
            origin: { iata_code: origin, name: `${origin} International`, city_name: origin },
            destination: { iata_code: destination, name: `${destination} International`, city_name: destination },
            departing_at: `${departureDate}T12:30:00`,
            arriving_at: `${departureDate}T20:55:00`,
            carrier_name: airline.name,
            carrier_code: airline.code,
            flight_number: airline.flight,
            duration: airline.dur,
          },
        ],
      },
    ];

    if (returnDate) {
      slices.push({
        id: `sli_demo_${idx}_ret`,
        origin: { iata_code: destination, name: `${destination} International`, city_name: destination },
        destination: { iata_code: origin, name: `${origin} International`, city_name: origin },
        duration: airline.dur,
        segments: [
          {
            id: `seg_${idx}_ret`,
            origin: { iata_code: destination, name: `${destination} International`, city_name: destination },
            destination: { iata_code: origin, name: `${origin} International`, city_name: origin },
            departing_at: `${returnDate}T18:10:00`,
            arriving_at: `${returnDate}T06:35:00`,
            carrier_name: airline.name,
            carrier_code: airline.code,
            flight_number: `${airline.code}${parseInt(airline.flight.slice(2), 10) + 1}`,
            duration: airline.dur,
          },
        ],
      });
    }

    return {
      id: `off_demo_${idx}_${Date.now()}`,
      total_price: price,
      total_amount: price.toFixed(2),
      currency: 'USD',
      airline_name: airline.name,
      airline_code: airline.code,
      cabin_class: cabinClass,
      is_demo: true,
      booking_url: `https://www.${airline.name.toLowerCase().replace(/\s+/g, '')}.com`,
      slices,
      provider: 'duffel-sandbox',
    };
  });

  return {
    search_id: `orq_demo_${Date.now()}`,
    total_offers: offers.length,
    offers,
    provider: 'duffel-sandbox',
    live_mode: false,
    is_demo: true,
    demo_notice: 'Duffel Sandbox Mode: Realistic test flight offers and mileage valuations generated for demonstration.',
  };
}

/**
 * Searches cash flights via FastAPI backend with resilient client-side demo fallback
 */
export async function searchCashFlights({
  origin,
  destination,
  departureDate,
  returnDate,
  passengers = 1,
  cabinClass = 'economy',
  demoMode = false,
}) {
  const payload = {
    origin: origin.trim().toUpperCase(),
    destination: destination.trim().toUpperCase(),
    departure_date: departureDate,
    return_date: returnDate || null,
    passengers: parseInt(passengers, 10) || 1,
    cabin_class: cabinClass.toLowerCase(),
  };

  // If in pure demoMode or running on remote HTTPS without backend configured, fall back gracefully
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const isLocalBackend = API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1');

  if (demoMode || (isHttps && isLocalBackend)) {
    console.info('Connecting to client-side flight engine (Sandbox mode on Vercel / demo)...');
    return generateClientDemoOffers({
      origin: payload.origin,
      destination: payload.destination,
      departureDate: payload.departure_date,
      returnDate: payload.return_date,
      passengers: payload.passengers,
      cabinClass: payload.cabin_class,
    });
  }

  const queryStr = demoMode ? '?demo_mode=true' : '';
  const endpoint = `${API_BASE_URL}/api/v1/flights/cash${queryStr}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorDetail = 'Flight search failed';
      try {
        const errorData = await response.json();
        if (typeof errorData.detail === 'string') {
          errorDetail = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          errorDetail = errorData.detail.map((d) => d.msg || d.message).join('; ');
        }
      } catch {
        errorDetail = `Server responded with HTTP ${response.status}: ${response.statusText}`;
      }

      const err = new Error(errorDetail);
      err.status = response.status;
      throw err;
    }

    const data = await response.json();
    return data;
  } catch (err) {
    // If backend connection fails (mixed content or server offline), provide seamless demo offers
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      console.warn('Backend server unreachable; falling back to realistic sandbox flight offers.');
      return generateClientDemoOffers({
        origin: payload.origin,
        destination: payload.destination,
        departureDate: payload.departure_date,
        returnDate: payload.return_date,
        passengers: payload.passengers,
        cabinClass: payload.cabin_class,
      });
    }
    throw err;
  }
}

/**
 * Health check ping to backend
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      const data = await response.json();
      return { online: true, ...data };
    }
    return { online: false, status: response.status };
  } catch {
    return { online: false, status: 0 };
  }
}

