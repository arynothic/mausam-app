import type { InsightModule } from "../types.js";
import { fmtNum, hourLabel, isRainCode, isStormCode, schoolCommuteSlot, wearSuggestion } from "../utils.js";

export const parentInsights: InsightModule[] = [
  {
    id: "school-commute",
    personas: ["parent"],
    compute(ctx) {
      const slot = schoolCommuteSlot(ctx.now);
      const hour = ctx.snapshot.hourly.find(
        (h) => Math.abs(new Date(h.time).getTime() - slot.at.getTime()) < 3600_000,
      );
      const rain = hour
        ? isRainCode(hour.weatherCode) || (hour.precipitationProbabilityPct ?? 0) > 50
        : isRainCode(ctx.snapshot.current.weatherCode);
      return {
        type: "school_commute",
        personas: ["parent"],
        title: "School commute",
        headline: rain
          ? `${slot.label}: pack umbrellas — showers likely around ${hourLabel(slot.at)}.`
          : `${slot.label}: mostly dry near ${hourLabel(slot.at)}.`,
        severity: rain ? "caution" : "good",
        baseScore: 74,
        data: { slot: slot.label, at: slot.at.toISOString() },
        whyExplanation: "Matches the next school run time to hourly rain probability.",
      };
    },
  },
  {
    id: "what-to-wear",
    personas: ["parent"],
    compute({ snapshot }) {
      const temp = snapshot.current.feelsLikeC ?? snapshot.current.temperatureC;
      const rain = isRainCode(snapshot.current.weatherCode);
      const wear = wearSuggestion(temp, rain);
      return {
        type: "what_to_wear",
        personas: ["parent"],
        title: "What to wear",
        headline: wear,
        severity: "info",
        baseScore: 58,
        data: { suggestion: wear, tempC: temp },
        whyExplanation: "Simple dress guidance from temperature and rain — not a medical advice.",
      };
    },
  },
  {
    id: "outdoor-play",
    personas: ["parent"],
    compute(ctx) {
      const uv = ctx.snapshot.uvIndexCurrent ?? 0;
      const hot = ctx.snapshot.current.temperatureC > 35;
      const ok = !hot && uv < 8 && !isStormCode(ctx.snapshot.current.weatherCode);
      return {
        type: "outdoor_play",
        personas: ["parent"],
        title: "Outdoor play",
        headline: ok
          ? "Reasonable window for outdoor play — hat if sunny."
          : hot
            ? "Too hot for long outdoor play — choose mornings or indoors."
            : "Keep play indoors — storm or extreme UV risk.",
        severity: ok ? "good" : "caution",
        baseScore: ok ? 65 : 70,
        whyExplanation: "Combines heat, UV, and storm codes for playground safety.",
      };
    },
  },
  {
    id: "aqi-kids",
    personas: ["parent"],
    compute({ snapshot, profile }) {
      const aqi = snapshot.airQuality?.aqi;
      if (aqi === undefined) return null;
      const sensitive = profile.sensitivities.asthma || aqi > 150;
      return {
        type: "aqi_kids",
        personas: ["parent"],
        title: "Air quality for kids",
        headline: sensitive
          ? `AQI ${fmtNum(aqi)} — limit strenuous outdoor time.`
          : `AQI ${fmtNum(aqi)} — air okay for most children outdoors.`,
        severity: sensitive ? "warning" : aqi > 100 ? "caution" : "good",
        baseScore: sensitive ? 76 : 50,
        whyExplanation: "Children and asthma-sensitive profiles weight AQI more heavily.",
      };
    },
  },
  {
    id: "storm-alerts-parent",
    personas: ["parent"],
    compute({ snapshot }) {
      if (snapshot.alerts.length > 0) return null;
      if (!isStormCode(snapshot.current.weatherCode)) return null;
      return {
        type: "storm_parent",
        personas: ["parent"],
        title: "Thunderstorm",
        headline: "Thunder possible — keep kids indoors and away from open areas.",
        severity: "warning",
        baseScore: 78,
        whyExplanation: "Derived from storm weather codes when no formal alert is present.",
      };
    },
  },
];
