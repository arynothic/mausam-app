import {
  searchIndiaSeeds,
  type NamedLocation,
  NamedLocationSchema,
} from "@mausam/shared";
import type { WeatherProviderOptions } from "../weather/types.js";

interface OpenMeteoGeocodeResult {
  results?: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country_code?: string;
    admin1?: string;
    admin2?: string;
  }[];
}

function seedToNamed(seed: ReturnType<typeof searchIndiaSeeds>[number]): NamedLocation {
  return NamedLocationSchema.parse({
    id: seed.id,
    name: seed.name,
    district: seed.district,
    state: seed.state,
    country: "IN",
    point: { lat: seed.lat, lon: seed.lon },
  });
}

export class LocationSearchService {
  private readonly fetchImpl: typeof fetch;

  constructor(options?: WeatherProviderOptions) {
    this.fetchImpl = options?.fetchImpl ?? fetch;
  }

  async search(query: string, limit: number): Promise<NamedLocation[]> {
    const seeds = searchIndiaSeeds(query, limit).map(seedToNamed);
    const remote = await this.fetchOpenMeteo(query, limit);
    const merged = [...seeds];
    for (const loc of remote) {
      if (!merged.some((m) => m.id === loc.id)) merged.push(loc);
    }
    return merged.slice(0, limit);
  }

  private async fetchOpenMeteo(query: string, limit: number): Promise<NamedLocation[]> {
    const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
    url.searchParams.set("name", query);
    url.searchParams.set("count", String(limit));
    url.searchParams.set("language", "en");
    url.searchParams.set("countryCode", "IN");

    try {
      const res = await this.fetchImpl(url);
      if (!res.ok) return [];
      const json = (await res.json()) as OpenMeteoGeocodeResult;
      return (json.results ?? []).map((r) =>
        NamedLocationSchema.parse({
          id: `om-${String(r.id)}`,
          name: r.name,
          district: r.admin2,
          state: r.admin1,
          country: r.country_code ?? "IN",
          point: { lat: r.latitude, lon: r.longitude },
        }),
      );
    } catch {
      return [];
    }
  }
}
