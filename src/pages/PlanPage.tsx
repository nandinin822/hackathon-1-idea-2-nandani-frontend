import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, postJson } from "../api";
import { formatMoney, formatPoints } from "../format";
import type { Catalog, Demo, StrategyPlan, StrategyRequest } from "../types";

const FALLBACK: StrategyRequest = {
  origin: "MAD",
  destination: "DPS",
  months: 8,
  use_portals: true,
  cards: [{ id: "amex-gold", points: 12000 }],
  monthly_expenses: { groceries: 500, dining: 250, shopping: 250, bills: 250, rent: 1200 },
};

const SLIDER_MAX: Record<string, number> = {
  groceries: 1500,
  dining: 1200,
  shopping: 1500,
  bills: 800,
  rent: 4000,
};

export default function PlanPage() {
  const [params, setParams] = useSearchParams();
  const view = params.get("view") === "roadmap" ? "roadmap" : "form";
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [request, setRequest] = useState<StrategyRequest>(FALLBACK);
  const [booted, setBooted] = useState(false);
  const [plan, setPlan] = useState<StrategyPlan | null>(null);
  const [error, setError] = useState("");
  const [elapsed, setElapsed] = useState(Number(params.get("elapsed") || 2));

  useEffect(() => {
    document.title = view === "roadmap" ? "Milestone tracker · BookMyflight" : "8-month planner · BookMyflight";
  }, [view]);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const [cat, demoBody] = await Promise.all([
          api<Catalog>("/api/catalog"),
          api<{ demos: Demo[] }>("/api/demos"),
        ]);
        if (cancel) return;
        setCatalog(cat);
        const bali = demoBody.demos.find((demo) => demo.id === "bali");
        if (bali?.strategy) setRequest(bali.strategy);
        setBooted(true);
      } catch (err) {
        if (!cancel) setError(err instanceof Error ? err.message : "Could not load the planner.");
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  useEffect(() => {
    if (!booted) return;
    const handle = window.setTimeout(() => {
      postJson<StrategyPlan>("/api/strategy", request)
        .then((next) => {
          setPlan(next);
          setError("");
        })
        .catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not build the plan."));
    }, 160);
    return () => window.clearTimeout(handle);
  }, [booted, request]);

  const currency = plan?.currency || "EUR";
  const snapshot = plan?.timeline.find((month) => month.month === elapsed) || plan?.timeline[0];
  const progress = plan && snapshot ? Math.min(100, (snapshot.cumulative / plan.award.miles) * 100) : 0;

  function setExpense(category: string, value: number) {
    setRequest((current) => ({
      ...current,
      monthly_expenses: { ...current.monthly_expenses, [category]: value },
    }));
  }

  function toggleCard(id: string) {
    setRequest((current) => {
      const exists = current.cards.some((card) => card.id === id);
      return {
        ...current,
        cards: exists ? current.cards.filter((card) => card.id !== id) : [...current.cards, { id, points: 0 }],
      };
    });
  }

  return (
    <main className="page">
      {error && <p className="banner">{error}</p>}
      {view === "form" && (
        <div className="plan-grid">
          <section>
            <p className="kicker sage">Pathway B · {request.months} months</p>
            <h1 className="route-title">Eight months to {plan?.destination.city || "Bali"}</h1>
            <p className="lede">
              Move the sliders. The roadmap puts each euro on the card that earns the most miles toward the award.
            </p>
            <div className="form-grid" style={{ marginTop: 16 }}>
              <label>
                <span>From</span>
                <select
                  value={request.origin}
                  onChange={(event) => setRequest({ ...request, origin: event.target.value })}
                >
                  {(catalog?.airports || []).map((airport) => (
                    <option key={airport.code} value={airport.code}>
                      {airport.city} ({airport.code})
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Dream destination</span>
                <select
                  value={request.destination}
                  onChange={(event) => setRequest({ ...request, destination: event.target.value })}
                >
                  {(catalog?.airports || []).map((airport) => (
                    <option key={airport.code} value={airport.code}>
                      {airport.city} ({airport.code})
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="stepper" style={{ marginTop: 12 }}>
              <button
                type="button"
                aria-label="Fewer months"
                onClick={() => setRequest({ ...request, months: Math.max(4, request.months - 1) })}
              >
                −
              </button>
              <strong>Fly in {request.months} months</strong>
              <button
                type="button"
                aria-label="More months"
                onClick={() => setRequest({ ...request, months: Math.min(18, request.months + 1) })}
              >
                +
              </button>
            </div>

            <fieldset data-testid="spend-sliders" style={{ border: 0, padding: 0, margin: "16px 0 0" }}>
              <legend className="field-label">Monthly household spend</legend>
              {(catalog?.categories || []).map((category) => {
                const value = request.monthly_expenses[category.id] ?? 0;
                return (
                  <div className="slider-row" key={category.id}>
                    <div className="slider-top">
                      <strong>{category.label}</strong>
                      <label className="amount">
                        <span>{currency === "INR" ? "₹" : "€"}</span>
                        <input
                          aria-label={`${category.label} amount`}
                          type="number"
                          min={0}
                          value={value}
                          onChange={(event) => setExpense(category.id, Number(event.target.value))}
                        />
                      </label>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={SLIDER_MAX[category.id] || 2000}
                      step={10}
                      value={Math.min(value, SLIDER_MAX[category.id] || 2000)}
                      aria-label={category.label}
                      onChange={(event) => setExpense(category.id, Number(event.target.value))}
                    />
                  </div>
                );
              })}
            </fieldset>

            <label className="checkline">
              <input
                type="checkbox"
                checked={request.use_portals}
                onChange={(event) => setRequest({ ...request, use_portals: event.target.checked })}
              />
              Count dining and shopping portals
            </label>

            <div className="row-actions" style={{ margin: "12px 0 8px" }}>
              <button
                className="btn"
                type="button"
                data-testid="build-roadmap"
                onClick={() => {
                  const next = new URLSearchParams(params);
                  next.set("view", "roadmap");
                  if (!next.get("demo")) next.set("demo", "bali");
                  setParams(next);
                  window.scrollTo(0, 0);
                }}
              >
                Build my roadmap
              </button>
            </div>

            <div className="chips" style={{ marginTop: 8 }}>
              {(catalog?.cards || []).map((card) => {
                const selected = request.cards.find((item) => item.id === card.id);
                return (
                  <button
                    type="button"
                    key={card.id}
                    className="chip"
                    onClick={() => toggleCard(card.id)}
                    aria-pressed={Boolean(selected)}
                    style={selected ? { borderColor: "var(--ink)" } : undefined}
                  >
                    {card.name}
                    {selected ? ` · ${formatPoints(selected.points)}` : ""}
                  </button>
                );
              })}
            </div>
            {request.cards.map((card) => (
              <label key={card.id} style={{ display: "block", marginTop: 8 }}>
                <span>{catalog?.cards.find((item) => item.id === card.id)?.name} balance</span>
                <input
                  type="number"
                  min={0}
                  value={card.points}
                  onChange={(event) =>
                    setRequest((current) => ({
                      ...current,
                      cards: current.cards.map((item) =>
                        item.id === card.id ? { ...item, points: Number(event.target.value) } : item,
                      ),
                    }))
                  }
                />
              </label>
            ))}

          </section>

          <aside className="panel">
            <p className="kicker">Live plan</p>
            {plan ? (
              <>
                <h2 style={{ marginTop: 8 }}>
                  {formatPoints(plan.monthly_points)} pts
                  <span style={{ fontSize: 18 }}> / month</span>
                </h2>
                <p className="hint">
                  Target {formatPoints(plan.award.miles)} {plan.award.program} miles + {formatMoney(plan.award.taxes, plan.currency)} tax.
                  Cash fare about {formatMoney(plan.award.cash, plan.currency)}. Fly {plan.departure_label}.
                </p>
                <ul className="mini-list">
                  {plan.assignments.map((row) => (
                    <li key={row.category}>
                      <strong>{row.label}</strong> · {row.card_name} · {row.multiplier}× · {formatPoints(row.monthly_points)} pts
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="hint">Pricing the award…</p>
            )}
          </aside>
        </div>
      )}

      {view === "roadmap" && plan && snapshot && (
        <section data-testid="milestone-tracker">
          <p className="kicker sage">Milestone tracker</p>
          <h1 className="route-title">
            {plan.origin.city} → {plan.destination.city}
          </h1>
          <p className="route-meta">
            Ticket unlocks at {formatPoints(plan.award.miles)} {plan.award.program} miles · depart {plan.departure_label}
          </p>
          <p className="tracker-num">{formatPoints(snapshot.cumulative)}</p>
          <p className="hint">of {formatPoints(plan.award.miles)} miles · {snapshot.label}</p>
          <div className="bar" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
          <label>
            <span>Months already elapsed: {elapsed}</span>
            <input
              type="range"
              min={0}
              max={plan.months}
              value={elapsed}
              aria-label="Months elapsed"
              onChange={(event) => setElapsed(Number(event.target.value))}
            />
          </label>
          <div className="month-rail" style={{ marginTop: 14 }}>
            {plan.timeline
              .filter((month) => month.month > 0)
              .map((month) => (
                <div key={month.month} className={month.month === elapsed ? "month-chip on" : "month-chip"}>
                  <strong>{month.label.split(" ")[0].slice(0, 3)}</strong>
                  {month.bonus > 0 && <span className="tag hot">Bonus</span>}
                  {month.book_month && <span className="tag hot">Book</span>}
                  {month.milestone > 0 && <span className="tag">Milestone</span>}
                  {month.month === plan.months && <span className="tag">Fly</span>}
                </div>
              ))}
          </div>
          <p style={{ marginTop: 12 }}>{snapshot.events.join(" ")}</p>
          {plan.recommendation && (
            <div className="rec">
              <p className="kicker">New card</p>
              <h2 style={{ fontSize: 26 }}>{plan.recommendation.card_name}</h2>
              <p>
                {formatPoints(plan.recommendation.welcome_points)} points after {formatMoney(plan.recommendation.spend, plan.recommendation.spend_currency)} in {plan.recommendation.days} days.
                {plan.halves_wait
                  ? ` That cuts the wait from ${plan.months_without_bonus} months to ${plan.months_with_bonus} — half the time.`
                  : ` Ready in month ${plan.months_with_bonus}, versus month ${plan.months_without_bonus} on your current cards.`}
              </p>
            </div>
          )}
          <p className="why">{plan.narrative}</p>
          <h2 className="section-title">Which card, where</h2>
          <ul className="mini-list">
            {plan.assignments.map((row) => (
              <li key={row.category}>
                {row.label}: {formatMoney(row.monthly_spend, plan.currency)} on {row.card_name} at {row.multiplier}× → {formatPoints(row.monthly_points)} pts
              </li>
            ))}
          </ul>
          {plan.rent_tip && <p className="note">{plan.rent_tip.note}</p>}
          {plan.alternates[0] && (
            <p className="hint">
              Also considered {plan.alternates[0].card_name}, ready in month {plan.alternates[0].months}.
            </p>
          )}
          <div className="timeline">
            {plan.timeline
              .filter((month) => month.month > 0)
              .map((month) => (
                <article key={month.month}>
                  <strong>{month.label}</strong>
                  <span>{month.events.join(" · ")}</span>
                  <span>{formatPoints(month.cumulative)}</span>
                </article>
              ))}
          </div>
          <div className="row-actions" style={{ marginTop: 16 }}>
            <Link
              className="btn"
              data-testid="tracker-booking"
              to="/book"
              state={{
                request: {
                  origin: plan.origin.code,
                  destination: plan.destination.code,
                  date: plan.departure,
                  cabin: "economy",
                  passengers: 1,
                  cards: request.cards,
                  flexible: false,
                  nearby: true,
                  via: null,
                  return_date: null,
                },
              }}
            >
              See the booking steps
            </Link>
            <button
              className="btn-line"
              type="button"
              onClick={() => {
                const next = new URLSearchParams(params);
                next.delete("view");
                setParams(next);
              }}
            >
              Edit spend
            </button>
          </div>
        </section>
      )}
      {view === "roadmap" && !plan && <p className="lede">Building the roadmap…</p>}
    </main>
  );
}
