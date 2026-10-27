/**
 * API Service Client
 * 
 * Configured to communicate with the FastAPI backend deployed on Render.
 * Reads base URL from VITE_API_URL environment variable.
 * Note: Never store sensitive API secrets (Amadeus, Award Providers, etc.) in frontend code.
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Standard fetch wrapper for backend communication
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || `API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // In development or when backend is not yet spun up, gracefully bubble error
    console.warn(`[API] Error calling ${endpoint}:`, error.message);
    throw error;
  }
}

export const apiService = {
  baseUrl: API_BASE_URL,
  
  /**
   * Ping backend health endpoint
   */
  async checkHealth() {
    return request('/health');
  },

  /**
   * Generic GET request
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const path = queryString ? `${endpoint}?${queryString}` : endpoint;
    return request(path, { method: 'GET' });
  },

  /**
   * Generic POST request
   */
  async post(endpoint, data = {}) {
    return request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

export default apiService;
