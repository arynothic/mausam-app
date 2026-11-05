# Mausam — architecture decisions

## Monorepo & tooling

- **pnpm workspaces** with `apps/mobile`, `apps/api`, `packages/shared`.
- **Expo SDK 58** with **Expo Router**, typed routes, and New Architecture enabled.
- **Plus Jakarta Sans** via `@expo-google-fonts/plus-jakarta-sans` (Inter alternative per spec).
- **Strict TypeScript** everywhere; `@typescript-eslint/strictTypeChecked` at repo root.
- **Shared package** builds to `dist/` for Node (API/tests); mobile resolves **source** via TS paths + Metro `watchFolders` for fast iteration.
- **Docs** live under `docs/` and `README.md`; update them at the end of each delivery phase.

## Weather & alerts (Phase 2)

- **Default provider:** [`OpenMeteoWeatherProvider`](apps/api/src/weather/open-meteo.ts) — forecast + air-quality APIs, no API key.
- **`mock` provider:** deterministic snapshots for tests, CI, and offline demos; can emit a sample thunderstorm alert.
- **`imd` provider:** stub — returns normalised data with `provider: imd` and TODO for MOS/nowcast/CAP integration ([`ImdWeatherProvider`](apps/api/src/weather/mock.ts)).
- **Caching:** in-memory store keyed by `provider + 0.1° grid`; TTL **10 minutes** for full snapshots. `REDIS_URL` reserved; still uses memory until Redis client is added.
- **Geocoding:** merge ranked [`INDIA_SEED_LOCATIONS`](packages/shared/src/locations/india-seeds.ts) with Open-Meteo geocoding (`countryCode=IN`).
- **Alerts on `/v1/alerts`:** slice of snapshot; live IMD warnings pending adapter. Mock/demo alerts are clearly `source: mock` or stubbed `imd`.

## Product (upcoming)

- **Auth:** anonymous **device ID** profile sync (`GET/PUT /v1/profile/:deviceId`) — Phase 5 with Prisma + SQLite.
- **Engine location:** `packages/shared` — `buildHomeFeed()` used by API today; same package on mobile for offline (Phase 6).

## Personalisation (Phase 3)

- **Engine:** `packages/shared/src/engine/` — registry of insight modules, Zod-validated output.
- **Scoring:** persona lens × severity × time sensitivity; `pinTop` for active warnings.
- **Transparency:** every `InsightCard` includes `whyExplanation`.
- **Extending:** [docs/ENGINE.md](docs/ENGINE.md).

## UX

- **System light/dark** via `userInterfaceStyle: automatic` and `ThemeProvider`.
- **Weather-adaptive gradients** apply to the **hero region only**, not full-screen washes.
- **Severity** always uses colour + text/icon (tokens in `apps/mobile/src/theme/colors.ts`).

## Assumptions

- API default port **3001** to avoid clashing with Expo web (8081) and common 3000 dev servers.
- OpenAPI UI at **`/docs`** for manual exploration during development.
- Rate limit defaults: **120 req / minute / IP** (configurable via env).
