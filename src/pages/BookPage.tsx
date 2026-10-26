import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { api, postJson } from "../api";
import BookingChecklist from "../components/BookingChecklist";
import type { Demo, HackRequest, HackResult } from "../types";

type LocationState = { result?: HackResult; request?: HackRequest };

export default function BookPage() {
  const [params] = useSearchParams();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;
  const [result, setResult] = useState<HackResult | null>(state.result || null);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Book the seat · BookMyflight";
    if (state.result) return;
    let cancel = false;
    (async () => {
      try {
        if (state.request) {
          const priced = await postJson<HackResult>("/api/hack", state.request);
          if (!cancel) setResult(priced);
          return;
        }
        const demoId = params.get("demo") || "euro-850";
        const demo = await api<Demo>(`/api/demos/${demoId}`);
        if (!demo.hack) throw new Error("This demo has no booking.");
        const priced = await postJson<HackResult>("/api/hack", demo.hack);
        if (!cancel) setResult(priced);
      } catch (err) {
        if (!cancel) setError(err instanceof Error ? err.message : "Could not open the checklist.");
      }
    })();
    return () => {
      cancel = true;
    };
  }, [params, state.request, state.result]);

  return (
    <main className="page">
      {error && <p className="banner">{error}</p>}
      {!result && !error && <p className="lede">Opening the three booking steps…</p>}
      {result && <BookingChecklist result={result} />}
    </main>
  );
}
