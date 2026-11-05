import { z } from "zod";

export const SeveritySchema = z.enum([
  "info",
  "good",
  "caution",
  "warning",
  "severe",
]);
export type Severity = z.infer<typeof SeveritySchema>;

export const PersonaIdSchema = z.enum([
  "general",
  "runner",
  "farmer",
  "parent",
  "traveller",
]);
export type PersonaId = z.infer<typeof PersonaIdSchema>;

export const TemperatureUnitSchema = z.enum(["celsius", "fahrenheit"]);
export const SpeedUnitSchema = z.enum(["kmh", "mph"]);
export const PrecipUnitSchema = z.enum(["mm", "in"]);

export const UnitsSchema = z.object({
  temperature: TemperatureUnitSchema.default("celsius"),
  windSpeed: SpeedUnitSchema.default("kmh"),
  precipitation: PrecipUnitSchema.default("mm"),
});
export type Units = z.infer<typeof UnitsSchema>;

export const GeoPointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
});
export type GeoPoint = z.infer<typeof GeoPointSchema>;

export const NamedLocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  district: z.string().optional(),
  state: z.string().optional(),
  country: z.string().default("IN"),
  point: GeoPointSchema,
});
export type NamedLocation = z.infer<typeof NamedLocationSchema>;

export const CurrentConditionsSchema = z.object({
  observedAt: z.string().datetime(),
  temperatureC: z.number(),
  feelsLikeC: z.number().optional(),
  humidityPct: z.number().min(0).max(100).optional(),
  windSpeedKmh: z.number().optional(),
  windDirectionDeg: z.number().optional(),
  pressureHpa: z.number().optional(),
  visibilityKm: z.number().optional(),
  cloudCoverPct: z.number().optional(),
  precipitationMm: z.number().optional(),
  weatherCode: z.number(),
  conditionText: z.string(),
  isDay: z.boolean(),
});
export type CurrentConditions = z.infer<typeof CurrentConditionsSchema>;

export const HourlyForecastSchema = z.object({
  time: z.string().datetime(),
  temperatureC: z.number(),
  feelsLikeC: z.number().optional(),
  humidityPct: z.number().optional(),
  windSpeedKmh: z.number().optional(),
  precipitationMm: z.number().optional(),
  precipitationProbabilityPct: z.number().optional(),
  weatherCode: z.number(),
  uvIndex: z.number().optional(),
  isDay: z.boolean().optional(),
});
export type HourlyForecast = z.infer<typeof HourlyForecastSchema>;

export const DailyForecastSchema = z.object({
  date: z.string(),
  tempMinC: z.number(),
  tempMaxC: z.number(),
  sunrise: z.string().datetime().optional(),
  sunset: z.string().datetime().optional(),
  precipitationSumMm: z.number().optional(),
  precipitationProbabilityMaxPct: z.number().optional(),
  weatherCode: z.number(),
  uvIndexMax: z.number().optional(),
  windSpeedMaxKmh: z.number().optional(),
});
export type DailyForecast = z.infer<typeof DailyForecastSchema>;

export const AirQualitySchema = z.object({
  aqi: z.number().optional(),
  pm25: z.number().optional(),
  pm10: z.number().optional(),
  category: z.string().optional(),
});
export type AirQuality = z.infer<typeof AirQualitySchema>;

export const WeatherAlertSchema = z.object({
  id: z.string(),
  source: z.enum(["imd", "openmeteo", "mock"]),
  title: z.string(),
  description: z.string(),
  severity: SeveritySchema,
  areas: z.array(z.string()).default([]),
  effectiveFrom: z.string().datetime(),
  effectiveTo: z.string().datetime(),
  recommendedActions: z.array(z.string()).default([]),
});
export type WeatherAlert = z.infer<typeof WeatherAlertSchema>;

export const WeatherSnapshotSchema = z.object({
  fetchedAt: z.string().datetime(),
  location: NamedLocationSchema,
  provider: z.enum(["imd", "openmeteo", "mock"]),
  current: CurrentConditionsSchema,
  hourly: z.array(HourlyForecastSchema),
  daily: z.array(DailyForecastSchema),
  airQuality: AirQualitySchema.optional(),
  uvIndexCurrent: z.number().optional(),
  alerts: z.array(WeatherAlertSchema).default([]),
});
export type WeatherSnapshot = z.infer<typeof WeatherSnapshotSchema>;

export const UserSensitivitiesSchema = z.object({
  asthma: z.boolean().default(false),
  heatSensitive: z.boolean().default(false),
});
export type UserSensitivities = z.infer<typeof UserSensitivitiesSchema>;

export const FarmerPreferencesSchema = z.object({
  crops: z.array(z.string()).default([]),
});
export type FarmerPreferences = z.infer<typeof FarmerPreferencesSchema>;

export const RunnerPreferencesSchema = z.object({
  preferredRunWindow: z
    .enum(["early_morning", "morning", "evening", "any"])
    .default("any"),
});
export type RunnerPreferences = z.infer<typeof RunnerPreferencesSchema>;

export const CardVisibilitySchema = z.object({
  hiddenCardIds: z.array(z.string()).default([]),
  pinnedCardIds: z.array(z.string()).default([]),
  cardOrder: z.array(z.string()).optional(),
});
export type CardVisibility = z.infer<typeof CardVisibilitySchema>;

export const UserProfileSchema = z.object({
  deviceId: z.string().min(1),
  personas: z.array(PersonaIdSchema).min(1),
  activePersona: PersonaIdSchema,
  locations: z.array(NamedLocationSchema).min(1),
  primaryLocationId: z.string(),
  units: UnitsSchema.default({}),
  sensitivities: UserSensitivitiesSchema.default({}),
  farmer: FarmerPreferencesSchema.optional(),
  runner: RunnerPreferencesSchema.optional(),
  language: z.enum(["en", "hi", "pa"]).default("en"),
  cardVisibility: CardVisibilitySchema.default({}),
  updatedAt: z.string().datetime().optional(),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

export const InsightCardSchema = z.object({
  id: z.string(),
  type: z.string(),
  personas: z.array(PersonaIdSchema),
  title: z.string(),
  headline: z.string(),
  severity: SeveritySchema,
  score: z.number().min(0).max(100),
  data: z.record(z.unknown()).default({}),
  actionHint: z.string().optional(),
  whyExplanation: z.string(),
  validUntil: z.string().datetime().optional(),
});
export type InsightCard = z.infer<typeof InsightCardSchema>;

export const HomeFeedSchema = z.object({
  generatedAt: z.string().datetime(),
  activePersona: PersonaIdSchema,
  heroSummary: z.string(),
  cards: z.array(InsightCardSchema),
  snapshotFetchedAt: z.string().datetime(),
});
export type HomeFeed = z.infer<typeof HomeFeedSchema>;

export const FeedRequestSchema = z.object({
  profile: UserProfileSchema,
  location: NamedLocationSchema.optional(),
});
export type FeedRequest = z.infer<typeof FeedRequestSchema>;

export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;
