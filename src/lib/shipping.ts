import "server-only";
import {
  getShippingZones,
  getShippingZoneLocations,
  getShippingZoneMethods,
  type WooShippingMethod,
} from "./woocommerce";

export interface ShippingOption {
  zone_id: number;
  zone_name: string;
  method_id: string;       // e.g. "flat_rate"
  instance_id: number;
  title: string;
  cost: number;            // major units (parsed from settings.cost.value)
}

function parseMethodCost(method: WooShippingMethod): number {
  // free_shipping has no cost; everything else stores cost in settings.cost.value
  if (method.method_id === "free_shipping") return 0;
  const raw = method.settings?.cost?.value;
  if (!raw) return 0;
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Resolve the shipping options available to a given ISO-2 country.
 *
 * WooCommerce shipping zones can target:
 *  - country codes (`country:NG`)
 *  - continents (`continent:EU`)
 *  - postcodes (ignored here; needs the postcode at evaluation time)
 *  - state codes (ignored unless we collect state)
 *
 * Zone id 0 is the implicit "rest of world" fallback.
 */
export async function getShippingOptionsForCountry(
  country: string,
): Promise<ShippingOption[]> {
  const upper = country.toUpperCase();
  const zones = await getShippingZones();

  // Score zones by specificity: an explicit country match wins over a
  // continent match, which wins over the rest-of-world zone (id 0).
  type Candidate = { zoneId: number; zoneName: string; rank: number };
  const candidates: Candidate[] = [];

  for (const zone of zones) {
    if (zone.id === 0) {
      candidates.push({ zoneId: 0, zoneName: zone.name, rank: 0 });
      continue;
    }
    const locations = await getShippingZoneLocations(zone.id);
    const hasCountry = locations.some(
      (l) => l.type === "country" && l.code.toUpperCase() === upper,
    );
    if (hasCountry) {
      candidates.push({ zoneId: zone.id, zoneName: zone.name, rank: 3 });
      continue;
    }
    // (Continent matching skipped — needs an ISO-3166 → continent map.
    //  If we add international zones with continent targeting we'll wire
    //  that up; for now country-level is enough.)
  }

  if (candidates.length === 0) return [];

  candidates.sort((a, b) => b.rank - a.rank);
  // Take only the highest-ranked zone (country match preferred over rest-of-world)
  const winner = candidates[0];

  const methods = await getShippingZoneMethods(winner.zoneId);
  return methods
    .filter((m) => m.enabled)
    .map((m) => ({
      zone_id: winner.zoneId,
      zone_name: winner.zoneName,
      method_id: m.method_id,
      instance_id: m.instance_id,
      title: m.title || m.method_title,
      cost: parseMethodCost(m),
    }))
    .sort((a, b) => a.cost - b.cost);
}
