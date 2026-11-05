import { View } from "react-native";
import { CloudSun } from "lucide-react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { ThemedText } from "@/components/ui/Text";

interface Props {
  dayLabel: string;
  tempMinC: number;
  tempMaxC: number;
  precipPct?: number;
}

export function DayRow({ dayLabel, tempMinC, tempMaxC, precipPct }: Props) {
  const theme = useTheme();
  return (
    <View
      accessibilityLabel={`${dayLabel}, high ${String(Math.round(tempMaxC))}, low ${String(Math.round(tempMinC))}`}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: theme.spacing[3],
        gap: theme.spacing[3],
      }}
    >
      <ThemedText variant="body" style={{ width: 56 }}>
        {dayLabel}
      </ThemedText>
      <CloudSun size={20} color={theme.colors.textSecondary} strokeWidth={1.75} />
      {precipPct !== undefined && precipPct > 30 ? (
        <ThemedText variant="caption" color="accent" style={{ width: 36 }}>
          {String(precipPct)}%
        </ThemedText>
      ) : (
        <View style={{ width: 36 }} />
      )}
      <View style={{ flex: 1 }} />
      <ThemedText variant="body" color="secondary">
        {String(Math.round(tempMinC))}°
      </ThemedText>
      <ThemedText variant="body" style={{ width: 40, textAlign: "right" }}>
        {String(Math.round(tempMaxC))}°
      </ThemedText>
    </View>
  );
}
