import { describe, expect, it } from "vitest";
import {
  UserProfileSchema,
  WeatherSnapshotSchema,
  PERSONA_DEFINITIONS,
  PERSONA_BY_ID,
} from "../src/index.js";

describe("shared schemas", () => {
  it("parses a minimal weather snapshot", () => {
    const parsed = WeatherSnapshotSchema.parse({
      fetchedAt: new Date().toISOString(),
      location: {
        id: "delhi",
        name: "New Delhi",
        state: "Delhi",
        country: "IN",
        point: { lat: 28.6139, lon: 77.209 },
      },
      provider: "mock",
      current: {
        observedAt: new Date().toISOString(),
        temperatureC: 32,
        weatherCode: 0,
        conditionText: "Clear",
        isDay: true,
      },
      hourly: [],
      daily: [],
      alerts: [],
    });
    expect(parsed.provider).toBe("mock");
  });

  it("requires at least one persona on profile", () => {
    expect(() =>
      UserProfileSchema.parse({
        deviceId: "dev-1",
        personas: [],
        activePersona: "general",
        locations: [
          {
            id: "x",
            name: "X",
            country: "IN",
            point: { lat: 0, lon: 0 },
          },
        ],
        primaryLocationId: "x",
      }),
    ).toThrow();
  });
});

describe("personas", () => {
  it("defines five personas with unique ids", () => {
    const ids = PERSONA_DEFINITIONS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(PERSONA_BY_ID.runner.insightModuleIds.length).toBeGreaterThan(0);
  });
});
