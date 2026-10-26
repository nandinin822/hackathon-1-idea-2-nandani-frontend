import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatMoney } from "../format";
import { readSaved, totalsByCurrency, type SavedTrip } from "../saved";

export default function HomePage() {
  const [saved, setSaved] = useState<SavedTrip[]>([]);

  useEffect(() => {
    document.title = "BookMyflight";
    setSaved(readSaved());
  }, []);

  const totals = totalsByCurrency(saved);

  return (
    <main className="page" data-testid="dual-entry">
      <div className="home-head">
        <p className="eyebrow">Most people pay full price</p>
        <h1>
          How much could I <em>save</em> on this trip?
        </h1>
        <p className="lede">
          Miles, points, flexible dates, nearby airports, smarter routes. The savings are real. This app finds them in seconds, then shows you how to book.
        </p>
      </div>

      <section className="proof" aria-label="Example saving">
        <p className="kicker">One answer, already priced</p>
        <p className="proof-fare">
          <span>€850</span>
          <span className="proof-arrow" aria-hidden="true">→</span>
          <strong>€60 + 30k points</strong>
        </p>
        <p className="hint">Madrid to New York. You save €790, 92% off the cash fare.</p>
        <Link className="btn" to="/hack?demo=euro-850">
          See this saving
        </Link>
      </section>

      <section className="pathways">
        <article className="pathway">
          <p className="kicker">Option 1 · Fast and simple</p>
          <h2>Quick Flight Hacker</h2>
          <p className="hint">One route, one answer. For someone who knows where they want to go.</p>
          <ol>
            <li>Enter the route, the date, and the points you already have.</li>
            <li>See the normal price, the hacked price, and the saving.</li>
            <li>Book in three steps, or save the trip on this device.</li>
          </ol>
          <Link className="btn" to="/hack" data-testid="pathway-hack">
            Check a quick flight
          </Link>
          <Link className="text-link" to="/hack?trip=full">
            Full trip plan · stops, dates, and travellers
          </Link>
        </article>
        <article className="pathway">
          <p className="kicker sage">Option 2 · Complete and detailed</p>
          <h2>8-month planner</h2>
          <p className="hint">The trip is later. The biggest saving often starts with this month’s groceries.</p>
          <ol>
            <li>Set the destination and an eight-month target.</li>
            <li>Tell us groceries, dining, shopping, bills, and rent.</li>
            <li>Get a card-by-card spend roadmap and a card recommendation.</li>
            <li>Track the miles, then open the booking steps.</li>
          </ol>
          <Link className="btn" to="/plan" data-testid="pathway-plan">
            Plan the next 8 months
          </Link>
        </article>
      </section>

      <section className="feature-grid" aria-label="What the check includes">
        <article>
          <p className="kicker">Search</p>
          <h3>The trip you already have in mind</h3>
          <p className="hint">Quick flight or a fuller plan. Flexible dates, nearby airports, a stopover, travellers, a pasted link or screenshot, and the miles already in your wallet.</p>
        </article>
        <article>
          <p className="kicker">Savings</p>
          <h3>Normal price against the hack</h3>
          <p className="hint">Savings in money and percent. The points, the transfer partner, the smarter route, and a plain sentence on why it works.</p>
        </article>
        <article>
          <p className="kicker">Booking</p>
          <h3>Then you book</h3>
          <p className="hint">Three steps onto the airline seat. Saved trips stay on this device, with a total of what those checks were worth.</p>
        </article>
      </section>

      <section className="demo-row">
        <p>Try a priced example.</p>
        <div className="chips">
          <Link className="chip" to="/hack?demo=euro-850" data-testid="demo-euro-850">
            <strong>€850 → €60 + 30k points</strong>
          </Link>
          <Link className="chip" to="/hack?demo=inr-3500" data-testid="demo-inr-3500">
            <strong>₹55,000 → ₹3,500 taxes</strong>
          </Link>
          <Link className="chip" to="/plan?demo=bali" data-testid="demo-bali">
            <strong>Bali in 8 months</strong>
          </Link>
        </div>
      </section>

      <section className="saved-panel" aria-label="Saved trips">
        <p className="kicker">Saved on this device</p>
        <h2>Trips you wanted to keep</h2>
        {saved.length === 0 ? (
          <p className="hint">No saved trips yet. Check a fare, then save it. Live price alerts need a fare feed; this list keeps the price you just saw.</p>
        ) : (
          <>
            <p className="proof-fare proof-fare-small">
              {totals.map((total) => (
                <strong key={total.currency}>{formatMoney(total.saved, total.currency)} saved</strong>
              ))}
            </p>
            <ul className="mini-list">
              {saved.map((trip) => (
                <li key={trip.id}>
                  <strong>{trip.title}</strong>
                  <span className="hint"> · {trip.summary}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  );
}
