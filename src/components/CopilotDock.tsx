import { useState } from "react";
import { postJson } from "../api";
import type { CopilotAnswer } from "../types";

type Turn = { role: "user" | "advisor"; text: string };

export default function CopilotDock() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([
    {
      role: "advisor",
      text: "Ask in plain English. Try: I have 25k Amex and 15k Chase, can I combine them to fly to Dubai?",
    },
  ]);

  async function ask(event: React.FormEvent) {
    event.preventDefault();
    const message = draft.trim();
    if (!message || busy) return;
    setDraft("");
    setTurns((current) => [...current, { role: "user", text: message }]);
    setBusy(true);
    try {
      const answer = await postJson<CopilotAnswer>("/api/copilot", { message });
      setTurns((current) => [...current, { role: "advisor", text: answer.answer }]);
    } catch (err) {
      const text = err instanceof Error ? err.message : "The advisor could not answer that.";
      setTurns((current) => [...current, { role: "advisor", text }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button className="copilot-fab" type="button" onClick={() => setOpen((value) => !value)}>
        {open ? "Close advisor" : "Ask the advisor"}
      </button>
      {open && (
        <section className="copilot-drawer" aria-label="Travel advisor">
          <p className="kicker">Copilot</p>
          <h2>How should I use these points?</h2>
          <div className="copilot-log">
            {turns.map((turn, index) => (
              <p className={turn.role === "user" ? "mine" : undefined} key={`${turn.role}-${index}`}>
                {turn.text}
              </p>
            ))}
          </div>
          <form onSubmit={ask} className="row-actions">
            <input
              type="text"
              aria-label="Question for the advisor"
              placeholder="40k points, Bali in 8 months"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            <button className="btn" type="submit" disabled={busy}>
              {busy ? "Checking…" : "Ask"}
            </button>
          </form>
        </section>
      )}
    </>
  );
}
