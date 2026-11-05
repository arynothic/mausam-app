# Personalisation engine

Pure TypeScript in `@mausam/shared` — usable from the API (`POST /v1/feed`) and on-device later for offline feeds.

## Entry point

```typescript
import { buildHomeFeed } from "@mausam/shared";

const feed = buildHomeFeed(weatherSnapshot, userProfile, {
  now: new Date(),
  location: optionalOverride,
});
```

Returns `HomeFeed`: `heroSummary`, ordered `cards[]`, each with `whyExplanation`.

## Insight modules

Each module implements:

```typescript
interface InsightModule {
  id: string;
  personas: PersonaId[];
  compute(ctx: EngineContext): InsightCardDraft | null;
}
```

Register in [`insights/registry.ts`](../packages/shared/src/engine/insights/registry.ts) (or export from a persona file and spread into `CORE`).

Scoring (see [`types.ts`](../packages/shared/src/engine/types.ts)):

- **Persona weight** — active persona = 1.0, other selected personas = 0.65, else 0.25
- **Severity boost** — severe/warning/caution/good/info multipliers
- **Time sensitivity** — higher score when `validUntil` is within a few hours
- **`pinTop`** — IMD/active alerts always sort first with score 100

User **hidden / pinned / order** lists on `profile.cardVisibility` are applied after scoring.

## Add a new persona

1. Extend `PersonaIdSchema` and `PERSONA_DEFINITIONS` in [`personas/index.ts`](../packages/shared/src/personas/index.ts).
2. Add insight modules tagged with the new persona id.
3. Extend `heroForPersona()` in [`insights/general.ts`](../packages/shared/src/engine/insights/general.ts).
4. Add fixture coverage in [`tests/engine.test.ts`](../packages/shared/tests/engine.test.ts).

## Add a new insight

1. Create or extend a file under [`engine/insights/`](../packages/shared/src/engine/insights/).
2. Add the module id to the persona’s `insightModuleIds` in `PERSONA_DEFINITIONS` (documentation for product).
3. Register in `registry.ts`.
4. Unit test with [`tests/fixtures/weather-fixture.ts`](../packages/shared/tests/fixtures/weather-fixture.ts).

## Demo script

Same weather, four personas:

```bash
pnpm demo:feed
```
