import { useEffect, useState } from "react";
import { api } from "../api";
import type { TransferRow } from "../types";

export default function TransfersPage() {
  const [rows, setRows] = useState<TransferRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Transfer map · BookMyflight";
    api<{ transfers: TransferRow[] }>("/api/transfers")
      .then((body) => setRows(body.transfers))
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not load transfers."));
  }, []);

  const sample = rows.filter((row) => row.sample);
  const extra = rows.filter((row) => !row.sample);

  return (
    <main className="page">
      <p className="kicker">Where points can move</p>
      <h1 className="route-title">Transfer map</h1>
      <p className="lede">
        Bank points become airline miles at a fixed ratio. The first table is the sample from the product spec. The second table is what the planner needs so a recommended card can actually book the trip.
      </p>
      {error && <p className="banner">{error}</p>}
      <div className="scroll">
        <table className="matrix">
          <thead>
            <tr>
              <th>Card currency</th>
              <th>Airline program</th>
              <th>Alliance</th>
              <th>Ratio</th>
              <th>Typical sweet spot</th>
            </tr>
          </thead>
          <tbody>
            {sample.map((row) => (
              <tr key={`${row.currency}-${row.program_id}`}>
                <td>
                  {row.currency_label}
                  <div className="hint">{row.issuer}</div>
                </td>
                <td>{row.program}</td>
                <td>{row.alliance}</td>
                <td>{row.ratio}</td>
                <td>{row.sweet_spot}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {extra.length > 0 && (
        <>
          <h2 className="section-title">Also on the chart</h2>
          <div className="scroll">
            <table className="matrix">
              <thead>
                <tr>
                  <th>Card currency</th>
                  <th>Airline program</th>
                  <th>Alliance</th>
                  <th>Ratio</th>
                </tr>
              </thead>
              <tbody>
                {extra.map((row) => (
                  <tr key={`${row.currency}-${row.program_id}`}>
                    <td>{row.currency_label}</td>
                    <td>{row.program}</td>
                    <td>{row.alliance}</td>
                    <td>{row.ratio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <p className="note">
        Virgin Atlantic is listed in the spec sample under SkyTeam. It is not a SkyTeam member, so this demo labels it as a non-alliance partner. Sweet spots are typical saver levels. A live promo, such as the Madrid–New York fare, can differ.
      </p>
    </main>
  );
}
