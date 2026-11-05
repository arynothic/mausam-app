import type { PersonaId } from "../schemas/weather.js";

export interface PersonaDefinition {
  id: PersonaId;
  /** i18n key under personas.* */
  labelKey: string;
  descriptionKey: string;
  /** Default weight when user selects this persona (0–1) */
  defaultWeight: number;
  /** Insight module IDs associated with this persona (filled in Phase 3) */
  insightModuleIds: string[];
  /** Optional emoji for onboarding cards (replaced by illustrations later) */
  emoji: string;
}

export const PERSONA_DEFINITIONS: readonly PersonaDefinition[] = [
  {
    id: "general",
    labelKey: "personas.general.label",
    descriptionKey: "personas.general.description",
    defaultWeight: 1,
    insightModuleIds: ["current-summary", "hourly-strip", "weekly-outlook", "active-alerts"],
    emoji: "🌤️",
  },
  {
    id: "runner",
    labelKey: "personas.runner.label",
    descriptionKey: "personas.runner.description",
    defaultWeight: 1,
    insightModuleIds: [
      "run-suitability",
      "best-run-window",
      "feels-like",
      "aqi-run",
      "uv-run",
      "rain-free-windows",
    ],
    emoji: "🏃",
  },
  {
    id: "farmer",
    labelKey: "personas.farmer.label",
    descriptionKey: "personas.farmer.description",
    defaultWeight: 1,
    insightModuleIds: [
      "rainfall-outlook",
      "spray-suitability",
      "frost-heat-stress",
      "crop-advisory",
      "soil-moisture-proxy",
    ],
    emoji: "🌾",
  },
  {
    id: "parent",
    labelKey: "personas.parent.label",
    descriptionKey: "personas.parent.description",
    defaultWeight: 1,
    insightModuleIds: [
      "school-commute",
      "what-to-wear",
      "outdoor-play",
      "aqi-kids",
      "storm-alerts-parent",
    ],
    emoji: "👨‍👩‍👧",
  },
  {
    id: "traveller",
    labelKey: "personas.traveller.label",
    descriptionKey: "personas.traveller.description",
    defaultWeight: 1,
    insightModuleIds: [
      "route-weather",
      "disruption-risk",
      "packing-suggestions",
      "cyclone-flood",
    ],
    emoji: "✈️",
  },
] as const;

export const PERSONA_BY_ID: Record<PersonaId, PersonaDefinition> = Object.fromEntries(
  PERSONA_DEFINITIONS.map((p) => [p.id, p]),
) as Record<PersonaId, PersonaDefinition>;

export const DEFAULT_PERSONA: PersonaId = "general";

export function isPersonaId(value: string): value is PersonaId {
  return PERSONA_DEFINITIONS.some((p) => p.id === value);
}
