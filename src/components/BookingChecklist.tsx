import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDate, formatMoney, formatPoints } from "../format";
import type { HackResult } from "../types";

export default function BookingChecklist({ result }: { result: HackResult }) {
  const steps = result.booking.steps;
  const best = result.best;
  const [checks, setChecks] = useState<boolean[]>(() => (steps[2]?.checks || []).map(() => false));
  const [passenger, setPassenger] = useState({ first: "", last: "", flyer: "" });
  const done = checks.length > 0 && checks.every(Boolean) && passenger.first.trim() && passenger.last.trim();

  return (
    <div data-testid="booking-checklist">
      <p className="kicker">Assisted booking</p>
      <h1 className="route-title">
        {best.origin_city} → {best.destination_city}
      </h1>
      <p className="route-meta">
        {formatDate(best.date)} · {formatPoints(best.miles)} points + {formatMoney(best.taxes, best.currency)} tax · cash{" "}
        {formatMoney(best.cash, best.currency)}
      </p>
      <div className="steps">
        {steps.map((step) => (
          <article className="step" key={step.n}>
            <div className="step-n">{step.n}</div>
            <div>
              <h2>{step.title}</h2>
              <p>{step.body}</p>
              {step.warning && <p className="warn">{step.warning}</p>}
              {step.note && <p className="hint">{step.note}</p>}
              {step.links && step.links.length > 0 && (
                <div className="row-actions" style={{ marginTop: 10 }}>
                  {step.links.map((link) => (
                    <a key={link.url + link.label} className="btn-line" href={link.url} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
              {step.checks && (
                <>
                  <ul className="checks">
                    {step.checks.map((label, index) => (
                      <li key={label}>
                        <label>
                          <input
                            type="checkbox"
                            checked={checks[index] || false}
                            onChange={() =>
                              setChecks((current) => current.map((value, i) => (i === index ? !value : value)))
                            }
                          />
                          <span>{label}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                  <div className="passenger">
                    <input
                      aria-label="First name"
                      placeholder="First name"
                      value={passenger.first}
                      onChange={(event) => setPassenger({ ...passenger, first: event.target.value })}
                    />
                    <input
                      aria-label="Last name"
                      placeholder="Last name"
                      value={passenger.last}
                      onChange={(event) => setPassenger({ ...passenger, last: event.target.value })}
                    />
                    <input
                      aria-label="Frequent flyer number"
                      placeholder="Frequent flyer no."
                      value={passenger.flyer}
                      onChange={(event) => setPassenger({ ...passenger, flyer: event.target.value })}
                    />
                  </div>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
      {done && (
        <div className="success" data-testid="booking-done">
          <strong>You're set.</strong>
          <p className="hint">
            {passenger.first} {passenger.last} is ready to ticket
            {passenger.flyer ? ` on frequent flyer ${passenger.flyer}` : ""}. Keep the airline confirmation. BookMyflight does not hold the seat.
          </p>
        </div>
      )}
      <p style={{ marginTop: 16 }}>
        <Link to="/hack">Back to the fare</Link>
      </p>
    </div>
  );
}
