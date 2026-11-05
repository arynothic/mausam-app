import type { HourlyForecast, Severity, WeatherSnapshot } from "../schemas/weather.js";

export function fmtTemp(c: number): string {
  return String(Math.round(c));
}

export function fmtNum(n: number): string {
  return String(n);
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function hourLabel(date: Date): string {
  return date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
}

export function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}

export function isRainCode(code: number): boolean {
  return (
    (code >= 51 && code <= 67) ||
    (code >= 80 && code <= 82) ||
    code === 95 ||
    code === 96 ||
    code === 99
  );
}

export function isStormCode(code: number): boolean {
  return code >= 95;
}

export function nextRainFreeWindow(
  hourly: HourlyForecast[],
  now: Date,
  minHours = 1,
): { start: Date; end: Date } | null {
  const future = hourly.filter((h) => new Date(h.time) >= now);
  let consecutive = 0;
  let start: Date | null = null;
  for (const h of future) {
    const t = new Date(h.time);
    const prob = h.precipitationProbabilityPct;
    const precip = h.precipitationMm;
    const wet =
      isRainCode(h.weatherCode) ||
      (prob !== undefined && prob >= 50) ||
      (precip !== undefined && precip > 0.2);
    if (!wet) {
      consecutive += 1;
      start ??= t;
      if (consecutive === minHours) {
        return { start, end: new Date(t.getTime() + 3600_000) };
      }
    } else {
      consecutive = 0;
      start = null;
    }
  }
  return null;
}

export function bestRunWindow(
  hourly: HourlyForecast[],
  now: Date,
): { start: Date; score: number } | null {
  const future = hourly.filter((h) => {
    const t = new Date(h.time);
    return t >= now && t.getTime() <= now.getTime() + 24 * 3600_000;
  });
  let best: { start: Date; score: number } | null = null;
  for (const h of future) {
    const temp = h.temperatureC;
    const wind = h.windSpeedKmh ?? 0;
    const rain = isRainCode(h.weatherCode) || (h.precipitationProbabilityPct ?? 0) > 40;
    if (rain) continue;
    let score = 70;
    if (temp >= 12 && temp <= 28) score += 15;
    if (wind <= 20) score += 10;
    if (wind > 30) score -= 20;
    if (temp > 32) score -= 15;
    const start = new Date(h.time);
    if (!best || score > best.score) best = { start, score };
  }
  return best;
}

export function runSuitabilityScore(snapshot: WeatherSnapshot): number {
  const c = snapshot.current;
  let score = 65;
  const temp = c.feelsLikeC ?? c.temperatureC;
  if (temp >= 10 && temp <= 26) score += 20;
  if (temp > 32) score -= 25;
  if ((c.windSpeedKmh ?? 0) > 25) score -= 15;
  if (isRainCode(c.weatherCode)) score -= 35;
  const aqi = snapshot.airQuality?.aqi;
  if (aqi !== undefined && aqi > 150) score -= 20;
  return Math.min(100, Math.max(0, score));
}

export function dailyRainSum(snapshot: WeatherSnapshot, days = 7): number {
  return snapshot.daily.slice(0, days).reduce((s, d) => s + (d.precipitationSumMm ?? 0), 0);
}

export function maxDailyTemp(snapshot: WeatherSnapshot, days = 3): number {
  return Math.max(...snapshot.daily.slice(0, days).map((d) => d.tempMaxC));
}

export function minDailyTemp(snapshot: WeatherSnapshot, days = 2): number {
  return Math.min(...snapshot.daily.slice(0, days).map((d) => d.tempMinC));
}

export function schoolCommuteSlot(now: Date): { label: string; at: Date } {
  const at = new Date(now);
  at.setHours(8, 0, 0, 0);
  if (now.getHours() >= 9) {
    at.setHours(15, 0, 0, 0);
    return { label: "afternoon pickup", at };
  }
  return { label: "morning school run", at };
}

export function wearSuggestion(tempC: number, rain: boolean): string {
  if (rain) return "Raincoat and closed shoes";
  if (tempC < 16) return "Light jacket and long trousers";
  if (tempC > 32) return "Light cotton, hat, and water bottle";
  return "Comfortable layers — one light extra in the bag";
}

export function disruptionRisk(snapshot: WeatherSnapshot): {
  level: Severity;
  reasons: string[];
} {
  const reasons: string[] = [];
  let level: Severity = "good";
  const c = snapshot.current;
  if ((c.visibilityKm ?? 10) < 2) {
    reasons.push("Low visibility — fog likely");
    level = "warning";
  }
  if (isStormCode(c.weatherCode)) {
    reasons.push("Thunderstorm in the area");
    level = "severe";
  }
  if ((c.precipitationMm ?? 0) > 5 || isRainCode(c.weatherCode)) {
    reasons.push("Heavy rain may slow road travel");
    if (level === "good") level = "caution";
  }
  const maxWind = Math.max(
    c.windSpeedKmh ?? 0,
    ...snapshot.daily.slice(0, 2).map((d) => d.windSpeedMaxKmh ?? 0),
  );
  if (maxWind > 45) {
    reasons.push("Strong winds — hill roads may be risky");
    level = level === "severe" ? "severe" : "warning";
  }
  if (reasons.length === 0) reasons.push("No major weather disruptions expected");
  return { level, reasons };
}

export function cropTip(crop: string, snapshot: WeatherSnapshot): string {
  const rain7 = dailyRainSum(snapshot, 7);
  const name = crop.toLowerCase();
  if (name.includes("wheat")) {
    if (rain7 < 5) return "Monitor soil moisture; light irrigation may help tillers.";
    if (rain7 > 40) return "Delay nitrogen top-dress if fields are waterlogged.";
    return "Conditions look fair for vegetative growth — scout for rust after humid spells.";
  }
  if (name.includes("rice")) {
    if (rain7 > 30) return "Ensure drainage; stagnant water increases blast risk.";
    return "Maintain shallow flood as per growth stage; watch stem borer traps.";
  }
  if (name.includes("cotton")) {
    if (maxDailyTemp(snapshot, 3) > 38) return "Heat stress likely — avoid midday field work.";
    return "Good window for pest scouting when leaves are dry.";
  }
  return "Follow local agromet advisory; adjust irrigation to weekly rain totals.";
}
