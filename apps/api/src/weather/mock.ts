import type { NamedLocation, WeatherAlert, WeatherSnapshot } from "@mausam/shared";
import { gridKey, locationIdFromPoint, wmoConditionText } from "./codes.js";
import type { WeatherProvider, WeatherProviderOptions } from "./types.js";

function seededNumber(lat: number, lon: number, salt: number): number {
  const x = Math.sin(lat * 12.9898 + lon * 78.233 + salt) * 43758.5453;
  return x - Math.floor(x);
}

export class MockWeatherProvider implements WeatherProvider {
  readonly id = "mock" as const;

  fetchSnapshot(location: NamedLocation): Promise<WeatherSnapshot> {
    const now = new Date();
    const baseTemp = 18 + seededNumber(location.point.lat, location.point.lon, 1) * 18;
    const code = [0, 2, 61, 95][Math.floor(seededNumber(location.point.lat, location.point.lon, 2) * 4)] ?? 0;

    const hourly = Array.from({ length: 48 }, (_, i) => {
      const t = new Date(now.getTime() + i * 3600_000);
      return {
        time: t.toISOString(),
        temperatureC: Math.round((baseTemp + Math.sin(i / 5) * 4) * 10) / 10,
        humidityPct: 55,
        windSpeedKmh: 8,
        precipitationMm: code === 61 ? 0.4 : 0,
        precipitationProbabilityPct: code === 61 ? 60 : 10,
        weatherCode: code,
        uvIndex: t.getHours() >= 8 && t.getHours() <= 17 ? 5 : 0,
        isDay: t.getHours() >= 6 && t.getHours() <= 18,
      };
    });

    const daily = Array.from({ length: 7 }, (_, d) => {
      const date = new Date(now);
      date.setDate(date.getDate() + d);
      const isoDate = date.toISOString().slice(0, 10);
      return {
        date: isoDate,
        tempMinC: Math.round((baseTemp - 4) * 10) / 10,
        tempMaxC: Math.round((baseTemp + 6) * 10) / 10,
        precipitationSumMm: d === 2 ? 8 : 0,
        precipitationProbabilityMaxPct: d === 2 ? 70 : 15,
        weatherCode: d === 2 ? 63 : 2,
        uvIndexMax: 7,
        windSpeedMaxKmh: 22,
      };
    });

    const alerts: WeatherAlert[] =
      code === 95
        ? [
            {
              id: `mock-alert-${gridKey(location.point.lat, location.point.lon)}`,
              source: "mock",
              title: "Mock thunderstorm watch",
              description:
                "Demo IMD-style alert from MockProvider. Replace with live IMD feed when configured.",
              severity: "warning",
              areas: [location.name],
              effectiveFrom: now.toISOString(),
              effectiveTo: new Date(now.getTime() + 6 * 3600_000).toISOString(),
              recommendedActions: ["Avoid open fields", "Stay indoors if thunder audible"],
            },
          ]
        : [];

    return Promise.resolve({
      fetchedAt: now.toISOString(),
      location: {
        ...location,
        id: location.id || locationIdFromPoint(location.point.lat, location.point.lon),
      },
      provider: "mock",
      current: {
        observedAt: now.toISOString(),
        temperatureC: Math.round(baseTemp * 10) / 10,
        feelsLikeC: Math.round((baseTemp + 2) * 10) / 10,
        humidityPct: 58,
        windSpeedKmh: 12,
        weatherCode: code,
        conditionText: wmoConditionText(code),
        isDay: now.getHours() >= 6 && now.getHours() <= 18,
      },
      hourly,
      daily,
      airQuality: { aqi: 78, category: "Moderate", pm25: 28 },
      uvIndexCurrent: 5,
      alerts,
    });
  }
}

export class ImdWeatherProvider implements WeatherProvider {
  readonly id = "imd" as const;
  private readonly fallback: MockWeatherProvider;

  constructor(_options?: WeatherProviderOptions) {
    this.fallback = new MockWeatherProvider();
  }

  /**
   * TODO: Integrate IMD MOS/nowcast endpoints and CAP warning feeds.
   * Requires credentials, allowlisting, and field mapping to WeatherSnapshot.
   */
  fetchSnapshot(location: NamedLocation): Promise<WeatherSnapshot> {
    return this.fallback.fetchSnapshot(location).then((snap) => ({
      ...snap,
      provider: "imd",
      alerts: snap.alerts.map((a) => ({ ...a, source: "imd" as const })),
    }));
  }
}
