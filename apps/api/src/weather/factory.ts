import type { Env } from "../config/env.js";
import { ImdWeatherProvider, MockWeatherProvider } from "./mock.js";
import { OpenMeteoWeatherProvider } from "./open-meteo.js";
import type { WeatherProvider, WeatherProviderOptions } from "./types.js";

export function createWeatherProvider(
  env: Pick<Env, "WEATHER_PROVIDER">,
  options?: WeatherProviderOptions,
): WeatherProvider {
  switch (env.WEATHER_PROVIDER) {
    case "mock":
      return new MockWeatherProvider();
    case "imd":
      return new ImdWeatherProvider(options);
    case "openmeteo":
    default:
      return new OpenMeteoWeatherProvider(options);
  }
}
