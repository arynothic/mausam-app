import type { InsightModule } from "../types.js";
import { dailyRainSum, disruptionRisk, fmtNum, fmtTemp, isRainCode, round1 } from "../utils.js";

export const travellerInsights: InsightModule[] = [
  {
    id: "route-weather",
    personas: ["traveller"],
    compute({ snapshot, profile }) {
      const primary = profile.locations.find((l) => l.id === profile.primaryLocationId);
      const others = profile.locations.filter((l) => l.id !== profile.primaryLocationId);
      if (others.length === 0) {
        return {
          type: "route_weather",
          personas: ["traveller"],
          title: "Destination weather",
          headline: `${snapshot.location.name}: ${fmtTemp(snapshot.current.temperatureC)}°C, ${snapshot.current.conditionText.toLowerCase()}.`,
          severity: "info",
          baseScore: 55,
          whyExplanation: "Add saved locations to compare routes (traveller mode).",
        };
      }
      const dest = others.at(0);
      if (dest === undefined) return null;
      return {
        type: "route_weather",
        personas: ["traveller"],
        title: "Route snapshot",
        headline: `Here: ${fmtTemp(snapshot.current.temperatureC)}°C · saved stop ${dest.name} in your list for comparison.`,
        severity: "info",
        baseScore: 58,
        data: { primary: primary?.name ?? "", compare: dest.name },
        whyExplanation: "Full multi-city compare ships with locations screen; this highlights your saved stops.",
      };
    },
  },
  {
    id: "disruption-risk",
    personas: ["traveller"],
    compute({ snapshot }) {
      const { level, reasons } = disruptionRisk(snapshot);
      return {
        type: "disruption_risk",
        personas: ["traveller"],
        title: "Travel disruption",
        headline: reasons[0] ?? "Check conditions before you leave.",
        severity: level === "severe" ? "severe" : level,
        baseScore: level === "good" ? 50 : 80,
        data: { reasons },
        whyExplanation: "Fog, heavy rain, wind, and storms affect flights and hill roads.",
      };
    },
  },
  {
    id: "packing-suggestions",
    personas: ["traveller"],
    compute({ snapshot }) {
      const items: string[] = [];
      const tMax = snapshot.daily[0]?.tempMaxC ?? snapshot.current.temperatureC;
      const tMin = snapshot.daily[0]?.tempMinC ?? snapshot.current.temperatureC;
      if (tMax > 30) items.push("light clothes", "sunscreen");
      if (tMin < 12) items.push("warm layer");
      if (isRainCode(snapshot.current.weatherCode) || dailyRainSum(snapshot, 3) > 10) {
        items.push("rain jacket", "umbrella");
      }
      if (items.length === 0) items.push("usual essentials");
      return {
        type: "packing",
        personas: ["traveller"],
        title: "Packing",
        headline: `Consider: ${items.join(", ")}.`,
        severity: "info",
        baseScore: 52,
        data: { items },
        whyExplanation: "Packing hints from this location's temperature and rain outlook.",
      };
    },
  },
  {
    id: "cyclone-flood",
    personas: ["traveller"],
    compute({ snapshot }) {
      const heavyWeek = dailyRainSum(snapshot, 7);
      const cycloneAlert = snapshot.alerts.some(
        (a) =>
          a.title.toLowerCase().includes("cyclone") ||
          a.description.toLowerCase().includes("cyclone"),
      );
      if (!cycloneAlert && heavyWeek < 60) return null;
      return {
        type: "cyclone_flood",
        personas: ["traveller"],
        title: "Cyclone / flood watch",
        headline: cycloneAlert
          ? "Official cyclone-related alert active — reconsider travel."
          : `${fmtNum(round1(heavyWeek))} mm rain this week — flash flood risk in low areas.`,
        severity: "severe",
        baseScore: 90,
        pinTop: cycloneAlert,
        whyExplanation: "Surfaces IMD-style alerts and extreme weekly rainfall totals.",
      };
    },
  },
];
