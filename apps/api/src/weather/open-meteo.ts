import {
  NamedLocationSchema,
  WeatherSnapshotSchema,
  type NamedLocation,
  type WeatherSnapshot,
} from "@mausam/shared";
import { locationIdFromPoint, wmoConditionText } from "./codes.js";
import type { WeatherProvider, WeatherProviderOptions } from "./types.js";

interface OpenMeteoForecastJson {
  current?: {
    time: string;
    temperature_2m: number;
    apparent_temperature?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    wind_direction_10m?: number;
    pressure_msl?: number;
    visibility?: number;
    cloud_cover?: number;
    precipitation?: number;
    weather_code: number;
    is_day: number;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature?: number[];
    relative_humidity_2m?: number[];
    wind_speed_10m?: number[];
    precipitation?: number[];
    precipitation_probability?: number[];
    weather_code: number[];
    uv_index?: number[];
    is_day?: number[];
  };
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise?: string[];
    sunset?: string[];
    precipitation_sum?: number[];
    precipitation_probability_max?: number[];
    weather_code: number[];
    uv_index_max?: number[];
    wind_speed_10m_max?: number[];
  };
}

interface OpenMeteoAirQualityJson {
  current?: {
    us_aqi?: number;
    pm2_5?: number;
    pm10?: number;
  };
}

function aqiCategory(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for sensitive groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very unhealthy";
  return "Hazardous";
}

export class OpenMeteoWeatherProvider implements WeatherProvider {
  readonly id = "openmeteo" as const;
  private readonly fetchImpl: typeof fetch;

  constructor(options?: WeatherProviderOptions) {
    this.fetchImpl = options?.fetchImpl ?? fetch;
  }

  async fetchSnapshot(location: NamedLocation): Promise<WeatherSnapshot> {
    const { lat, lon } = location.point;
    const forecastUrl = new URL("https://api.open-meteo.com/v1/forecast");
    forecastUrl.searchParams.set("latitude", String(lat));
    forecastUrl.searchParams.set("longitude", String(lon));
    forecastUrl.searchParams.set("timezone", "auto");
    forecastUrl.searchParams.set("forecast_days", "7");
    forecastUrl.searchParams.set("forecast_hours", "48");
    forecastUrl.searchParams.set(
      "current",
      [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "is_day",
        "precipitation",
        "weather_code",
        "cloud_cover",
        "pressure_msl",
        "wind_speed_10m",
        "wind_direction_10m",
      ].join(","),
    );
    forecastUrl.searchParams.set(
      "hourly",
      [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "precipitation",
        "precipitation_probability",
        "weather_code",
        "wind_speed_10m",
        "uv_index",
        "is_day",
      ].join(","),
    );
    forecastUrl.searchParams.set(
      "daily",
      [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "sunrise",
        "sunset",
        "precipitation_sum",
        "precipitation_probability_max",
        "uv_index_max",
        "wind_speed_10m_max",
      ].join(","),
    );

    const aqUrl = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
    aqUrl.searchParams.set("latitude", String(lat));
    aqUrl.searchParams.set("longitude", String(lon));
    aqUrl.searchParams.set("current", "us_aqi,pm2_5,pm10");

    const [forecastRes, aqRes] = await Promise.all([
      this.fetchImpl(forecastUrl),
      this.fetchImpl(aqUrl),
    ]);

    if (!forecastRes.ok) {
      throw new Error(`Open-Meteo forecast failed: ${String(forecastRes.status)}`);
    }

    const forecast = (await forecastRes.json()) as OpenMeteoForecastJson;
    const aqJson = aqRes.ok ? ((await aqRes.json()) as OpenMeteoAirQualityJson) : undefined;

    const current = forecast.current;
    if (!current) {
      throw new Error("Open-Meteo response missing current conditions");
    }

    const hourlyTimes = forecast.hourly?.time ?? [];
    const hourly = hourlyTimes.slice(0, 48).map((time, i) => ({
      time: new Date(time).toISOString(),
      temperatureC: forecast.hourly?.temperature_2m[i] ?? 0,
      feelsLikeC: forecast.hourly?.apparent_temperature?.[i],
      humidityPct: forecast.hourly?.relative_humidity_2m?.[i],
      windSpeedKmh: forecast.hourly?.wind_speed_10m?.[i],
      precipitationMm: forecast.hourly?.precipitation?.[i],
      precipitationProbabilityPct: forecast.hourly?.precipitation_probability?.[i],
      weatherCode: forecast.hourly?.weather_code[i] ?? 0,
      uvIndex: forecast.hourly?.uv_index?.[i],
      isDay: forecast.hourly?.is_day?.[i] === 1,
    }));

    const dailyTimes = forecast.daily?.time ?? [];
    const daily = dailyTimes.map((date, i) => ({
      date,
      tempMinC: forecast.daily?.temperature_2m_min[i] ?? 0,
      tempMaxC: forecast.daily?.temperature_2m_max[i] ?? 0,
      sunrise: forecast.daily?.sunrise?.[i]
        ? new Date(forecast.daily.sunrise[i]).toISOString()
        : undefined,
      sunset: forecast.daily?.sunset?.[i]
        ? new Date(forecast.daily.sunset[i]).toISOString()
        : undefined,
      precipitationSumMm: forecast.daily?.precipitation_sum?.[i],
      precipitationProbabilityMaxPct: forecast.daily?.precipitation_probability_max?.[i],
      weatherCode: forecast.daily?.weather_code[i] ?? 0,
      uvIndexMax: forecast.daily?.uv_index_max?.[i],
      windSpeedMaxKmh: forecast.daily?.wind_speed_10m_max?.[i],
    }));

    const usAqi = aqJson?.current?.us_aqi;
    const snap = WeatherSnapshotSchema.parse({
      fetchedAt: new Date().toISOString(),
      location: NamedLocationSchema.parse({
        ...location,
        id: location.id || locationIdFromPoint(lat, lon),
        country: location.country,
      }),
      provider: "openmeteo",
      current: {
        observedAt: new Date(current.time).toISOString(),
        temperatureC: current.temperature_2m,
        feelsLikeC: current.apparent_temperature,
        humidityPct: current.relative_humidity_2m,
        windSpeedKmh: current.wind_speed_10m,
        windDirectionDeg: current.wind_direction_10m,
        pressureHpa: current.pressure_msl,
        visibilityKm: current.visibility,
        cloudCoverPct: current.cloud_cover,
        precipitationMm: current.precipitation,
        weatherCode: current.weather_code,
        conditionText: wmoConditionText(current.weather_code),
        isDay: current.is_day === 1,
      },
      hourly,
      daily,
      airQuality:
        usAqi !== undefined
          ? {
              aqi: usAqi,
              pm25: aqJson?.current?.pm2_5,
              pm10: aqJson?.current?.pm10,
              category: aqiCategory(usAqi),
            }
          : undefined,
      uvIndexCurrent: hourly[0]?.uvIndex,
      alerts: [],
    });

    return snap;
  }
}
