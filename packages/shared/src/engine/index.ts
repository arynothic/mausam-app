import {
  HomeFeedSchema,
  InsightCardSchema,
  type HomeFeed,
  type InsightCard,
  type NamedLocation,
  type UserProfile,
  type WeatherSnapshot,
} from "../schemas/weather.js";
import { getInsightRegistry } from "./insights/registry.js";
import { heroForPersona } from "./insights/general.js";
import { finalizeScore, type EngineContext } from "./types.js";

function resolveLocation(profile: UserProfile, override?: NamedLocation): NamedLocation {
  if (override) return override;
  const found = profile.locations.find((l) => l.id === profile.primaryLocationId);
  if (!found) {
    const fallback = profile.locations[0];
    if (!fallback) {
      throw new Error("UserProfile must include at least one location");
    }
    return fallback;
  }
  return found;
}

function applyVisibility(cards: InsightCard[], profile: UserProfile): InsightCard[] {
  const hidden = new Set(profile.cardVisibility.hiddenCardIds);
  let visible = cards.filter((c) => !hidden.has(c.id));

  const pinned = profile.cardVisibility.pinnedCardIds;
  if (pinned.length > 0) {
    const pinSet = new Set(pinned);
    const pinnedCards = pinned
      .map((id) => visible.find((c) => c.id === id))
      .filter((c): c is InsightCard => c !== undefined);
    const rest = visible.filter((c) => !pinSet.has(c.id));
    visible = [...pinnedCards, ...rest];
  }

  const order = profile.cardVisibility.cardOrder;
  if (order && order.length > 0) {
    const rank = new Map(order.map((id, i) => [id, i]));
    visible.sort((a, b) => {
      const ra = rank.get(a.id) ?? 999;
      const rb = rank.get(b.id) ?? 999;
      if (ra !== rb) return ra - rb;
      return b.score - a.score;
    });
  }

  return visible;
}

export function buildHomeFeed(
  snapshot: WeatherSnapshot,
  profile: UserProfile,
  options?: { now?: Date; location?: NamedLocation },
): HomeFeed {
  const now = options?.now ?? new Date();
  const activePersona = profile.activePersona;
  const ctx: EngineContext = {
    snapshot: { ...snapshot, location: resolveLocation(profile, options?.location) },
    profile,
    now,
    activePersona,
  };

  const userPersonas = profile.personas;

  const registry = getInsightRegistry(ctx.snapshot).filter((module) =>
    module.personas.some((p) => userPersonas.includes(p)),
  );

  const scored = registry
    .map((module) => {
      const draft = module.compute(ctx);
      if (!draft) return null;
      const score = finalizeScore(draft, {
        activePersona,
        userPersonas,
        now,
      });
      const card = InsightCardSchema.parse({
        id: module.id,
        type: draft.type,
        personas: draft.personas,
        title: draft.title,
        headline: draft.headline,
        severity: draft.severity,
        score,
        data: draft.data ?? {},
        actionHint: draft.actionHint,
        whyExplanation: draft.whyExplanation,
        validUntil: draft.validUntil,
      });
      return { card, pinTop: draft.pinTop === true };
    })
    .filter((x): x is { card: InsightCard; pinTop: boolean } => x !== null);

  scored.sort((a, b) => {
    if (a.pinTop !== b.pinTop) return a.pinTop ? -1 : 1;
    return b.card.score - a.card.score;
  });

  const cards = scored.map((s) => s.card);
  const filtered = applyVisibility(cards, profile);
  const top = filtered[0];
  const heroSummary = heroForPersona(ctx, top?.headline);

  return HomeFeedSchema.parse({
    generatedAt: now.toISOString(),
    activePersona,
    heroSummary,
    cards: filtered,
    snapshotFetchedAt: snapshot.fetchedAt,
  });
}

export type { EngineContext, InsightModule } from "./types.js";
