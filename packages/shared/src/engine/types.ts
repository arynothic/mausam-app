import type { PersonaId, Severity, UserProfile, WeatherSnapshot } from "../schemas/weather.js";

export interface EngineContext {
  snapshot: WeatherSnapshot;
  profile: UserProfile;
  now: Date;
  /** Persona lens for ranking copy (defaults to profile.activePersona). */
  activePersona: PersonaId;
}

export interface InsightModule {
  id: string;
  personas: PersonaId[];
  compute(ctx: EngineContext): InsightCardDraft | null;
}

/** Before final scoring and id normalisation. */
export interface InsightCardDraft {
  type: string;
  personas: PersonaId[];
  title: string;
  headline: string;
  severity: Severity;
  /** Base relevance before persona/severity/time multipliers (0–100). */
  baseScore: number;
  data?: Record<string, unknown>;
  actionHint?: string;
  whyExplanation: string;
  validUntil?: string;
  /** When true, sort above all non-alert cards. */
  pinTop?: boolean;
}

export interface ScoringOptions {
  activePersona: PersonaId;
  userPersonas: PersonaId[];
  now: Date;
}

const SEVERITY_BOOST: Record<Severity, number> = {
  severe: 1,
  warning: 0.88,
  caution: 0.72,
  good: 0.55,
  info: 0.45,
};

export function personaWeight(
  modulePersonas: PersonaId[],
  active: PersonaId,
  selected: PersonaId[],
): number {
  if (modulePersonas.includes(active)) return 1;
  if (modulePersonas.some((p) => selected.includes(p))) return 0.65;
  return 0.25;
}

export function timeSensitivity(validUntil: string | undefined, now: Date): number {
  if (!validUntil) return 1;
  const ms = new Date(validUntil).getTime() - now.getTime();
  if (ms <= 0) return 0.5;
  const hours = ms / 3_600_000;
  if (hours <= 3) return 1.25;
  if (hours <= 24) return 1.1;
  return 1;
}

export function finalizeScore(draft: InsightCardDraft, options: ScoringOptions): number {
  if (draft.pinTop) return 100;
  const pw = personaWeight(draft.personas, options.activePersona, options.userPersonas);
  const sb = SEVERITY_BOOST[draft.severity];
  const ts = timeSensitivity(draft.validUntil, options.now);
  const raw = draft.baseScore * pw * sb * ts;
  return Math.min(100, Math.max(0, Math.round(raw)));
}
