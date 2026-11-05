import { describe, expect, it, beforeAll, afterAll } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app.js";

describe("v1 weather API", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    const built = await buildApp({
      env: {
        NODE_ENV: "test",
        PORT: 0,
        HOST: "127.0.0.1",
        WEATHER_PROVIDER: "mock",
        RATE_LIMIT_MAX: 1000,
        RATE_LIMIT_WINDOW_MS: 60_000,
        LOG_LEVEL: "silent",
      },
    });
    app = built.app;
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /health", async () => {
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ ok: true });
  });

  it("GET /v1/weather returns normalised snapshot (mock)", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/weather?lat=28.61&lon=77.21&name=Delhi",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as { provider: string; location: { name: string } };
    expect(body.provider).toBe("mock");
    expect(body.location.name).toBe("Delhi");
  });

  it("GET /v1/alerts returns alert list", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/alerts?lat=12.97&lon=77.59",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as { alerts: unknown[] };
    expect(Array.isArray(body.alerts)).toBe(true);
  });

  it("GET /v1/locations/search prioritises India seeds", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/locations/search?q=delhi",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as { locations: { name: string }[] };
    expect(body.locations[0]?.name).toMatch(/Delhi/i);
  });

  it("returns validation envelope on bad query", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/v1/weather?lat=999&lon=0",
    });
    expect(res.statusCode).toBe(400);
    const body = res.json() as { error: { code: string } };
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("POST /v1/feed returns personalised cards", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/v1/feed",
      payload: {
        profile: {
          deviceId: "demo",
          personas: ["runner"],
          activePersona: "runner",
          locations: [
            {
              id: "loc",
              name: "Test",
              country: "IN",
              point: { lat: 28.61, lon: 77.21 },
            },
          ],
          primaryLocationId: "loc",
          units: { temperature: "celsius", windSpeed: "kmh", precipitation: "mm" },
          sensitivities: { asthma: false, heatSensitive: false },
          language: "en",
          cardVisibility: { hiddenCardIds: [], pinnedCardIds: [] },
        },
      },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as { cards: { id: string }[]; heroSummary: string };
    expect(body.heroSummary.length).toBeGreaterThan(0);
    expect(body.cards.some((c) => c.id === "run-suitability")).toBe(true);
  });
});
