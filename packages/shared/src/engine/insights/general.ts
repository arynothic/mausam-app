import type { EngineContext, InsightModule } from "../types.js";
import { fmtTemp, greetingForHour } from "../utils.js";

export const generalInsights: InsightModule[] = [
  {
    id: "current-summary",
    personas: ["general"],
    compute({ snapshot }) {
      const c = snapshot.current;
      const fl = c.feelsLikeC;
      return {
        type: "current_summary",
        personas: ["general"],
        title: "Right now",
        headline: fl !== undefined
          ? `${c.conditionText}, ${fmtTemp(c.temperatureC)}°C (feels ${fmtTemp(fl)}°).`
          : `${c.conditionText}, ${fmtTemp(c.temperatureC)}°C.`,
        severity: "info",
        baseScore: 55,
        data: { weatherCode: c.weatherCode, temperatureC: c.temperatureC },
        whyExplanation:
          "General view shows current conditions for your saved location.",
      };
    },
  },
  {
    id: "hourly-strip",
    personas: ["general"],
    compute({ snapshot }) {
      return {
        type: "hourly_strip",
        personas: ["general"],
        title: "Next 48 hours",
        headline: "Hourly trend available — tap for charts.",
        severity: "info",
        baseScore: 45,
        data: { hours: snapshot.hourly.slice(0, 48).map((h) => h.time) },
        whyExplanation: "Standard hourly forecast for planning the rest of today and tomorrow.",
      };
    },
  },
  {
    id: "weekly-outlook",
    personas: ["general"],
    compute({ snapshot }) {
      const d0 = snapshot.daily[0];
      const d6 = snapshot.daily[6];
      if (!d0 || !d6) return null;
      return {
        type: "weekly_outlook",
        personas: ["general"],
        title: "7-day outlook",
        headline: `Today up to ${fmtTemp(d0.tempMaxC)} · day 7 between ${fmtTemp(d6.tempMinC)}–${fmtTemp(d6.tempMaxC)}°.`,
        severity: "info",
        baseScore: 42,
        data: { daily: snapshot.daily.slice(0, 7) },
        whyExplanation: "Seven-day min/max helps you plan the week at a glance.",
      };
    },
  },
];

export function heroForPersona(ctx: EngineContext, topHeadline?: string): string {
  const hour = ctx.now.getHours();
  const greet = greetingForHour(hour);
  switch (ctx.activePersona) {
    case "runner":
      return topHeadline ?? `${greet} — check run suitability before you head out.`;
    case "farmer":
      return topHeadline ?? `${greet} — field weather and rain outlook for your crops.`;
    case "parent":
      return topHeadline ?? `${greet} — school and play weather for your kids.`;
    case "traveller":
      return topHeadline ?? `${greet} — travel disruption and packing tips.`;
    default:
      return topHeadline ?? `${greet} — ${ctx.snapshot.current.conditionText.toLowerCase()} in ${ctx.snapshot.location.name}.`;
  }
}
