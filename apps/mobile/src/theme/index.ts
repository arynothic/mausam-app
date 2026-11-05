import type { ColorScheme } from "./colors";
import { resolveColors, type ThemeColors } from "./colors";
import { elevation } from "./elevation";
import { motion } from "./motion";
import { radii } from "./radii";
import { spacing } from "./spacing";
import { fontFamily, minTouchTarget, typography } from "./typography";
import { weatherGradients } from "./weatherGradients";

export const themeTokens = {
  spacing,
  radii,
  elevation,
  typography,
  fontFamily,
  minTouchTarget,
  motion,
  weatherGradients,
} as const;

export interface Theme {
  scheme: ColorScheme;
  colors: ThemeColors;
  spacing: typeof spacing;
  radii: typeof radii;
  elevation: typeof elevation;
  typography: typeof typography;
  fontFamily: typeof fontFamily;
  minTouchTarget: typeof minTouchTarget;
  motion: typeof motion;
  weatherGradients: typeof weatherGradients;
}

export function createTheme(scheme: ColorScheme): Theme {
  return {
    scheme,
    colors: resolveColors(scheme),
    ...themeTokens,
  };
}

export { resolveColors } from "./colors";
export { weatherGradients, defaultWeatherMood } from "./weatherGradients";
export type { WeatherMood } from "./weatherGradients";
export type { ColorScheme, ThemeColors } from "./colors";
