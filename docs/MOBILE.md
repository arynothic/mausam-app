# Mobile UI (`@mausam/mobile`)

Expo **SDK 58** · Expo Router app with design tokens in `src/theme` and components in `src/components/ui`.

## Monorepo (`@mausam/shared`)

- Import `@mausam/shared` from the workspace package (built `dist/`). Run `pnpm --filter @mausam/shared build` after shared changes (also runs on `pnpm install` via `prepare`).
- **Do not** add `tsconfig` `paths` that point `@mausam/shared` at `packages/shared/src` — Metro will bundle TypeScript source and break on `.js` import specifiers (web and native).
- Metro: `apps/mobile/metro.config.js` watches the repo root and maps `@mausam/shared` to the package directory (resolves via `package.json` → `dist/`).

## Web

```bash
cd apps/mobile && pnpm web
# http://localhost:8081 — gallery at /dev/gallery
```

Requires `react-native-web` (included). Use **`w`** in the Expo CLI or `pnpm web`.

## Run on a physical phone (Expo Go)

| Network | How to connect |
| -------- | ---------------- |
| **Same Wi‑Fi as your PC** | `cd apps/mobile && pnpm start` — scan QR or open the `exp://<LAN-IP>:8081` URL. |
| **Mobile data only** (not on home Wi‑Fi) | LAN URLs **will not work**. From `apps/mobile`: `pnpm start:tunnel` (uses ngrok; `@expo/ngrok` is a dev dependency). Scan the QR or open the `exp://…` link Expo prints. Alternatively `npx expo login` then `pnpm exec expo start --tunnel`. |

If Expo Go spins forever on a loader, reload after Metro finishes (`r` in the terminal). The app no longer waits on custom fonts before showing UI.

## Preview components

```bash
pnpm dev:mobile
# Open /dev/gallery in Expo Router (or tap “UI gallery” on the home placeholder)
```

Route: **`/dev/gallery`** — live previews of buttons, cards, insight cards, weather widgets, empty/error states, and the “Why am I seeing this?” sheet.

## Component map

| Component | Purpose |
| --------- | ------- |
| `Screen` | Safe area + optional scroll |
| `ThemedText` / `ScreenTitle` | Typography scale |
| `Card` | Elevated surface |
| `Pill` / `Chip` | Filters and persona chips |
| `Button` / `IconButton` | Actions (haptics on press) |
| `SegmentedControl` | Units / toggles |
| `Sheet` | Bottom sheet (Modal) for “Why?” |
| `Skeleton` | Loading placeholders |
| `EmptyState` / `ErrorState` | Zero-data and failure |
| `Badge` / `AlertBanner` | Severity with icon + text |
| `ListRow` | Settings-style rows |
| `Toggle` | Switch control |
| `Gauge` | Arc meter (UV, AQI, run score) |
| `Sparkline` / `HourlyStrip` / `DayRow` | Forecast visuals |
| `InsightCard` | Personalised feed card + why affordance |
| `PersonaSwitcher` | Horizontal persona lens |

Import from `@/components/ui` (barrel).

## Accessibility

- Minimum **44pt** touch targets (`minTouchTarget` token)
- Severity never relies on colour alone (`getSeverityStyles` + icons)
- Insight cards expose combined accessibility labels

Component previews live in **`/dev/gallery`**. Automated RN component tests (Testing Library) are planned with the main screens in Phase 5.
