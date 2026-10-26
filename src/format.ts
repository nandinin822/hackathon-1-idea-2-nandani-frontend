export function formatMoney(amount: number, currency: string): string {
  const rounded = Math.round(amount);
  if (currency === "EUR") return `€${rounded.toLocaleString("en-US")}`;
  if (currency === "INR") return `₹${rounded.toLocaleString("en-IN")}`;
  return `${rounded.toLocaleString("en-US")} ${currency}`;
}

export function formatPoints(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

export function formatDate(iso: string | null): string {
  if (!iso) return "";
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
  const date = new Date(year, (month || 1) - 1, day || 1);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function cppText(cpp: number, baseline: number, unit: string): string {
  const main = unit === "¢" ? `${cpp.toFixed(1)}¢` : `${unit}${cpp.toFixed(2)}`;
  const base = unit === "¢" ? `${baseline.toFixed(1)}¢` : `${unit}${baseline.toFixed(2)}`;
  return `${main} per point versus ${base} cashback`;
}
