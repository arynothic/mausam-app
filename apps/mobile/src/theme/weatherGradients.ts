/** Subtle hero gradients keyed by weather mood (not full-screen). */
export type WeatherMood =
  | "clear_day"
  | "clear_night"
  | "cloudy"
  | "rain"
  | "storm"
  | "fog"
  | "heat"
  | "cold";

export const weatherGradients: Record<
  WeatherMood,
  { colors: [string, string, string]; locations?: [number, number, number] }
> = {
  clear_day: {
    colors: ["#E8F4F8", "#F5F4F0", "#F5F4F0"],
    locations: [0, 0.45, 1],
  },
  clear_night: {
    colors: ["#1A2332", "#121210", "#121210"],
    locations: [0, 0.5, 1],
  },
  cloudy: {
    colors: ["#D8DCE3", "#EEEDE8", "#F5F4F0"],
    locations: [0, 0.4, 1],
  },
  rain: {
    colors: ["#B8C5D6", "#DDE4EC", "#F5F4F0"],
    locations: [0, 0.35, 1],
  },
  storm: {
    colors: ["#5C6B7A", "#8A96A3", "#EEEDE8"],
    locations: [0, 0.3, 1],
  },
  fog: {
    colors: ["#D4D8DC", "#E8EAED", "#F5F4F0"],
    locations: [0, 0.4, 1],
  },
  heat: {
    colors: ["#FFE8D6", "#FFF5EB", "#F5F4F0"],
    locations: [0, 0.35, 1],
  },
  cold: {
    colors: ["#D6E8F5", "#EEF4F8", "#F5F4F0"],
    locations: [0, 0.4, 1],
  },
};

export function defaultWeatherMood(isDay: boolean): WeatherMood {
  return isDay ? "clear_day" : "clear_night";
}
