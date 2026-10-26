import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, postJson } from "../api";
import SavingsHero from "../components/SavingsHero";
import { formatMoney } from "../format";
import type { Catalog, CopilotAnswer, Demo, HackRequest, HackResult, ParsedBooking } from "../types";

const EMPTY: HackRequest = {
  origin: "MAD",
  destination: "JFK",
  date: null,
  cabin: "economy",
  passengers: 1,
  cards: [{ id: "amex-gold", points: 42000 }],
  flexible: true,
  nearby: true,
  via: null,
  return_date: null,
};

const SAMPLE_PNG = Uint8Array.from([
  137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 2, 0, 0, 0, 144, 119, 83,
  222, 0, 0, 0, 12, 73, 68, 65, 84, 8, 215, 99, 248, 207, 192, 0, 0, 0, 3, 0, 1, 0, 5, 254, 2, 254, 0, 0, 0, 0, 73, 69,
  78, 68, 174, 66, 96, 130,
]);

export default function HackPage() {
  const [params] = useSearchParams();
  const demoId = params.get("demo");
  const fullTrip = params.get("trip") === "full";
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [demos, setDemos] = useState<Demo[]>([]);
  const [form, setForm] = useState<HackRequest>(EMPTY);
  const [showForm, setShowForm] = useState(!demoId);
  const [result, setResult] = useState<HackResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [parseNote, setParseNote] = useState("");
  const [copilot, setCopilot] = useState<CopilotAnswer | null>(null);

  useEffect(() => {
    document.title = "Hack a flight · BookMyflight";
    let cancel = false;
    (async () => {
      try {
        const [cat, demoBody] = await Promise.all([
          api<Catalog>("/api/catalog"),
          api<{ demos: Demo[] }>("/api/demos"),
        ]);
        if (cancel) return;
        setCatalog(cat);
        setDemos(demoBody.demos);
        const selected = demoBody.demos.find((demo) => demo.id === demoId && demo.hack);
        const fallback = demoBody.demos.find((demo) => demo.id === "euro-850");
        const next = selected?.hack || fallback?.hack || EMPTY;
        setForm(next);
        if (selected?.hack) {
          setShowForm(false);
          setLoading(true);
          const priced = await postJson<HackResult>("/api/hack", selected.hack);
          if (!cancel) {
            setResult(priced);
            window.scrollTo(0, 0);
          }
        }
      } catch (err) {
        if (!cancel) setError(err instanceof Error ? err.message : "Could not load the search.");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [demoId]);

  async function onSubmit(event?: React.FormEvent) {
    event?.preventDefault();
    setLoading(true);
    setError("");
    try {
      const priced = await postJson<HackResult>("/api/hack", {
        ...form,
        via: form.via || null,
        return_date: form.return_date || null,
        date: form.date || null,
      });
      setResult(priced);
      setShowForm(false);
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No award chart for that route.");
    } finally {
      setLoading(false);
    }
  }

  function applyParsed(parsed: ParsedBooking) {
    setForm((current) => ({
      ...current,
      origin: parsed.origin || current.origin,
      destination: parsed.destination || current.destination,
      date: parsed.date || current.date,
      cabin: parsed.cabin || current.cabin,
    }));
    setParseNote(parsed.note);
    setShowForm(true);
  }

  async function onPasteText(text: string) {
    setError("");
    try {
      const parsed = await postJson<ParsedBooking>("/api/parse", { text });
      applyParsed(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read that link.");
    }
  }

  async function onScreenshot(file: File) {
    const body = new FormData();
    body.append("file", file);
    const response = await fetch("/api/parse-screenshot", { method: "POST", body });
    if (!response.ok) {
      setError("Could not read that screenshot.");
      return;
    }
    applyParsed((await response.json()) as ParsedBooking);
  }

  async function askDubai() {
    const demo = demos.find((item) => item.id === "dubai-combine");
    if (!demo?.copilot || !demo.hack) return;
    setForm(demo.hack);
    setError("");
    setLoading(true);
    try {
      const [answer, priced] = await Promise.all([
        postJson<CopilotAnswer>("/api/copilot", {
          message: demo.copilot.message,
          origin: demo.copilot.origin,
          destination: demo.copilot.destination,
          balances: demo.copilot.balances,
        }),
        postJson<HackResult>("/api/hack", demo.hack),
      ]);
      setCopilot(answer);
      setResult(priced);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Copilot failed.");
    } finally {
      setLoading(false);
    }
  }

  function toggleCard(id: string) {
    setForm((current) => {
      const exists = current.cards.some((card) => card.id === id);
      return {
        ...current,
        cards: exists ? current.cards.filter((card) => card.id !== id) : [...current.cards, { id, points: 0 }],
      };
    });
  }

  const airports = catalog?.airports || [];

  return (
    <main className="page">
      {error && <p className="banner">{error}</p>}
      {loading && !result && (
        <p className="lede skeleton-line" role="status">
          Checking the award chart…
        </p>
      )}

      {showForm && (
        <form onSubmit={onSubmit}>
          <p className="kicker">{fullTrip ? "Full trip plan" : "Quick flight"}</p>
          <h1 className="route-title">How much could I save?</h1>
          <p className="lede">
            {fullTrip
              ? "Add stops, dates, and travellers. The chart still answers with a normal price, a hacked price, and the saving."
              : "One route, one date, the points you already have. The answer is the cash fare against the hack."}
          </p>
          <div className="form-grid" style={{ marginTop: 18 }}>
            <label>
              <span>From</span>
              <select value={form.origin} onChange={(event) => setForm({ ...form, origin: event.target.value })}>
                {airports.map((airport) => (
                  <option key={airport.code} value={airport.code}>
                    {airport.city} ({airport.code})
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>To</span>
              <select
                value={form.destination}
                onChange={(event) => setForm({ ...form, destination: event.target.value })}
              >
                {airports.map((airport) => (
                  <option key={airport.code} value={airport.code}>
                    {airport.city} ({airport.code})
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Departure</span>
              <input
                type="date"
                value={form.date || ""}
                onChange={(event) => setForm({ ...form, date: event.target.value || null })}
              />
            </label>
            <label>
              <span>Cabin</span>
              <select value={form.cabin} onChange={(event) => setForm({ ...form, cabin: event.target.value })}>
                <option value="economy">Economy</option>
                <option value="business">Business</option>
              </select>
            </label>
          </div>

          <div className="full" style={{ marginTop: 16 }}>
            <p className="field-label">Cards and points</p>
            <div className="cards">
              {(catalog?.cards || []).map((card) => {
                const selected = form.cards.find((item) => item.id === card.id);
                return (
                  <div className="card-row" key={card.id}>
                    <label>
                      <input type="checkbox" checked={Boolean(selected)} onChange={() => toggleCard(card.id)} />
                      <span>
                        <strong>{card.name}</strong>
                        <span className="hint"> · {card.currency_label}. {card.blurb}</span>
                      </span>
                    </label>
                    {selected && (
                      <input
                        aria-label={`${card.name} points`}
                        type="number"
                        min={0}
                        value={selected.points}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            cards: current.cards.map((item) =>
                              item.id === card.id ? { ...item, points: Number(event.target.value) } : item,
                            ),
                          }))
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <details open={fullTrip || undefined}>
            <summary>Full trip plan · flexible dates, nearby airports, stopover, group</summary>
            <div className="form-grid" style={{ marginTop: 12 }}>
              <label className="checkline">
                <input
                  type="checkbox"
                  checked={form.flexible}
                  onChange={(event) => setForm({ ...form, flexible: event.target.checked })}
                />
                Flexible dates, plus or minus 3 days
              </label>
              <label className="checkline">
                <input
                  type="checkbox"
                  checked={form.nearby}
                  onChange={(event) => setForm({ ...form, nearby: event.target.checked })}
                />
                Check nearby airports
              </label>
              <label>
                <span>Travelers</span>
                <input
                  type="number"
                  min={1}
                  max={9}
                  value={form.passengers}
                  onChange={(event) => setForm({ ...form, passengers: Number(event.target.value) })}
                />
              </label>
              <label>
                <span>Stopover</span>
                <select
                  value={form.via || ""}
                  onChange={(event) => setForm({ ...form, via: event.target.value || null })}
                >
                  <option value="">Nonstop</option>
                  <option value="LIS">Lisbon (TAP stopover)</option>
                  <option value="DOH">Doha (Qatar stopover)</option>
                </select>
              </label>
              <label>
                <span>Return date, optional</span>
                <input
                  type="date"
                  value={form.return_date || ""}
                  onChange={(event) => setForm({ ...form, return_date: event.target.value || null })}
                />
              </label>
            </div>
          </details>

          <details>
            <summary>Paste a flight link or a screenshot</summary>
            <div style={{ marginTop: 12 }}>
              <label>
                <span>Google Flights, Skyscanner, MakeMyTrip, or a line of text</span>
                <input
                  type="text"
                  placeholder="https://www.skyscanner.net/transport/flights/mad/jfk/261120/"
                  onBlur={(event) => {
                    if (event.target.value.trim()) void onPasteText(event.target.value.trim());
                  }}
                />
              </label>
              <div className="row-actions" style={{ marginTop: 10 }}>
                <label className="btn-line">
                  Drop a screenshot
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void onScreenshot(file);
                    }}
                  />
                </label>
                <button
                  type="button"
                  className="btn-line"
                  onClick={() => {
                    const file = new File([SAMPLE_PNG], "ticket.png", { type: "image/png" });
                    void onScreenshot(file);
                  }}
                >
                  Simulate a screenshot
                </button>
              </div>
              {parseNote && <p className="hint">{parseNote}</p>}
            </div>
          </details>

          <div className="row-actions" style={{ marginTop: 16 }}>
            <button className="btn" type="submit" data-testid="show-hack" disabled={loading}>
              {loading ? "Pricing…" : "Show what I save"}
            </button>
            <button
              type="button"
              className="btn-line"
              onClick={() => {
                const euro = demos.find((demo) => demo.id === "euro-850");
                if (euro?.hack) setForm(euro.hack);
              }}
            >
              Fill €850 demo
            </button>
            <button
              type="button"
              className="btn-line"
              onClick={() => {
                const india = demos.find((demo) => demo.id === "inr-3500");
                if (india?.hack) setForm(india.hack);
              }}
            >
              Fill ₹55,000 demo
            </button>
            <button type="button" className="btn-line" data-testid="copilot-dubai" onClick={() => void askDubai()}>
              Combine points to Dubai
            </button>
          </div>
        </form>
      )}

      {result && !showForm && (
        <div className="row-actions" style={{ marginBottom: 10 }}>
          <button className="btn-line" type="button" onClick={() => setShowForm(true)}>
            Edit search
          </button>
          <span className="hint">
            {result.query.origin} → {result.query.destination} · cash {formatMoney(result.cash.amount, result.cash.currency)}
          </span>
        </div>
      )}

      {result && <SavingsHero result={result} request={form} />}

      {copilot && (
        <section className="copilot" data-testid="copilot-answer">
          <p className="kicker sage">Copilot</p>
          <h2>Can those points share one ticket?</h2>
          <p>{copilot.answer}</p>
        </section>
      )}
    </main>
  );
}
