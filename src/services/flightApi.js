/**
 * Flight API Service for BookMyFlight
 * Connects frontend to the FastAPI backend (Duffel flight search)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/**
 * Searches cash flights via FastAPI backend
 * @param {Object} params
 * @param {string} params.origin - 3-letter IATA code (e.g. 'MAD', 'JFK')
 * @param {string} params.destination - 3-letter IATA code (e.g. 'JNB', 'LHR')
 * @param {string} params.departureDate - YYYY-MM-DD
 * @param {string} [params.returnDate] - YYYY-MM-DD (optional for one-way)
 * @param {number|string} [params.passengers=1] - 1-9
 * @param {string} [params.cabinClass='economy'] - economy, premium_economy, business, first
 * @returns {Promise<{ search_id: string, total_offers: number, offers: Array, provider: string }>}
 */
export async function searchCashFlights({
  origin,
  destination,
  departureDate,
  returnDate,
  passengers = 1,
  cabinClass = 'economy',
}) {
  const payload = {
    origin: origin.trim().toUpperCase(),
    destination: destination.trim().toUpperCase(),
    departure_date: departureDate,
    return_date: returnDate || null,
    passengers: parseInt(passengers, 10) || 1,
    cabin_class: cabinClass.toLowerCase(),
  };

  const endpoint = `${API_BASE_URL}/api/v1/flights/cash`;

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
          // Pydantic validation error format
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
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const connErr = new Error(
        'Unable to connect to the flight search backend server. Please verify the backend is running on ' +
          API_BASE_URL
      );
      connErr.status = 0;
      throw connErr;
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
