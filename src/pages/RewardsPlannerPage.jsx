import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../localization/useLanguage';
import { calculateRewardsPlan } from '../services/rewardsApi';
import { CARDS_CATALOGUE } from '../data/cardsCatalog';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import './SubPages.css';
import './RewardsPlannerPage.css';

export const RewardsPlannerPage = () => {
  const { t, language } = useLanguage();

  const [destination, setDestination] = useState('Madrid (MAD)');
  const [horizonMonths, setHorizonMonths] = useState(6);
  const [goal, setGoal] = useState('cheapest_flight');
  const [selectedCardId, setSelectedCardId] = useState('us_chase_csp');
  const [currentPoints, setCurrentPoints] = useState(15000);
  const [monthlyRent, setMonthlyRent] = useState(1400);
  const [monthlyGroceries, setMonthlyGroceries] = useState(650);
  const [monthlyUtilities, setMonthlyUtilities] = useState(180);
  const [monthlyTravel, setMonthlyTravel] = useState(250);
  const [monthlyOther, setMonthlyOther] = useState(350);
  const [feePref, setFeePref] = useState('any');

  const [loading, setLoading] = useState(false);
  const [planResult, setPlanResult] = useState(null);
  const [calcError, setCalcError] = useState(null);

  // Load user's saved card wallet from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bmf_card_wallet');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.primaryCard?.cardId) {
          setSelectedCardId(parsed.primaryCard.cardId);
        }
        if (typeof parsed.primaryCard?.pointsBalance === 'number') {
          setCurrentPoints(parsed.primaryCard.pointsBalance);
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleCalculate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setCalcError(null);

    const payload = {
      destination: destination.trim() || 'MAD',
      planning_horizon_months: horizonMonths,
      travel_goal: goal,
      card_id: selectedCardId || null,
      current_points: parseInt(currentPoints, 10) || 0,
      monthly_rent: parseFloat(monthlyRent) || 0.0,
      monthly_utilities: parseFloat(monthlyUtilities) || 0.0,
      monthly_groceries_dining: parseFloat(monthlyGroceries) || 0.0,
      monthly_travel: parseFloat(monthlyTravel) || 0.0,
      monthly_other: parseFloat(monthlyOther) || 0.0,
      currency: 'USD',
      annual_fee_preference: feePref,
    };

    try {
      const result = await calculateRewardsPlan(payload);
      setPlanResult(result);
    } catch (err) {
      console.error('Calculation error:', err);
      setCalcError(err.message || 'Error communicating with backend rewards engine.');
    } finally {
      setLoading(false);
    }
  };

  // Run initial calculation once on mount
  useEffect(() => {
    handleCalculate();
  }, [horizonMonths, goal, selectedCardId]);

  return (
    <div className="subpage planner-page-view">
      <header className="page-header">
        <div className="container page-header-container">
          <div className="subpage-badge">
            <Badge variant="terracotta">
              {language === 'es' ? 'Motor de Cálculo Determinista' : 'Deterministic Calculation Engine'}
            </Badge>
          </div>
          <h1 className="page-title">{t('rewardsPlanner.title', 'Trip Rewards Planner')}</h1>
          <p className="page-subtitle">
            {t(
              'rewardsPlanner.subtitle',
              'Plan future trip goals over 1 to 12 months. Python calculates points earned on your verified everyday expenses and highlights ineligible spend.'
            )}
          </p>
        </div>
      </header>

      <main className="page-body">
        <div className="container">
          <div className="planner-grid">
            {/* Left Column: Form Inputs */}
            <div className="planner-form-card">
              <form onSubmit={handleCalculate}>
                {/* 1. Planning Horizon */}
                <div className="form-block">
                  <label className="form-block-title">
                    <span>1.</span> {language === 'es' ? 'Horizonte de planificación' : 'Planning Horizon (Months)'}
                  </label>
                  <div className="horizon-tabs" role="radiogroup">
                    {[1, 3, 6, 12].map((months) => (
                      <button
                        key={months}
                        type="button"
                        className={`horizon-tab-btn ${horizonMonths === months ? 'active' : ''}`}
                        onClick={() => setHorizonMonths(months)}
                      >
                        {months} {language === 'es' ? (months === 1 ? 'Mes' : 'Meses') : (months === 1 ? 'Month' : 'Months')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Destination & Goal */}
                <div className="form-block">
                  <label className="form-block-title">
                    <span>2.</span> {language === 'es' ? 'Destino y objetivo de canje' : 'Destination & Travel Goal'}
                  </label>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-espresso-700)', display: 'block', marginBottom: '4px' }}>
                      {language === 'es' ? 'Ciudad o aeropuerto de destino:' : 'Destination City or Airport:'}
                    </label>
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="e.g. Madrid, Tokyo, London"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        border: '1px solid rgba(220, 210, 195, 0.8)',
                        background: '#FFFFFF',
                        fontSize: '14px',
                      }}
                    />
                  </div>

                  <div className="goal-selector-grid">
                    <button
                      type="button"
                      className={`goal-card-btn ${goal === 'cheapest_flight' ? 'active' : ''}`}
                      onClick={() => setGoal('cheapest_flight')}
                    >
                      <span className="goal-icon">💰</span>
                      <span className="goal-name">{language === 'es' ? 'Vuelo Económico' : 'Cheapest Flight'}</span>
                      <span className="goal-sub">{language === 'es' ? 'Maximizar ahorro en billetes estándar' : 'Maximize savings on standard tickets'}</span>
                    </button>
                    <button
                      type="button"
                      className={`goal-card-btn ${goal === 'business_class' ? 'active' : ''}`}
                      onClick={() => setGoal('business_class')}
                    >
                      <span className="goal-icon">🥂</span>
                      <span className="goal-name">Business Class</span>
                      <span className="goal-sub">{language === 'es' ? 'Alcanzar plazas premium con millas' : 'Target premium lie-flat award seats'}</span>
                    </button>
                    <button
                      type="button"
                      className={`goal-card-btn ${goal === 'earn_faster' ? 'active' : ''}`}
                      onClick={() => setGoal('earn_faster')}
                    >
                      <span className="goal-icon">⚡</span>
                      <span className="goal-name">{language === 'es' ? 'Acelerar Puntos' : 'Earn Faster'}</span>
                      <span className="goal-sub">{language === 'es' ? 'Mayor velocidad en gasto diario' : 'Highest accumulation velocity'}</span>
                    </button>
                  </div>
                </div>

                {/* 3. Card & Current Balance */}
                <div className="form-block">
                  <label className="form-block-title">
                    <span>3.</span> {language === 'es' ? 'Tarjeta activa y saldo actual' : 'Active Card & Current Points'}
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '12px' }}>
                    <div>
                      <select
                        value={selectedCardId}
                        onChange={(e) => setSelectedCardId(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '6px',
                          border: '1px solid rgba(220, 210, 195, 0.8)',
                          background: '#FFFFFF',
                          fontSize: '13px',
                        }}
                      >
                        {CARDS_CATALOGUE.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.issuer})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={currentPoints}
                        onChange={(e) => setCurrentPoints(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        placeholder="Pts balance"
                        title="Current Points Balance"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: '1px solid rgba(220, 210, 195, 0.8)',
                          background: '#FFFFFF',
                          fontSize: '14px',
                          fontFamily: 'monospace',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Monthly Expenses Breakdown */}
                <div className="form-block">
                  <label className="form-block-title">
                    <span>4.</span> {language === 'es' ? 'Gastos mensuales promedio ($ USD)' : 'Average Monthly Expenses ($ USD)'}
                  </label>
                  <p style={{ fontSize: '12px', color: 'var(--color-espresso-600)', margin: '-4px 0 12px 0' }}>
                    {language === 'es'
                      ? 'Introduce tus gastos típicos. Las categorías no elegibles (ej. alquiler sin Bilt) se excluyen automáticamente del cálculo de puntos.'
                      : 'Enter your typical monthly expenses. Ineligible categories (e.g. rent without Bilt) are strictly excluded from points calculations.'}
                  </p>

                  <div className="expenses-inputs-grid">
                    {/* Rent */}
                    <div className="expense-field-box">
                      <div className="expense-label-row">
                        <span className="expense-label">{language === 'es' ? 'Alquiler / Hipoteca' : 'Rent / Housing'}</span>
                        <span className="expense-multiplier-hint">
                          {selectedCardId === 'us_bilt_rewards' ? '1x con Bilt' : '0x (Excluido)'}
                        </span>
                      </div>
                      <div className="expense-input-row">
                        <span className="currency-symbol">$</span>
                        <input
                          type="number"
                          min="0"
                          step="50"
                          value={monthlyRent}
                          onChange={(e) => setMonthlyRent(Math.max(0, parseFloat(e.target.value) || 0))}
                          className="expense-input"
                        />
                      </div>
                    </div>

                    {/* Groceries & Dining */}
                    <div className="expense-field-box">
                      <div className="expense-label-row">
                        <span className="expense-label">{language === 'es' ? 'Comida y Supermercados' : 'Groceries & Dining'}</span>
                        <span className="expense-multiplier-hint">3x – 4x pts</span>
                      </div>
                      <div className="expense-input-row">
                        <span className="currency-symbol">$</span>
                        <input
                          type="number"
                          min="0"
                          step="25"
                          value={monthlyGroceries}
                          onChange={(e) => setMonthlyGroceries(Math.max(0, parseFloat(e.target.value) || 0))}
                          className="expense-input"
                        />
                      </div>
                    </div>

                    {/* Travel & Transit */}
                    <div className="expense-field-box">
                      <div className="expense-label-row">
                        <span className="expense-label">{language === 'es' ? 'Viajes y Transporte' : 'Travel & Transit'}</span>
                        <span className="expense-multiplier-hint">2x – 3x pts</span>
                      </div>
                      <div className="expense-input-row">
                        <span className="currency-symbol">$</span>
                        <input
                          type="number"
                          min="0"
                          step="25"
                          value={monthlyTravel}
                          onChange={(e) => setMonthlyTravel(Math.max(0, parseFloat(e.target.value) || 0))}
                          className="expense-input"
                        />
                      </div>
                    </div>

                    {/* Utilities */}
                    <div className="expense-field-box">
                      <div className="expense-label-row">
                        <span className="expense-label">{language === 'es' ? 'Servicios e Internet' : 'Utilities & Phone'}</span>
                        <span className="expense-multiplier-hint">1x – 2x pts</span>
                      </div>
                      <div className="expense-input-row">
                        <span className="currency-symbol">$</span>
                        <input
                          type="number"
                          min="0"
                          step="10"
                          value={monthlyUtilities}
                          onChange={(e) => setMonthlyUtilities(Math.max(0, parseFloat(e.target.value) || 0))}
                          className="expense-input"
                        />
                      </div>
                    </div>

                    {/* Other Retail */}
                    <div className="expense-field-box" style={{ gridColumn: 'span 2' }}>
                      <div className="expense-label-row">
                        <span className="expense-label">{language === 'es' ? 'Otras compras y retail' : 'Other General Spending'}</span>
                        <span className="expense-multiplier-hint">1x – 2x base</span>
                      </div>
                      <div className="expense-input-row">
                        <span className="currency-symbol">$</span>
                        <input
                          type="number"
                          min="0"
                          step="25"
                          value={monthlyOther}
                          onChange={(e) => setMonthlyOther(Math.max(0, parseFloat(e.target.value) || 0))}
                          className="expense-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" variant="primary" size="md" style={{ width: '100%' }} disabled={loading}>
                  {loading ? (language === 'es' ? 'Calculando en FastAPI...' : 'Calculating in Python...') : (language === 'es' ? 'Recalcular Plan de Recompensas' : 'Update Rewards Plan')}
                </Button>
              </form>
            </div>

            {/* Right Column: Deterministic Plan Results */}
            <aside className="planner-results-card">
              <h3 className="form-block-title" style={{ marginBottom: '8px' }}>
                📊 {language === 'es' ? 'Proyección Calculada (Python Engine)' : 'Projected Points (Python Engine)'}
              </h3>

              {calcError && (
                <div className="warning-callout-box" role="alert">
                  ⚠️ {calcError}
                </div>
              )}

              {planResult && (
                <>
                  <div className="projection-hero-box">
                    <span className="projection-pts-huge font-mono">
                      {planResult.projected_total_points.toLocaleString()}
                    </span>
                    <span className="projection-sub">
                      {language === 'es'
                        ? `Puntos totales proyectados a ${planResult.planning_horizon_months} meses`
                        : `Total projected points at ${planResult.planning_horizon_months} months`}
                    </span>

                    <div className="points-composition-bars">
                      <div className="comp-bar-item">
                        <span>{language === 'es' ? 'Saldo actual:' : 'Current points:'}</span>
                        <span className="val">{planResult.current_points.toLocaleString()}</span>
                      </div>
                      <div className="comp-bar-item text-right">
                        <span>{language === 'es' ? 'Puntos a ganar:' : 'Future earned:'}</span>
                        <span className="val" style={{ color: 'var(--color-terracotta, #1648a3)' }}>
                          +{planResult.estimated_points_earned.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Warnings if any */}
                  {planResult.warnings?.length > 0 && (
                    <div className="warning-callout-box">
                      <strong>⚠️ {language === 'es' ? 'Avisos importantes:' : 'Important Notices:'}</strong>
                      <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px' }}>
                        {planResult.warnings.map((w, idx) => (
                          <li key={idx}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Monthly Breakdown */}
                  <div className="breakdown-card-section">
                    <h5 style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--color-espresso-950)' }}>
                      {language === 'es' ? 'Desglose Mensual de Gastos:' : 'Monthly Spend Breakdown:'}
                    </h5>
                    <div className="breakdown-row">
                      <span>{language === 'es' ? 'Gasto mensual total:' : 'Total monthly spend:'}</span>
                      <strong>${planResult.monthly_breakdown.total_monthly_spend.toLocaleString()}</strong>
                    </div>
                    <div className="breakdown-row">
                      <span>{language === 'es' ? 'Gasto que genera puntos:' : 'Points-eligible spend:'}</span>
                      <strong style={{ color: 'var(--color-sage, #2E6F40)' }}>
                        ${planResult.monthly_breakdown.eligible_monthly_spend.toLocaleString()}
                      </strong>
                    </div>
                    {planResult.monthly_breakdown.ineligible_monthly_spend > 0 && (
                      <div className="breakdown-row">
                        <span>{language === 'es' ? 'Gasto no elegible (Alquiler):' : 'Ineligible spend (Rent):'}</span>
                        <span style={{ color: 'var(--color-terracotta, #1648a3)' }}>
                          ${planResult.monthly_breakdown.ineligible_monthly_spend.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Recommendation Card */}
                  <div className="breakdown-card-section">
                    <h5 style={{ margin: '0 0 6px 0', fontSize: '13px', color: 'var(--color-espresso-950)' }}>
                      🎯 {language === 'es' ? 'Estrategia Recomendada:' : 'Recommended Strategy:'}
                    </h5>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-espresso-700)', lineHeight: 1.5 }}>
                      {planResult.recommendation_reason}
                    </p>
                    <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--color-espresso-500)' }}>
                      {language === 'es' ? 'Cuota anual verificada:' : 'Verified annual fee:'}{' '}
                      <strong>${planResult.verified_card_annual_fee || 0} USD</strong>
                    </div>
                  </div>

                  {/* Transparent Assumptions */}
                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-espresso-500)', textTransform: 'uppercase' }}>
                      {language === 'es' ? 'Supuestos transparentes:' : 'Transparent Assumptions:'}
                    </span>
                    <ul className="assumptions-list">
                      {planResult.assumptions?.map((a, idx) => (
                        <li key={idx}>{a}</li>
                      ))}
                    </ul>
                  </div>

                  <Link to={`/results?origin=JFK&destination=MAD&cabin=${goal === 'business_class' ? 'business' : 'economy'}`}>
                    <Button variant="primary" size="md" style={{ width: '100%' }}>
                      ✈️ {language === 'es' ? `Ver vuelos a ${destination.split(' ')[0]}` : `Search Flights to ${destination.split(' ')[0]}`}
                    </Button>
                  </Link>
                </>
              )}
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RewardsPlannerPage;
