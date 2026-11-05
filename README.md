# Mausam (IMD)

Personalised weather homepage for India — Problem Statement **26076**. Different personas (runner, farmer, parent, traveller, general) see ranked insight cards on the home feed.

## Monorepo layout

```
apps/mobile     React Native (Expo Router) client
apps/api        Fastify REST API (/v1 in later phases)
packages/shared Zod schemas, personas, personalisation engine (Phase 3+)
```

## Prerequisites

- Node.js **20+**
- pnpm **9+** (`npm install -g pnpm`)

## Setup

```bash
pnpm install
pnpm build   # builds @mausam/shared
```

## Development

```bash
pnpm dev          # API + Expo in parallel
pnpm dev:api      # http://localhost:3001/health
pnpm dev:mobile   # Expo dev server
```

Copy env for the API:

```bash
cp apps/api/.env.example apps/api/.env
```

## Quality

```bash
pnpm typecheck
pnpm lint
pnpm test
```

## Phase status

| Phase | Scope |
| ----- | ----- |
| **1** | Monorepo, shared schemas/personas, theme tokens, lint/CI |
| 2 | Weather providers, normalisation, core `/v1` routes |
| 3 | Personalisation engine + `/feed` |
| 4 | UI component library + `/dev/gallery` |
| 5–7 | Screens, offline/i18n/notifications, README demo script |

See [DECISIONS.md](./DECISIONS.md) for defaults and assumptions.

## Architecture (target)

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
