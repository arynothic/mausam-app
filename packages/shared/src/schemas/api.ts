import { z } from "zod";
import { NamedLocationSchema } from "./weather.js";

export const LocationSearchQuerySchema = z.object({
  q: z.string().min(1).max(120),
  limit: z.coerce.number().int().min(1).max(20).default(8),
});
export type LocationSearchQuery = z.infer<typeof LocationSearchQuerySchema>;

export const LocationSearchResponseSchema = z.object({
  locations: z.array(NamedLocationSchema),
});
export type LocationSearchResponse = z.infer<typeof LocationSearchResponseSchema>;

export const WeatherQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
  name: z.string().optional(),
});
export type WeatherQuery = z.infer<typeof WeatherQuerySchema>;

export const AlertsQuerySchema = WeatherQuerySchema;
export type AlertsQuery = z.infer<typeof AlertsQuerySchema>;
