/** WMO weather interpretation codes (Open-Meteo). */
export function wmoConditionText(code: number): string {
  const map: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return map[code] ?? "Unknown";
}

export function locationIdFromPoint(lat: number, lon: number): string {
  return `grid-${lat.toFixed(2)}-${lon.toFixed(2)}`;
}

export function gridKey(lat: number, lon: number): string {
  const r = (n: number) => Math.round(n * 10) / 10;
  return `${String(r(lat))},${String(r(lon))}`;
}
