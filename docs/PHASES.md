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

## Phase 3 — Personalisation engine (next)

- Insight module registry in `@mausam/shared`
- Vitest fixtures
- `POST /v1/feed`

## Phases 4–7

See README roadmap (UI library, screens, offline/i18n, demo script).
