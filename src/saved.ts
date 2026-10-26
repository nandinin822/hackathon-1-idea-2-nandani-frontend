export type SavedTrip = {
  id: string;
  title: string;
  saved: number;
  currency: string;
  percent: number;
  summary: string;
  at: string;
};

const KEY = "bookmyflight.saved";

export function readSaved(): SavedTrip[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedTrip[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function rememberTrip(trip: SavedTrip): SavedTrip[] {
  const next = [trip, ...readSaved().filter((item) => item.id !== trip.id)].slice(0, 12);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function totalsByCurrency(trips: SavedTrip[]): { currency: string; saved: number }[] {
  const totals = new Map<string, number>();
  for (const trip of trips) {
    totals.set(trip.currency, (totals.get(trip.currency) || 0) + trip.saved);
  }
  return [...totals.entries()].map(([currency, saved]) => ({ currency, saved }));
}
