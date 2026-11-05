import type { UserProfile, WeatherSnapshot } from "../schemas/weather.js";

const baseLocation = {
  id: "in-delhi",
  name: "New Delhi",
  state: "Delhi",
  country: "IN",
  point: { lat: 28.6139, lon: 77.209 },
};

function hourlyTemplate(hours: number, start: Date): WeatherSnapshot["hourly"] {
  return Array.from({ length: hours }, (_, i) => {
    const t = new Date(start.getTime() + i * 3600_000);
    return {
      time: t.toISOString(),
      temperatureC: 22 + (i % 8),
      feelsLikeC: 24 + (i % 8),
      humidityPct: 55,
      windSpeedKmh: 10,
      precipitationMm: 0,
      precipitationProbabilityPct: 10,
      weatherCode: 2,
      uvIndex: t.getHours() >= 8 && t.getHours() <= 16 ? 6 : 1,
      isDay: t.getHours() >= 6 && t.getHours() <= 18,
    };
  });
}

const dailyTemplate: WeatherSnapshot["daily"] = Array.from({ length: 7 }, (_, d) => {
  const date = new Date("2026-06-15T00:00:00.000Z");
  date.setDate(date.getDate() + d);
  return {
    date: date.toISOString().slice(0, 10),
    tempMinC: 24,
    tempMaxC: 36,
    precipitationSumMm: d === 2 ? 12 : 2,
    precipitationProbabilityMaxPct: d === 2 ? 70 : 15,
    weatherCode: d === 2 ? 63 : 2,
    uvIndexMax: 8,
    windSpeedMaxKmh: 18,
  };
});

export const FIXTURE_NOW = new Date("2026-06-15T06:30:00.000Z");

export const FIXTURE_SNAPSHOT: WeatherSnapshot = {
  fetchedAt: FIXTURE_NOW.toISOString(),
  location: baseLocation,
  provider: "mock",
  current: {
    observedAt: FIXTURE_NOW.toISOString(),
    temperatureC: 28,
    feelsLikeC: 31,
    humidityPct: 62,
    windSpeedKmh: 14,
    weatherCode: 2,
    conditionText: "Partly cloudy",
    isDay: true,
  },
  hourly: hourlyTemplate(48, FIXTURE_NOW),
  daily: dailyTemplate,
  airQuality: { aqi: 118, category: "Moderate", pm25: 42 },
  uvIndexCurrent: 4,
  alerts: [],
};

export const FIXTURE_SNAPSHOT_STORM: WeatherSnapshot = {
  ...FIXTURE_SNAPSHOT,
  current: {
    ...FIXTURE_SNAPSHOT.current,
    weatherCode: 95,
    conditionText: "Thunderstorm",
  },
  alerts: [
    {
      id: "alert-1",
      source: "mock",
      title: "Thunderstorm warning",
      description: "Thunderstorm with lightning expected.",
      severity: "warning",
      areas: ["New Delhi"],
      effectiveFrom: FIXTURE_NOW.toISOString(),
      effectiveTo: new Date(FIXTURE_NOW.getTime() + 8 * 3600_000).toISOString(),
      recommendedActions: ["Stay indoors"],
    },
  ],
};

export function profileFor(persona: UserProfile["activePersona"]): UserProfile {
  return {
    deviceId: "test-device",
    personas: [persona],
    activePersona: persona,
    locations: [baseLocation],
    primaryLocationId: baseLocation.id,
    units: { temperature: "celsius", windSpeed: "kmh", precipitation: "mm" },
    sensitivities: { asthma: false, heatSensitive: false },
    farmer: persona === "farmer" ? { crops: ["wheat"] } : undefined,
    runner: persona === "runner" ? { preferredRunWindow: "morning" } : undefined,
    language: "en",
    cardVisibility: { hiddenCardIds: [], pinnedCardIds: [] },
  };
}
