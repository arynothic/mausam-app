import type { InsightModule } from "../types.js";
import {
  cropTip,
  dailyRainSum,
  fmtNum,
  fmtTemp,
  maxDailyTemp,
  minDailyTemp,
  round1,
} from "../utils.js";

export const farmerInsights: InsightModule[] = [
  {
    id: "rainfall-outlook",
    personas: ["farmer"],
    compute({ snapshot }) {
      const sum7 = round1(dailyRainSum(snapshot, 7));
      return {
        type: "rainfall_outlook",
        personas: ["farmer"],
        title: "Rainfall (7 days)",
        headline:
          sum7 >= 30
            ? `${fmtNum(sum7)} mm expected this week — plan drainage.`
            : sum7 >= 10
              ? `${fmtNum(sum7)} mm rain this week — moderate field moisture.`
              : `Only ${fmtNum(sum7)} mm this week — irrigation may be needed.`,
        severity: sum7 >= 50 ? "warning" : sum7 <= 5 ? "caution" : "info",
        baseScore: 75,
        data: { precipitationSumMm7d: sum7, daily: snapshot.daily.slice(0, 7) },
        whyExplanation: "Sums daily precipitation from the 7-day forecast for field planning.",
      };
    },
  },
  {
    id: "spray-suitability",
    personas: ["farmer"],
    compute({ snapshot }) {
      const wind = snapshot.current.windSpeedKmh ?? 0;
      const rainToday = snapshot.daily[0]?.precipitationProbabilityMaxPct ?? 0;
      const ok = wind <= 15 && rainToday < 40 && !snapshot.hourly.slice(0, 12).some(
        (h) => (h.precipitationProbabilityPct ?? 0) > 50,
      );
      return {
        type: "spray_suitability",
        personas: ["farmer"],
        title: "Spray / irrigation window",
        headline: ok
          ? "Reasonable window for spraying or irrigation today."
          : "Avoid spraying — wind or rain likely.",
        severity: ok ? "good" : "warning",
        baseScore: ok ? 72 : 80,
        data: { windSpeedKmh: wind, rainChancePct: rainToday },
        whyExplanation: "Spray needs calm wind (<15 km/h) and dry hours per agromet practice.",
      };
    },
  },
  {
    id: "frost-heat-stress",
    personas: ["farmer"],
    compute({ snapshot }) {
      const tMin = minDailyTemp(snapshot, 2);
      const tMax = maxDailyTemp(snapshot, 3);
      if (tMin <= 4) {
        return {
          type: "frost_heat_stress",
          personas: ["farmer"],
          title: "Frost alert",
          headline: `Night lows near ${fmtTemp(tMin)}°C — protect sensitive crops.`,
          severity: "warning",
          baseScore: 85,
          whyExplanation: "Minimum forecast temperature below 4°C suggests frost risk.",
        };
      }
      if (tMax >= 40) {
        return {
          type: "frost_heat_stress",
          personas: ["farmer"],
          title: "Heat stress",
          headline: `Day highs up to ${fmtTemp(tMax)}°C — avoid midday field work.`,
          severity: "warning",
          baseScore: 82,
          whyExplanation: "Multi-day max temperature above 40°C increases heat stress on crops.",
        };
      }
      return {
        type: "frost_heat_stress",
        personas: ["farmer"],
        title: "Temperature stress",
        headline: "No frost or extreme heat flagged in the next few days.",
        severity: "good",
        baseScore: 45,
        whyExplanation: "Checks nightly min and daily max against frost/heat thresholds.",
      };
    },
  },
  {
    id: "crop-advisory",
    personas: ["farmer"],
    compute({ snapshot, profile }) {
      const crops = profile.farmer?.crops ?? ["wheat"];
      const primary = crops[0] ?? "wheat";
      const tip = cropTip(primary, snapshot);
      return {
        type: "crop_advisory",
        personas: ["farmer"],
        title: `${primary.charAt(0).toUpperCase()}${primary.slice(1)} advisory`,
        headline: tip,
        severity: "info",
        baseScore: 68,
        data: { crop: primary, crops },
        whyExplanation: "Crop-specific tips use rain and temperature outlook (IMD agromet style).",
      };
    },
  },
  {
    id: "soil-moisture-proxy",
    personas: ["farmer"],
    compute({ snapshot }) {
      const recentRain =
        (snapshot.daily[0]?.precipitationSumMm ?? 0) +
        (snapshot.daily[1]?.precipitationSumMm ?? 0);
      const proxy = recentRain >= 15 ? "high" : recentRain >= 5 ? "moderate" : "low";
      return {
        type: "soil_moisture_proxy",
        personas: ["farmer"],
        title: "Soil moisture (proxy)",
        headline:
          proxy === "high"
            ? "Soils likely saturated — avoid extra irrigation."
            : proxy === "moderate"
              ? "Moisture adequate short-term — monitor lower layers."
              : "Surface likely dry — plan irrigation if no rain soon.",
        severity: proxy === "low" ? "caution" : "info",
        baseScore: 60,
        data: { proxy, recentRainMm: round1(recentRain) },
        whyExplanation: "Proxy from 48h rainfall; not a satellite soil product.",
      };
    },
  },
];
