/** Neutral base + calm accent; severity tokens always pair with icon + text. */

export const palette = {
  light: {
    background: "#F5F4F0",
    surface: "#FFFFFF",
    surfaceMuted: "#EEEDE8",
    text: "#1A1A18",
    textSecondary: "#5C5C56",
    textTertiary: "#8A8A82",
    border: "#E2E1DA",
    accent: "#2F6F6D",
    accentMuted: "#D4E8E7",
    heroOverlay: "rgba(255, 255, 255, 0.72)",
  },
  dark: {
    background: "#121210",
    surface: "#1C1C19",
    surfaceMuted: "#262622",
    text: "#F5F4F0",
    textSecondary: "#B8B8B0",
    textTertiary: "#8A8A82",
    border: "#33332E",
    accent: "#6BB8B4",
    accentMuted: "#1E3D3C",
    heroOverlay: "rgba(18, 18, 16, 0.65)",
  },
} as const;

export const severityColors = {
  light: {
    info: { fg: "#2F6F6D", bg: "#D4E8E7", border: "#A8D4D2" },
    good: { fg: "#2D6A4F", bg: "#D8F3DC", border: "#95D5B2" },
    caution: { fg: "#9A6700", bg: "#FFF3CD", border: "#FFE08A" },
    warning: { fg: "#B45309", bg: "#FFEDD5", border: "#FDBA74" },
    severe: { fg: "#B91C1C", bg: "#FEE2E2", border: "#FCA5A5" },
  },
  dark: {
    info: { fg: "#6BB8B4", bg: "#1E3D3C", border: "#2F6F6D" },
    good: { fg: "#95D5B2", bg: "#1B4332", border: "#2D6A4F" },
    caution: { fg: "#FCD34D", bg: "#422006", border: "#92400E" },
    warning: { fg: "#FDBA74", bg: "#431407", border: "#C2410C" },
    severe: { fg: "#FCA5A5", bg: "#450A0A", border: "#B91C1C" },
  },
} as const;

export type ColorScheme = keyof typeof palette;

export type ThemeColorsFor<S extends ColorScheme> = (typeof palette)[S] & {
  severity: (typeof severityColors)[S];
};

export type ThemeColors = ThemeColorsFor<ColorScheme>;

export function resolveColors<S extends ColorScheme>(scheme: S): ThemeColorsFor<S> {
  return {
    ...palette[scheme],
    severity: severityColors[scheme],
  };
}
