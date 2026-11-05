# Mausam — architecture decisions

## Monorepo & tooling

- **pnpm workspaces** with `apps/mobile`, `apps/api`, `packages/shared`.
- **Expo SDK 58** (latest at scaffold time) with **Expo Router**, typed routes, and New Architecture enabled.
- **Plus Jakarta Sans** via `@expo-google-fonts/plus-jakarta-sans` (Inter alternative per spec).
- **Strict TypeScript** everywhere; `@typescript-eslint/strictTypeChecked` at repo root.
- **Shared package** builds to `dist/` for Node (API/tests); mobile resolves **source** via TS paths + Metro `watchFolders` for fast iteration.

## Product & data (upcoming phases)

- **Default weather provider:** Open-Meteo (no API key). **IMD adapter** stubbed in Phase 2; mock provider for demos/tests.
- **Alerts:** mock/adapter-flagged until IMD credentials are wired.
- **Auth:** anonymous **device ID** profile sync only (no login in MVP).
- **Engine location:** implemented in `packages/shared` (Phase 3) so the same logic runs on API and optionally on-device offline.

## UX

- **System light/dark** via `userInterfaceStyle: automatic` and `ThemeProvider`.
- **Weather-adaptive gradients** apply to the **hero region only**, not full-screen washes.
- **Severity** always uses colour + text/icon (tokens in `src/theme/colors.ts`).

## Assumptions

- API default port **3001** to avoid clashing with Expo web (8081) and common 3000 dev servers.
- **SQLite + Prisma** introduced in Phase 2 with profile persistence; Phase 1 API is health-only bootstrap.
- **Redis** optional; in-memory cache fallback in Phase 2.
