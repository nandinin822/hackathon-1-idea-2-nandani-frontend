export type CardBalance = { id: string; points: number };

export type Airport = { code: string; city: string; country: string };

export type CardInfo = {
  id: string;
  name: string;
  issuer: string;
  currency: string;
  currency_label: string;
  region: string;
  multipliers: Record<string, number>;
  welcome: { points: number; spend: number; days: number; currency: string } | null;
  blurb: string;
};

export type Catalog = {
  airports: Airport[];
  cards: CardInfo[];
  categories: { id: string; label: string; hint: string }[];
};

export type Demo = {
  id: string;
  pathway: string;
  title: string;
  detail: string;
  hack?: HackRequest;
  strategy?: StrategyRequest;
  copilot?: {
    message: string;
    origin: string;
    destination: string;
    balances: CardBalance[];
  };
};

export type HackRequest = {
  origin: string;
  destination: string;
  date: string | null;
  cabin: string;
  passengers: number;
  cards: CardBalance[];
  flexible: boolean;
  nearby: boolean;
  via: string | null;
  return_date: string | null;
};

export type TransferLeg = {
  card_id: string;
  card_name: string;
  currency: string;
  currency_label: string;
  bank_points: number;
  miles: number;
  ratio: string;
  portal_url: string;
  portal_label: string;
};

export type AwardOption = {
  id: string;
  program_id: string;
  program: string;
  alliance: string;
  origin: string;
  destination: string;
  origin_city: string;
  destination_city: string;
  miles: number;
  taxes: number;
  cash: number;
  currency: string;
  saved: number;
  savings_percent: number;
  cpp: number;
  cpp_baseline: number;
  cpp_unit: string;
  can_book: boolean;
  miles_short: number;
  transfers: TransferLeg[];
  why: string;
  promo: string;
  stopover: { airport: string; city: string; note: string } | null;
  note: string;
  deep_link: string;
  date: string;
  cabin: string;
  round_trip: boolean;
};

export type NearbyItem = {
  kind: "priced" | "unpriced";
  code: string;
  city: string;
  minutes: number | null;
  mode: string | null;
  instead_of: string;
  option: AwardOption | null;
  note?: string;
};

export type HackResult = {
  found: boolean;
  query: {
    origin: string;
    destination: string;
    origin_city: string;
    destination_city: string;
    date: string;
    return_date: string | null;
    cabin: string;
    passengers: number;
    flexible: boolean;
    nearby: boolean;
    via: string | null;
    round_trip: boolean;
  };
  cash: { amount: number; currency: string };
  best: AwardOption;
  alternatives: AwardOption[];
  nearby: NearbyItem[];
  flexible_dates: {
    date: string;
    delta_days: number;
    cash: number;
    miles: number;
    taxes: number;
    currency: string;
  }[];
  stopover_note: string;
  cabin_note: string;
  pricing_note: string;
  booking: { steps: BookingStep[] };
};

export type BookingStep = {
  n: number;
  title: string;
  body: string;
  warning?: string;
  note?: string;
  links?: { label: string; url: string; detail: string }[];
  checks?: string[];
};

export type StrategyRequest = {
  origin: string;
  destination: string;
  months: number;
  use_portals: boolean;
  cards: CardBalance[];
  monthly_expenses: Record<string, number>;
};

export type Assignment = {
  category: string;
  label: string;
  monthly_spend: number;
  card_id: string | null;
  card_name: string;
  multiplier: number;
  portal: boolean;
  monthly_points: number;
  blurb: string;
};

export type TimelineMonth = {
  month: number;
  label: string;
  earned: number;
  bonus: number;
  milestone: number;
  cumulative: number;
  reached: boolean;
  book_month?: boolean;
  events: string[];
};

export type StrategyPlan = {
  origin: { code: string; city: string };
  destination: { code: string; city: string };
  months: number;
  departure: string;
  departure_label: string;
  use_portals: boolean;
  award: {
    id: string;
    program_id: string;
    program: string;
    alliance: string;
    miles: number;
    taxes: number;
    cash: number;
    currency: string;
  };
  starting_points: number;
  points_needed: number;
  monthly_points: number;
  assignments: Assignment[];
  months_without_bonus: number | null;
  months_with_bonus: number | null;
  halves_wait: boolean;
  recommendation: {
    card_id: string;
    card_name: string;
    welcome_points: number;
    spend: number;
    spend_currency: string;
    days: number;
    bonus_month: number;
    multiplier_gain: number;
    blurb: string;
  } | null;
  alternates: { card_id: string; card_name: string; months: number; welcome_points: number }[];
  milestone: {
    threshold: number;
    points: number;
    month: number;
    household_monthly: number;
    currency: string;
  } | null;
  rent_tip: { card_id: string; card_name: string; extra_monthly_points: number; note: string } | null;
  timeline: TimelineMonth[];
  currency: string;
  narrative: string;
  booking_preview: {
    origin: string;
    destination: string;
    date: string;
    program: string;
    miles: number;
    taxes: number;
    currency: string;
  };
};

export type CopilotAnswer = {
  can_combine: boolean;
  answer: string;
  destination: { code: string; city: string } | null;
  origin: { code: string; city: string } | null;
  program: string;
  combined_miles: number;
  miles_needed: number | null;
  taxes: number | null;
  cash: number | null;
  currency: string | null;
  parts: { card_name: string; currency_label: string; bank_points: number; miles: number; ratio: string }[];
  miles_left: number | null;
};

export type TransferRow = {
  currency: string;
  currency_label: string;
  issuer: string;
  program_id: string;
  program: string;
  alliance: string;
  ratio: string;
  sweet_spot: string;
  sample: boolean;
};

export type ParsedBooking = {
  ok: boolean;
  simulated: boolean;
  origin: string;
  destination: string;
  date: string | null;
  airline: string;
  flight_number: string;
  cash_price: number | null;
  currency: string | null;
  cabin: string;
  note: string;
};
