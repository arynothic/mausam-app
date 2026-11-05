# Mausam API (REST v1)

Base URL (local): `http://localhost:3001`

Interactive OpenAPI UI: [`/docs`](http://localhost:3001/docs)

## Authentication

None for MVP (anonymous device profiles arrive in a later phase).

## Error envelope

All error responses use:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable summary",
    "details": {}
  }
}
```

Common codes: `VALIDATION_ERROR` (400), `NOT_FOUND` (404), `UPSTREAM_ERROR` (502), `INTERNAL_ERROR` (500).

## Endpoints

### `GET /health`

Liveness probe.

### `GET /v1/weather`

Normalised [`WeatherSnapshot`](../packages/shared/src/schemas/weather.ts) for a point.

| Query | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| `lat` | number | yes | WGS84 latitude |
| `lon` | number | yes | WGS84 longitude |
| `name` | string | no | Display label for the location |

**Provider:** controlled by `WEATHER_PROVIDER` (`openmeteo` default, `mock`, `imd` stub).

**Cache:** ~10 minutes per ~0.1° grid cell (in-memory; Redis optional later).

Example:

```bash
curl "http://localhost:3001/v1/weather?lat=28.6139&lon=77.2090&name=New%20Delhi"
```

### `GET /v1/alerts`

Active warnings for the same point (subset of snapshot).

```bash
curl "http://localhost:3001/v1/alerts?lat=28.6139&lon=77.2090"
```

With `WEATHER_PROVIDER=mock`, some coordinates return a **demo** thunderstorm alert (`source: mock`). Live IMD CAP feeds will map here when the adapter is completed.

### `GET /v1/locations/search`

Geocoding with **Indian cities ranked first** via seed list + Open-Meteo geocoding (`countryCode=IN`).

| Query | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| `q` | string | — | City, district, or village name |
| `limit` | number | 8 | Max results (1–20) |

```bash
curl "http://localhost:3001/v1/locations/search?q=amritsar&limit=5"
```

### `POST /v1/feed`

Runs the **personalisation engine** and returns a [`HomeFeed`](../packages/shared/src/schemas/weather.ts).

**Body** (`FeedRequest`): `{ "profile": UserProfile, "location"?: NamedLocation }`

Weather is loaded for the profile’s primary location unless `location` overrides it. Cards are scored for `profile.activePersona`; active warnings pin to the top.

```bash
curl -s -X POST http://localhost:3001/v1/feed \
  -H 'content-type: application/json' \
  -d '{"profile":{"deviceId":"x","personas":["runner"],"activePersona":"runner","locations":[{"id":"1","name":"Delhi","country":"IN","point":{"lat":28.61,"lon":77.21}}],"primaryLocationId":"1","units":{},"sensitivities":{},"language":"en","cardVisibility":{"hiddenCardIds":[],"pinnedCardIds":[]}}}'
```

Every card includes `whyExplanation` for the “Why am I seeing this?” affordance.

## Personalisation engine

Code: [`packages/shared/src/engine/`](../packages/shared/src/engine/) — see [ENGINE.md](./ENGINE.md).

## Environment

See [`apps/api/.env.example`](../apps/api/.env.example).

| Variable | Default | Purpose |
| -------- | ------- | ------- |
| `WEATHER_PROVIDER` | `openmeteo` | `openmeteo` · `mock` · `imd` (stub) |
| `RATE_LIMIT_MAX` | `120` | Requests per window per IP |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Rate limit window |
| `REDIS_URL` | — | Optional cache (falls back to memory) |
| `LOG_LEVEL` | `info` | Pino log level |

## Adding a weather provider

1. Implement `WeatherProvider` in `apps/api/src/weather/`.
2. Map upstream fields to `WeatherSnapshotSchema` (Zod parse before return).
3. Register in `createWeatherProvider()` (`factory.ts`).
4. Document credentials in `.env.example` and [DECISIONS.md](../DECISIONS.md).
