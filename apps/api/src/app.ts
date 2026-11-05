import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { loadEnv, type Env } from "./config/env.js";
import { createCacheStore } from "./lib/cache.js";
import { LocationSearchService } from "./geocoding/locations.js";
import { registerHealthRoutes } from "./routes/health.js";
import { registerErrorHandler, registerV1Routes } from "./routes/v1.js";
import { createWeatherProvider } from "./weather/factory.js";
import { CachedWeatherService } from "./weather/service.js";
import type { WeatherProviderOptions } from "./weather/types.js";

export interface BuildAppOptions {
  env?: Env;
  providerOptions?: WeatherProviderOptions;
}

export async function buildApp(options: BuildAppOptions = {}) {
  const env = options.env ?? loadEnv();
  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
    },
  });

  await app.register(cors, { origin: true });
  await app.register(rateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW_MS,
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: "Mausam API",
        description: "Personalised weather API for Mausam (IMD prototype)",
        version: "0.1.0",
      },
      tags: [
        { name: "system", description: "Health and meta" },
        { name: "weather", description: "Forecasts and alerts" },
        { name: "locations", description: "Geocoding" },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
  });

  const cache = createCacheStore(env.REDIS_URL);
  const provider = createWeatherProvider(env, options.providerOptions);
  const weather = new CachedWeatherService(provider, cache);
  const locations = new LocationSearchService(options.providerOptions);

  registerErrorHandler(app);
  registerHealthRoutes(app);
  registerV1Routes(app, { weather, locations });

  return { app, env, provider };
}
