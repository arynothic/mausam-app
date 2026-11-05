import type { NamedLocation, WeatherSnapshot } from "@mausam/shared";

export interface WeatherProvider {
  readonly id: WeatherSnapshot["provider"];
  fetchSnapshot(location: NamedLocation): Promise<WeatherSnapshot>;
}

export interface WeatherProviderOptions {
  fetchImpl?: typeof fetch;
}
