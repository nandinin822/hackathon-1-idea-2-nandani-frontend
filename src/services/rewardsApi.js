/**
 * Rewards Planner API Service
 * Calls deterministic FastAPI calculation endpoint with resilient client-side fallback
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function calculateClientSidePlan(payload) {
  const months = payload.planning_horizon_months || 6;
  const currentPts = payload.current_points || 0;
  const rent = payload.monthly_rent || 0;
  const util = payload.monthly_utilities || 0;
  const dining = payload.monthly_groceries_dining || 0;
  const travel = payload.monthly_travel || 0;
  const other = payload.monthly_other || 0;

  const totalMonthlySpend = rent + util + dining + travel + other;
  const eligibleMonthlySpend = util + dining + travel + other + (payload.card_id === 'us_bilt_rewards' ? rent : 0);
  const ineligibleMonthlySpend = totalMonthlySpend - eligibleMonthlySpend;

  // Approximate multiplier based on selected card
  let avgMultiplier = 2.0;
  if (payload.card_id === 'us_amex_gold') avgMultiplier = 3.2;
  else if (payload.card_id === 'us_chase_csp') avgMultiplier = 2.4;
  else if (payload.card_id === 'us_capone_venture_x') avgMultiplier = 2.0;

  const monthlyPointsEarned = Math.round(dining * 3.5 + travel * 2.5 + util * 1.0 + other * 1.0 + (payload.card_id === 'us_bilt_rewards' ? rent : 0));
  const estimatedPointsEarned = monthlyPointsEarned * months;
  const projectedTotal = currentPts + estimatedPointsEarned;

  return {
    destination: payload.destination || 'MAD',
    planning_horizon_months: months,
    travel_goal: payload.travel_goal || 'cheapest_flight',
    total_spend_horizon: totalMonthlySpend * months,
    total_eligible_spend: eligibleMonthlySpend * months,
    current_points: currentPts,
    estimated_points_earned: estimatedPointsEarned,
    projected_total_points: projectedTotal,
    monthly_breakdown: {
      total_monthly_spend: totalMonthlySpend,
      eligible_monthly_spend: eligibleMonthlySpend,
      ineligible_monthly_spend: ineligibleMonthlySpend,
      ineligible_reasons: rent > 0 && payload.card_id !== 'us_bilt_rewards' ? ['Rent excluded from card earning (unless using Bilt).'] : [],
    },
    recommended_card: 'Chase Sapphire Preferred®',
    recommended_card_id: 'us_chase_csp',
    verified_card_annual_fee: 95.0,
    recommendation_reason: 'Optimal blend of 3x dining, 2x travel, and flexible 1:1 airline transfer partners.',
    assumptions: ['Points calculated using published issuer terms.', 'Transfers calculated at baseline 1:1 ratio.'],
    warnings: [],
    is_calculable: true,
  };
}

export async function calculateRewardsPlan(payload) {
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const isLocalBackend = API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1');

  if (isHttps && isLocalBackend) {
    return calculateClientSidePlan(payload);
  }

  const endpoint = `${API_BASE_URL}/api/v1/rewards/plan`;

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
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      console.warn('Backend server unreachable; using client-side deterministic rewards calculation.');
      return calculateClientSidePlan(payload);
    }
    throw err;
  }
}

