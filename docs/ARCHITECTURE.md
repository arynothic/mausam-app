# Architecture

## Data flow (Phase 3 — feed)

```mermaid
sequenceDiagram
  participant Client
  participant API as POST /v1/feed
  participant Weather as CachedWeatherService
  participant Engine as buildHomeFeed

  Client->>API: profile + optional location
  API->>Weather: getSnapshot
  Weather-->>API: WeatherSnapshot
  API->>Engine: snapshot + profile
  Engine-->>API: HomeFeed (ranked cards)
  API-->>Client: JSON
```

## Data flow (Phase 2 — weather)

```mermaid
sequenceDiagram
  participant Client
  participant API as Fastify /v1
  participant Cache
  participant Provider as WeatherProvider
  participant OM as Open-Meteo

  Client->>API: GET /v1/weather?lat&lon
  API->>Cache: lookup grid key
  alt cache hit
    Cache-->>API: WeatherSnapshot
  else cache miss
    API->>Provider: fetchSnapshot
    Provider->>OM: forecast + air quality
    OM-->>Provider: JSON
    Provider-->>API: WeatherSnapshot (Zod)
    API->>Cache: set TTL 10m
  end
  API-->>Client: JSON
```

## Packages

| Package | Role |
| ------- | ---- |
| `@mausam/shared` | Zod schemas, personas, location seeds, `buildHomeFeed` engine |
| `@mausam/api` | HTTP edge, provider adapters, cache, geocoding |
| `@mausam/mobile` | Expo client, theme, screens |

## Personalisation (Phase 3)

The engine in `@mausam/shared` registers insight modules `{ id, personas, compute }`, applies persona/severity/time scoring, pins active warnings, and validates output with Zod. See [ENGINE.md](./ENGINE.md).

## Documentation index

- [README](../README.md) — setup and phase roadmap
- [API.md](./API.md) — REST reference
- [ENGINE.md](./ENGINE.md) — insight modules and extensions
- [PHASES.md](./PHASES.md) — delivery log
- [DECISIONS.md](../DECISIONS.md) — product and engineering defaults
