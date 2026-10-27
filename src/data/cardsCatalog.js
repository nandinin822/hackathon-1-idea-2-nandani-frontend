/**
 * Verified Rewards Card & Loyalty Programme Catalogue
 * Only includes publicly documented, verified terms or explicitly marked illustrative data.
 * Zero banking credentials or sensitive personal information are stored.
 */

export const MARKETS = [
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD' },
  { code: 'ES', name: 'España / Eurozona', flag: '🇪🇸', currency: 'EUR' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP' },
  { code: 'MX', name: 'México', flag: '🇲🇽', currency: 'MXN' },
];

export const CARDS_CATALOGUE = [
  // --- UNITED STATES ---
  {
    id: 'us_chase_csp',
    market: 'US',
    name: 'Chase Sapphire Preferred®',
    issuer: 'Chase',
    program: 'Chase Ultimate Rewards®',
    currency: 'USD',
    annualFee: 95,
    earningRules: {
      travel: 2.0, // 2x travel
      dining: 3.0, // 3x dining
      groceries: 3.0, // 3x online groceries
      utilities: 1.0,
      rent: 0.0, // Rent not eligible directly
      other: 1.0,
    },
    transferRatio: '1:1 (Direct Transfer)',
    transferPartners: [
      'United MileagePlus',
      'Hyatt World of Hyatt',
      'British Airways Executive Club',
      'Air France/KLM Flying Blue',
      'Air Canada Aeroplan',
      'Virgin Atlantic',
    ],
    verifiedDate: '2026-10-15',
    sourceUrl: 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred',
    isDemo: false,
    notes: 'Points transfer 1:1 instantly to 14 airline and hotel partners. 25% redemption bonus through Chase Travel portal.',
  },
  {
    id: 'us_amex_gold',
    market: 'US',
    name: 'American Express® Gold Card',
    issuer: 'American Express',
    program: 'Membership Rewards®',
    currency: 'USD',
    annualFee: 325,
    earningRules: {
      travel: 3.0, // 3x flights booked directly
      dining: 4.0, // 4x restaurants worldwide
      groceries: 4.0, // 4x US supermarkets (up to $25k/yr)
      utilities: 1.0,
      rent: 0.0,
      other: 1.0,
    },
    transferRatio: '1:1 (Most Partners)',
    transferPartners: [
      'Delta SkyMiles',
      'Iberia Plus Avios',
      'British Airways Executive Club',
      'Avianca LifeMiles',
      'Air Canada Aeroplan',
      'Emirates Skywards',
    ],
    verifiedDate: '2026-10-15',
    sourceUrl: 'https://www.americanexpress.com/us/credit-cards/card/gold-card/',
    isDemo: false,
    notes: 'Leading dining and supermarket points multiplier in the US market. Frequent 15-30% transfer bonuses.',
  },
  {
    id: 'us_capone_venture_x',
    market: 'US',
    name: 'Capital One Venture X Rewards',
    issuer: 'Capital One',
    program: 'Capital One Miles',
    currency: 'USD',
    annualFee: 395,
    earningRules: {
      travel: 5.0, // 5x flights, 10x hotels/cars via portal
      dining: 2.0,
      groceries: 2.0,
      utilities: 2.0,
      rent: 0.0,
      other: 2.0, // 2x everywhere base
    },
    transferRatio: '1:1 (Direct)',
    transferPartners: [
      'Avianca LifeMiles',
      'Turkish Airlines Miles&Smiles',
      'British Airways Executive Club',
      'Virgin Red',
      'Air France/KLM Flying Blue',
      'Cathay Pacific Asia Miles',
    ],
    verifiedDate: '2026-10-15',
    sourceUrl: 'https://www.capitalone.com/credit-cards/venture-x/',
    isDemo: false,
    notes: 'Flat 2x earning on all eligible purchases with $300 annual travel portal credit.',
  },
  {
    id: 'us_bilt_rewards',
    market: 'US',
    name: 'Bilt World Elite Mastercard®',
    issuer: 'Wells Fargo',
    program: 'Bilt Rewards',
    currency: 'USD',
    annualFee: 0,
    earningRules: {
      travel: 2.0,
      dining: 3.0,
      groceries: 1.0,
      utilities: 1.0,
      rent: 1.0, // 1x points on rent fee-free (up to 100k/yr)
      other: 1.0,
    },
    transferRatio: '1:1',
    transferPartners: [
      'Alaska Airlines Mileage Plan',
      'Air France/KLM Flying Blue',
      'British Airways Executive Club',
      'Virgin Atlantic',
      'World of Hyatt',
    ],
    verifiedDate: '2026-10-15',
    sourceUrl: 'https://www.biltrewards.com/card',
    isDemo: false,
    notes: 'The only card providing 1x points on monthly rent payments without standard credit card processing surcharges.',
  },

  // --- ESPAÑA / EUROZONA ---
  {
    id: 'es_amex_platinum',
    market: 'ES',
    name: 'American Express® Platinum España',
    issuer: 'American Express España',
    program: 'Membership Rewards® ES',
    currency: 'EUR',
    annualFee: 780,
    earningRules: {
      travel: 1.0,
      dining: 1.0,
      groceries: 1.0,
      utilities: 1.0,
      rent: 0.0,
      other: 1.0,
    },
    transferRatio: '1:1 (Avios / Flying Blue)',
    transferPartners: [
      'Iberia Plus',
      'British Airways Executive Club',
      'Air France/KLM Flying Blue',
      'SAS EuroBonus',
      'Marriott Bonvoy',
    ],
    verifiedDate: '2026-10-10',
    sourceUrl: 'https://www.americanexpress.com/es/tarjetas/tarjeta-platinum/',
    isDemo: false,
    notes: 'Acumula 1 punto MR por cada 1€ de gasto. Canje directo a Avios Iberia Plus y Flying Blue.',
  },
  {
    id: 'es_iberia_icon',
    market: 'ES',
    name: 'Iberia Cards ICON',
    issuer: 'Iberia Cards / Santander / BBVA',
    program: 'Iberia Plus Avios',
    currency: 'EUR',
    annualFee: 100,
    earningRules: {
      travel: 1.0, // 1 Avios per 2€ on general spend, 1 Avios per 1€ on Iberia
      dining: 0.5,
      groceries: 0.5,
      utilities: 0.5,
      rent: 0.0,
      other: 0.5,
    },
    transferRatio: 'Direct Avios Deposit',
    transferPartners: ['Iberia Plus (Direct)', 'British Airways Executive Club (Combine My Avios)'],
    verifiedDate: '2026-10-10',
    sourceUrl: 'https://www.iberiacards.es/tarjetas/tarjeta-iberia-icon/',
    isDemo: false,
    notes: 'Nivel Plata de Iberia Plus inmediato y descuento directo del 10% en billetes de Iberia.',
  },

  // --- UNITED KINGDOM ---
  {
    id: 'uk_amex_gold',
    market: 'UK',
    name: 'Amex Preferred Rewards Gold UK',
    issuer: 'American Express UK',
    program: 'Membership Rewards® UK',
    currency: 'GBP',
    annualFee: 195,
    earningRules: {
      travel: 2.0, // 2x on airlines
      dining: 1.0,
      groceries: 1.0,
      utilities: 1.0,
      rent: 0.0,
      other: 1.0,
    },
    transferRatio: '1:1',
    transferPartners: ['British Airways Executive Club', 'Virgin Atlantic Flying Club', 'Emirates Skywards'],
    verifiedDate: '2026-10-10',
    sourceUrl: 'https://www.americanexpress.com/en-gb/credit-cards/gold-credit-card/',
    isDemo: false,
    notes: '£0 annual fee in the first year, 1:1 transfer to British Airways Avios.',
  },

  // --- MÉXICO ---
  {
    id: 'mx_amex_aeromexico',
    market: 'MX',
    name: 'The Platinum Card® Aeroméxico',
    issuer: 'American Express México',
    program: 'Aeroméxico Rewards (Puntos Premier)',
    currency: 'MXN',
    annualFee: 1000,
    earningRules: {
      travel: 2.4, // Puntos por USD equivalente
      dining: 1.6,
      groceries: 1.6,
      utilities: 1.0,
      rent: 0.0,
      other: 1.6,
    },
    transferRatio: 'Direct Deposit',
    transferPartners: ['Aeroméxico Rewards / SkyTeam'],
    verifiedDate: '2026-10-10',
    sourceUrl: 'https://www.americanexpress.com/mx/tarjetas-de-credito/aeromexico-platinum/',
    isDemo: false,
    notes: 'Boleto 2x1 anual para acompañante en rutas nacionales o a Estados Unidos.',
  },
];
