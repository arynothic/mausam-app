import type { FastifyInstance } from "fastify";
import {
  AlertsQuerySchema,
  FeedRequestSchema,
  LocationSearchQuerySchema,
  WeatherQuerySchema,
  buildHomeFeed,
} from "@mausam/shared";
import { AppError, sendError, upstreamError, validationError } from "../lib/errors.js";
import type { LocationSearchService } from "../geocoding/locations.js";
import type { CachedWeatherService } from "../weather/service.js";
import { locationFromQuery } from "../weather/service.js";

export interface V1RouteDeps {
  weather: CachedWeatherService;
  locations: LocationSearchService;
}

export function registerV1Routes(
  app: FastifyInstance,
  deps: V1RouteDeps,
): void {
  app.get(
    "/v1/weather",
    {
      schema: {
        tags: ["weather"],
        querystring: {
          type: "object",
          required: ["lat", "lon"],
          properties: {
            lat: { type: "number" },
            lon: { type: "number" },
            name: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      const parsed = WeatherQuerySchema.safeParse(request.query);
      if (!parsed.success) {
        return sendError(reply, validationError("Invalid query", parsed.error.flatten()));
      }
      const location = locationFromQuery(parsed.data.lat, parsed.data.lon, parsed.data.name);
      try {
        const snapshot = await deps.weather.getSnapshot(location);
        return snapshot;
      } catch (err) {
        request.log.error({ err }, "weather fetch failed");
        return sendError(
          reply,
          upstreamError("Unable to fetch weather", err instanceof Error ? err.message : err),
        );
      }
    },
  );

  app.get(
    "/v1/alerts",
    {
      schema: {
        tags: ["weather"],
        querystring: {
          type: "object",
          required: ["lat", "lon"],
          properties: {
            lat: { type: "number" },
            lon: { type: "number" },
            name: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      const parsed = AlertsQuerySchema.safeParse(request.query);
      if (!parsed.success) {
        return sendError(reply, validationError("Invalid query", parsed.error.flatten()));
      }
      const location = locationFromQuery(parsed.data.lat, parsed.data.lon, parsed.data.name);
      try {
        const snapshot = await deps.weather.getSnapshot(location);
        return {
          fetchedAt: snapshot.fetchedAt,
          provider: snapshot.provider,
          location: snapshot.location,
          alerts: snapshot.alerts,
        };
      } catch (err) {
        request.log.error({ err }, "alerts fetch failed");
        return sendError(
          reply,
          upstreamError("Unable to fetch alerts", err instanceof Error ? err.message : err),
        );
      }
    },
  );

  app.get(
    "/v1/locations/search",
    {
      schema: {
        tags: ["locations"],
        querystring: {
          type: "object",
          required: ["q"],
          properties: {
            q: { type: "string" },
            limit: { type: "number" },
          },
        },
      },
    },
    async (request, reply) => {
      const parsed = LocationSearchQuerySchema.safeParse(request.query);
      if (!parsed.success) {
        return sendError(reply, validationError("Invalid query", parsed.error.flatten()));
      }
      const locations = await deps.locations.search(parsed.data.q, parsed.data.limit);
      return { locations };
    },
  );

  app.post(
    "/v1/feed",
    {
      schema: {
        tags: ["feed"],
        body: {
          type: "object",
          required: ["profile"],
          properties: {
            profile: { type: "object" },
            location: { type: "object" },
          },
        },
      },
    },
    async (request, reply) => {
      const parsed = FeedRequestSchema.safeParse(request.body);
      if (!parsed.success) {
        return sendError(reply, validationError("Invalid body", parsed.error.flatten()));
      }
      const { profile, location: locOverride } = parsed.data;
      const loc =
        locOverride ??
        profile.locations.find((l) => l.id === profile.primaryLocationId) ??
        profile.locations[0];
      if (!loc) {
        return sendError(reply, validationError("Profile has no locations"));
      }
      try {
        const snapshot = await deps.weather.getSnapshot(loc);
        const feed = buildHomeFeed(snapshot, profile, { location: locOverride });
        return feed;
      } catch (err) {
        request.log.error({ err }, "feed generation failed");
        return sendError(
          reply,
          upstreamError("Unable to build feed", err instanceof Error ? err.message : err),
        );
      }
    },
  );
}

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      return sendError(reply, error);
    }
    request.log.error(error);
    return reply.status(500).send({
      error: {
        code: "INTERNAL_ERROR",
        message: "Unexpected server error",
      },
    });
  });
}
