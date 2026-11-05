import type { PersonaId, WeatherAlert } from "../../schemas/weather.js";
import type { InsightModule } from "../types.js";

const ALL_PERSONAS: PersonaId[] = ["general", "runner", "farmer", "parent", "traveller"];

function alertCard(alert: WeatherAlert): NonNullable<ReturnType<InsightModule["compute"]>> {
  return {
    type: "active_alert",
    personas: ALL_PERSONAS,
    title: alert.title,
    headline: alert.description.slice(0, 120),
    severity: alert.severity === "info" ? "warning" : alert.severity,
    baseScore: 100,
    pinTop: true,
    data: { alertId: alert.id, source: alert.source, areas: alert.areas },
    actionHint: alert.recommendedActions[0],
    whyExplanation: `Active ${alert.source.toUpperCase()} warning for your area until ${new Date(alert.effectiveTo).toLocaleString("en-IN")}.`,
    validUntil: alert.effectiveTo,
  };
}

export const alertInsights: InsightModule[] = [
  {
    id: "active-alerts",
    personas: ALL_PERSONAS,
    compute({ snapshot }) {
      const first = snapshot.alerts[0];
      if (!first) return null;
      return alertCard(first);
    },
  },
];

export function buildAlertModules(alerts: WeatherAlert[]): InsightModule[] {
  if (alerts.length <= 1) return [];
  return alerts.slice(1).map((alert, idx) => ({
    id: `active-alert-${String(idx + 1)}`,
    personas: ALL_PERSONAS,
    compute: () => alertCard(alert),
  }));
}
