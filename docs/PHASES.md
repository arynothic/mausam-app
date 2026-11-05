# Delivery phases

Living log — update at the end of each phase (see [README](../README.md)).

## Phase 1 — Monorepo scaffold ✅

- pnpm workspaces: `apps/mobile`, `apps/api`, `packages/shared`
- Shared Zod schemas + persona definitions
- Mobile theme tokens + Expo Router shell
- ESLint, Prettier, GitHub Actions CI

## Phase 2 — Weather API ✅

- `WeatherProvider` interface + Open-Meteo, Mock, IMD stub
- In-memory cache (10 min / grid cell)
- Routes: `/v1/weather`, `/v1/alerts`, `/v1/locations/search`
- OpenAPI at `/docs`
- Docs: [API.md](./API.md), [ARCHITECTURE.md](./ARCHITECTURE.md)

## Phase 3 — Personalisation engine ✅

- Insight module registry + scoring in `@mausam/shared`
- Vitest fixtures + engine tests
- `POST /v1/feed`
- `pnpm demo:feed` — runner / farmer / parent / traveller comparison
- [ENGINE.md](./ENGINE.md)

## Phase 4 — UI component library ✅

- Reusable components under `apps/mobile/src/components/ui`
- `/dev/gallery` preview screen
- [MOBILE.md](./MOBILE.md)

## Phase 5 — App screens (next)

- Onboarding → Home → Detail → Alerts → Locations → Settings

## Phases 6–7

Offline/i18n/notifications, polish.
