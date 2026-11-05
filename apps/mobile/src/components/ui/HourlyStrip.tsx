import { ScrollView, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { ThemedText } from "@/components/ui/Text";

export interface HourlyStripItem {
  timeLabel: string;
  tempC: number;
  precipPct?: number;
}

interface Props {
  hours: HourlyStripItem[];
}

export function HourlyStrip({ hours }: Props) {
  const theme = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityLabel="Hourly forecast strip"
      contentContainerStyle={{ gap: theme.spacing[3], paddingVertical: theme.spacing[2] }}
    >
      {hours.map((h) => (
        <View
          key={h.timeLabel}
          style={{
            alignItems: "center",
            minWidth: 52,
            padding: theme.spacing[2],
            borderRadius: theme.radii.md,
            backgroundColor: theme.colors.surfaceMuted,
          }}
        >
          <ThemedText variant="caption" color="secondary">
            {h.timeLabel}
          </ThemedText>
          <ThemedText variant="title3" style={{ marginTop: 4 }}>
            {String(Math.round(h.tempC))}°
          </ThemedText>
          {h.precipPct !== undefined && h.precipPct > 20 ? (
            <ThemedText variant="caption" color="accent" style={{ marginTop: 2 }}>
              {String(h.precipPct)}%
            </ThemedText>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}
