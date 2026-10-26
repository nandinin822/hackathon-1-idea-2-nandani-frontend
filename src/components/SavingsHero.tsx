import { useState } from "react";
import { Link } from "react-router-dom";
import { cppText, formatDate, formatMoney, formatPoints } from "../format";
import { readSaved, rememberTrip } from "../saved";
import type { HackRequest, HackResult } from "../types";

export default function SavingsHero({ result, request }: { result: HackResult; request: HackRequest }) {
  const best = result.best;
  const query = result.query;
  const tripId = `${query.origin}-${query.destination}-${query.date}-${best.miles}`;
  const [saved, setSaved] = useState(() => readSaved().some((trip) => trip.id === tripId));

  function saveTrip() {
    rememberTrip({
      id: tripId,
      title: `${query.origin_city} → ${query.destination_city}`,
      saved: best.saved,
      currency: best.currency,
      percent: best.savings_percent,
      summary: `${formatMoney(best.taxes, best.currency)} + ${formatPoints(best.miles)} pts · ${best.savings_percent}% off`,
      at: new Date().toISOString(),
    });
    setSaved(true);
  }
  return (
    <div>
      <p className="kicker">{best.promo || best.program}</p>
      <h1 className="route-title">
        {query.origin_city} → {query.destination_city}
      </h1>
      <p className="route-meta">
        {formatDate(query.date)}
        {query.round_trip && query.return_date ? ` – ${formatDate(query.return_date)}` : ""} · {query.cabin} ·{" "}
        {query.passengers} traveler{query.passengers === 1 ? "" : "s"}
        {query.round_trip ? " · round trip" : ""}
      </p>

      <section className="hero-panel" data-testid="savings-hero">
        <div className="fare-col">
          <p className="kicker">Cash fare</p>
          <p className="cash-price">{formatMoney(best.cash, best.currency)}</p>
          <p className="hint">What the airline charges for this seat.</p>
        </div>
        <div className="fare-col">
          <p className="kicker">Hacked fare</p>
          <p className="hack-price">{formatMoney(best.taxes, best.currency)}</p>
          <p className="hack-points">+ {formatPoints(best.miles)} points</p>
          <p className="hint">
            {best.program}
            {best.transfers[0] ? ` · transfer at ${best.transfers[0].ratio}` : ""}
          </p>
        </div>
        <div className="hero-foot">
          <p className="save-badge">
            You save {formatMoney(best.saved, best.currency)} · {best.savings_percent}% off
          </p>
          <p className="cpp">{cppText(best.cpp, best.cpp_baseline, best.cpp_unit)}</p>
        </div>
      </section>

      <blockquote className="why">
        <p>{best.why}</p>
      </blockquote>

      {(result.cabin_note || result.pricing_note || !best.can_book) && (
        <p className="banner">
          {result.cabin_note} {result.pricing_note}{" "}
          {!best.can_book &&
            `You are ${formatPoints(best.miles_short)} miles short of booking this seat. The planner can close the gap.`}
        </p>
      )}

      <div className="row-actions">
        <Link
          className="btn"
          data-testid="open-booking"
          to={`/book?demo=${request.origin === "DEL" ? "inr-3500" : "euro-850"}`}
          state={{ result, request }}
        >
          Book in 3 steps
        </Link>
        <button className="btn-line" type="button" onClick={saveTrip} disabled={saved}>
          {saved ? "Saved on this device" : "Save this trip"}
        </button>
        {!best.can_book && (
          <Link className="btn-line" to="/plan">
            Build a points plan
          </Link>
        )}
      </div>

      <div className="split" style={{ marginTop: 22 }}>
        <div>
          <h2 className="section-title" style={{ marginTop: 0 }}>
            Why this route
          </h2>
          {best.transfers.length > 0 ? (
            <ul className="mini-list">
              {best.transfers.map((leg) => (
                <li key={leg.card_id}>
                  Move {formatPoints(leg.bank_points)} {leg.currency_label} from {leg.card_name} at {leg.ratio}.
                </li>
              ))}
            </ul>
          ) : (
            <p className="hint">Add a card that transfers into {best.program}.</p>
          )}
          {best.stopover && <p className="note">{best.stopover.note}</p>}
          {result.stopover_note && <p className="note">{result.stopover_note}</p>}
        </div>
        <div>
          {result.alternatives.length > 0 && (
            <>
              <h3>Other awards</h3>
              <ul className="mini-list">
                {result.alternatives.map((option) => (
                  <li key={option.id}>
                    {option.program}: {formatPoints(option.miles)} pts + {formatMoney(option.taxes, option.currency)}
                    {option.can_book ? "" : " · not enough points yet"}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {result.nearby.length > 0 && (
        <section>
          <h2 className="section-title">Nearby airports</h2>
          <div className="nearby">
            {result.nearby.map((item) => (
              <article key={`${item.kind}-${item.code}`}>
                <strong>
                  {item.city} ({item.code})
                </strong>
                <p className="hint">
                  About {item.minutes} min by {item.mode}, instead of {item.instead_of}.
                </p>
                {item.option ? (
                  <p>
                    {formatPoints(item.option.miles)} points + {formatMoney(item.option.taxes, item.option.currency)} tax
                    <br />
                    Cash about {formatMoney(item.option.cash, item.option.currency)}
                  </p>
                ) : (
                  <p className="hint">{item.note}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {result.flexible_dates.length > 0 && (
        <section>
          <h2 className="section-title">Plus or minus three days</h2>
          <div className="chips">
            {result.flexible_dates.map((day) => (
              <span className="chip" key={day.date}>
                {formatDate(day.date)} · {formatMoney(day.cash, day.currency)} cash
              </span>
            ))}
          </div>
          <p className="hint">The hero stays on the date you asked for. Nearby dates are a comparison, not a replacement.</p>
        </section>
      )}
    </div>
  );
}
