import { alertInsights, buildAlertModules } from "./alerts.js";
import { generalInsights } from "./general.js";
import { runnerInsights } from "./runner.js";
import { farmerInsights } from "./farmer.js";
import { parentInsights } from "./parent.js";
import { travellerInsights } from "./traveller.js";
import type { InsightModule } from "../types.js";
import type { WeatherSnapshot } from "../../schemas/weather.js";

const CORE: InsightModule[] = [
  ...alertInsights,
  ...generalInsights,
  ...runnerInsights,
  ...farmerInsights,
  ...parentInsights,
  ...travellerInsights,
];

export function getInsightRegistry(snapshot: WeatherSnapshot): InsightModule[] {
  return [...CORE, ...buildAlertModules(snapshot.alerts)];
}

export const INSIGHT_REGISTRY: InsightModule[] = CORE;
