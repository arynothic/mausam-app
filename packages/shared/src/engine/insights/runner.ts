import type { InsightModule } from "../types.js";
import {
  bestRunWindow,
  fmtNum,
  fmtTemp,
  hourLabel,
  nextRainFreeWindow,
  runSuitabilityScore,
} from "../utils.js";

export const runnerInsights: InsightModule[] = [
  {
    id: "run-suitability",
    personas: ["runner"],
    compute(ctx) {
      let score = runSuitabilityScore(ctx.snapshot);
      if (ctx.profile.sensitivities.heatSensitive && ctx.snapshot.current.temperatureC > 30) {
        score -= 15;
      }
      if (ctx.profile.sensitivities.asthma && (ctx.snapshot.airQuality?.aqi ?? 0) > 100) {
        score -= 10;
      }
      const severity =
        score >= 75 ? "good" : score >= 55 ? "caution" : score >= 35 ? "warning" : "severe";
      return {
        type: "run_suitability",
        personas: ["runner"],
        title: "Run suitability",
        headline:
          score >= 75
            ? "Great conditions for a run today."
            : score >= 55
              ? "Run possible — take it easy and hydrate."
              : "Not ideal for running right now.",
        severity,
        baseScore: score,
        data: { score },
        whyExplanation:
          "Score uses temperature, rain, wind, AQI, and your sensitivity settings.",
      };
    },
  },
  {
    id: "best-run-window",
    personas: ["runner"],
    compute(ctx) {
      const best = bestRunWindow(ctx.snapshot.hourly, ctx.now);
      if (!best) {
        return {
          type: "best_run_window",
          personas: ["runner"],
          title: "Best time to run",
          headline: "No clear dry window in the next 24 hours.",
          severity: "warning",
          baseScore: 70,
          whyExplanation: "Hourly rain probability and weather codes show limited dry slots.",
        };
      }
      return {
        type: "best_run_window",
        personas: ["runner"],
        title: "Best time to run",
        headline: `${hourLabel(best.start)} looks best today.`,
        severity: "good",
        baseScore: 78,
        data: { start: best.start.toISOString(), score: best.score },
        validUntil: new Date(best.start.getTime() + 2 * 3600_000).toISOString(),
        whyExplanation:
          "Picks the driest hour with comfortable temperature and moderate wind in the next day.",
      };
    },
  },
  {
    id: "feels-like",
    personas: ["runner"],
    compute({ snapshot }) {
      const fl = snapshot.current.feelsLikeC ?? snapshot.current.temperatureC;
      return {
        type: "feels_like",
        personas: ["runner"],
        title: "Feels-like",
        headline: `Feels like ${fmtTemp(fl)}°C on exposed roads.`,
        severity: fl > 32 ? "caution" : "info",
        baseScore: 50,
        data: { feelsLikeC: fl },
        whyExplanation: "Apparent temperature matters more than air temp for pacing and hydration.",
      };
    },
  },
  {
    id: "aqi-run",
    personas: ["runner"],
    compute({ snapshot, profile }) {
      const aqi = snapshot.airQuality?.aqi;
      if (aqi === undefined) return null;
      const bad = aqi > 150 || (profile.sensitivities.asthma && aqi > 100);
      return {
        type: "aqi_run",
        personas: ["runner"],
        title: "Air quality",
        headline: bad
          ? `AQI ${fmtNum(aqi)} — consider indoor training.`
          : `AQI ${fmtNum(aqi)} — acceptable for most runners.`,
        severity: bad ? "warning" : aqi > 100 ? "caution" : "good",
        baseScore: bad ? 72 : 48,
        data: { aqi, category: snapshot.airQuality?.category },
        whyExplanation: "PM2.5-based AQI affects breathing during hard efforts.",
      };
    },
  },
  {
    id: "uv-run",
    personas: ["runner"],
    compute({ snapshot, now }) {
      const uv = snapshot.uvIndexCurrent ?? snapshot.daily[0]?.uvIndexMax;
      if (uv === undefined) return null;
      const day = now.getHours() >= 6 && now.getHours() <= 18;
      if (!day) return null;
      return {
        type: "uv_run",
        personas: ["runner"],
        title: "UV exposure",
        headline:
          uv >= 8 ? "Very high UV — sunscreen and cap essential." : `UV index ${fmtNum(uv)} — use sunscreen on long runs.`,
        severity: uv >= 8 ? "warning" : uv >= 6 ? "caution" : "info",
        baseScore: uv >= 6 ? 60 : 40,
        data: { uvIndex: uv },
        whyExplanation: "UV peaks mid-day; shown when the sun is up at your location.",
      };
    },
  },
  {
    id: "rain-free-windows",
    personas: ["runner"],
    compute(ctx) {
      const window = nextRainFreeWindow(ctx.snapshot.hourly, ctx.now, 1);
      if (!window) {
        return {
          type: "rain_free_window",
          personas: ["runner"],
          title: "Rain-free window",
          headline: "Showers likely through the next day — plan indoor backup.",
          severity: "caution",
          baseScore: 65,
          whyExplanation: "Looks for 1+ hour with low rain probability in hourly forecast.",
        };
      }
      return {
        type: "rain_free_window",
        personas: ["runner"],
        title: "Rain-free window",
        headline: `Dry-ish slot around ${hourLabel(window.start)}.`,
        severity: "good",
        baseScore: 70,
        data: { start: window.start.toISOString(), end: window.end.toISOString() },
        validUntil: window.end.toISOString(),
        whyExplanation: "Helps you slot a run between showers.",
      };
    },
  },
];
