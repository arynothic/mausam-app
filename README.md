# Mausam (IMD)

Personalised weather homepage for India — Problem Statement **26076**. Different personas (runner, farmer, parent, traveller, general) see ranked insight cards on the home feed.

## Monorepo layout

```
apps/mobile     React Native (Expo Router) client
apps/api        Fastify REST API (/v1)
packages/shared Zod schemas, personas, location seeds, engine (Phase 3+)
docs/           Architecture and API reference (kept in sync each phase)
```

## Prerequisites

- Node.js **20+**
- pnpm **9+** (`npm install -g pnpm`)

## Setup

```bash
pnpm install
pnpm build   # builds @mausam/shared
cp apps/api/.env.example apps/api/.env
```

## Development

```bash
pnpm dev          # API + Expo in parallel
pnpm dev:api      # http://localhost:3001 — see /docs for OpenAPI UI
pnpm dev:mobile   # Expo dev server
```

### Try the API (Phase 2)

```bash
# Mock provider (offline, deterministic)
WEATHER_PROVIDER=mock pnpm dev:api

curl -s "http://localhost:3001/v1/locations/search?q=delhi" | head
curl -s "http://localhost:3001/v1/weather?lat=28.61&lon=77.21&name=Delhi" | head
```

Use `WEATHER_PROVIDER=openmeteo` in `.env` for live Open-Meteo forecasts (default).

## Quality

```bash
pnpm typecheck
pnpm lint
pnpm test
```

## Documentation

| Doc | Contents |
| --- | -------- |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Data flow, package roles, doc index |
| [docs/API.md](./docs/API.md) | REST v1 endpoints, errors, env vars |
| [DECISIONS.md](./DECISIONS.md) | Engineering and product defaults |

## Phase status

| Phase | Status | Scope |
| ----- | ------ | ----- |
| **1** | Done | Monorepo, shared schemas/personas, theme tokens, lint/CI |
| **2** | Done | Weather providers, cache, `/v1/weather`, `/v1/alerts`, `/v1/locations/search` |
| 3 | Next | Personalisation engine + `/feed` |
| 4 | Planned | UI component library + `/dev/gallery` |
| 5–7 | Planned | Screens, offline/i18n/notifications, demo script |

## Architecture

```mermaid
flowchart LR
  Mobile[Expo App] --> API[Fastify API]
  API --> Engine[Personalisation Engine]
  API --> Provider[WeatherProvider]
  Provider --> OpenMeteo[Open-Meteo]
  Provider --> IMD[IMD Adapter]
  Engine --> Shared[@mausam/shared]
  Mobile --> Shared
```
