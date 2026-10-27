/**
 * Rewards Planner API Service
 * Calls deterministic FastAPI calculation endpoint
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export async function calculateRewardsPlan(payload) {
  const endpoint = `${API_BASE_URL}/api/v1/rewards/plan`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorDetail = 'Failed to calculate rewards plan';
    try {
      const errJson = await response.json();
      if (typeof errJson.detail === 'string') {
        errorDetail = errJson.detail;
      } else if (Array.isArray(errJson.detail)) {
        errorDetail = errJson.detail.map((d) => d.msg || d.message).join('; ');
      }
    } catch {
      errorDetail = `Server error ${response.status}`;
    }
    const error = new Error(errorDetail);
    error.status = response.status;
    throw error;
  }

  return await response.json();
}
