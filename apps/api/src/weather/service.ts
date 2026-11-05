import {
  NamedLocationSchema,
  type NamedLocation,
  type WeatherSnapshot,
} from "@mausam/shared";
import { CACHE_TTL_MS, type CacheStore } from "../lib/cache.js";
import { gridKey } from "../weather/codes.js";
import type { WeatherProvider } from "../weather/types.js";

export class CachedWeatherService {
  constructor(
    private readonly provider: WeatherProvider,
    private readonly cache: CacheStore,
  ) {}

  async getSnapshot(location: NamedLocation): Promise<WeatherSnapshot> {
    const key = `weather:${gridKey(location.point.lat, location.point.lon)}:${this.provider.id}`;
    const cached = await this.cache.get(key);
    if (cached !== undefined) return cached as WeatherSnapshot;

    const fresh = await this.provider.fetchSnapshot(location);
    await this.cache.set(key, fresh, CACHE_TTL_MS.snapshot);
    return fresh;
  }
}

export function locationFromQuery(
  lat: number,
  lon: number,
  name?: string,
): NamedLocation {
  return NamedLocationSchema.parse({
    id: `query-${lat.toFixed(4)}-${lon.toFixed(4)}`,
    name: name ?? `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
    country: "IN",
    point: { lat, lon },
  });
}
