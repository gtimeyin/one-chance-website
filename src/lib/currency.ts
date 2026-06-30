export const COUNTRY_COOKIE = "oc-country";
export const DEFAULT_COUNTRY = "NG";

// Woo store's base currency (set in WP admin → WooCommerce → Settings → General).
// Used when the visitor's country isn't covered by a WCPBC zone.
export const BASE_CURRENCY = "USD";

/**
 * WCPBC zones configured in WP admin → WooCommerce → Settings → Pricing Zones.
 * The `slug` here MUST match the prefix Woo uses in product meta keys
 * (`_<slug>_price`, `_<slug>_regular_price`, `_<slug>_sale_price`). Extend
 * this map whenever you add a new zone in the admin.
 */
export const ZONES: Record<string, { currency: string; countries: string[] }> = {
  nigeria: { currency: "NGN", countries: ["NG"] },
  kenya: { currency: "KES", countries: ["KE"] },
  "united-kingdom": { currency: "GBP", countries: ["GB"] },
  "north-america": { currency: "USD", countries: ["US", "CA"] },
  europe: {
    currency: "EUR",
    countries: [
      "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
      "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
      "PL", "PT", "RO", "SK", "SI", "ES", "SE",
      // EFTA / EU-adjacent that often share EUR-zone pricing:
      "CH", "NO", "IS", "LI",
    ],
  },
};

// ISO-3166-1 alpha-2 → display name for the countries we serve.
// Sourced from the union of all ZONES.countries. Add a country here when
// you add it to a zone.
export const COUNTRY_NAMES: Record<string, string> = {
  NG: "Nigeria",
  KE: "Kenya",
  GB: "United Kingdom",
  US: "United States",
  CA: "Canada",
  AT: "Austria",
  BE: "Belgium",
  BG: "Bulgaria",
  HR: "Croatia",
  CY: "Cyprus",
  CZ: "Czechia",
  DK: "Denmark",
  EE: "Estonia",
  FI: "Finland",
  FR: "France",
  DE: "Germany",
  GR: "Greece",
  HU: "Hungary",
  IE: "Ireland",
  IT: "Italy",
  LV: "Latvia",
  LT: "Lithuania",
  LU: "Luxembourg",
  MT: "Malta",
  NL: "Netherlands",
  PL: "Poland",
  PT: "Portugal",
  RO: "Romania",
  SK: "Slovakia",
  SI: "Slovenia",
  ES: "Spain",
  SE: "Sweden",
  CH: "Switzerland",
  NO: "Norway",
  IS: "Iceland",
  LI: "Liechtenstein",
};

/**
 * All supported countries (those that appear in any ZONES entry), sorted
 * alphabetically by display name. Use this to populate a country dropdown
 * on the storefront.
 */
export function supportedCountries(): { code: string; name: string }[] {
  const codes = new Set<string>();
  for (const zone of Object.values(ZONES)) {
    for (const c of zone.countries) codes.add(c);
  }
  return [...codes]
    .map((code) => ({ code, name: COUNTRY_NAMES[code] ?? code }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function zoneSlugForCountry(country: string): string | null {
  const c = country.toUpperCase();
  for (const [slug, info] of Object.entries(ZONES)) {
    if (info.countries.includes(c)) return slug;
  }
  return null;
}

export function currencyForCountry(country: string): string {
  const slug = zoneSlugForCountry(country);
  return slug ? ZONES[slug].currency : BASE_CURRENCY;
}
