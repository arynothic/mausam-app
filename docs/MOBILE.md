# Mobile UI (`@mausam/mobile`)

Expo Router app with design tokens in `src/theme` and components in `src/components/ui`.

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
