import { Pressable, View } from "react-native";
import type { Severity } from "@mausam/shared";
import { useTheme } from "@/theme/ThemeProvider";
import { getSeverityStyles } from "@/components/ui/severity";
import { ThemedText } from "@/components/ui/Text";

interface Props {
  title: string;
  message: string;
  severity?: Severity;
  onPress?: () => void;
}

export function AlertBanner({ title, message, severity = "warning", onPress }: Props) {
  const theme = useTheme();
  const meta = getSeverityStyles(severity, theme.colors);
  const { Icon } = meta;
  const inner = (
    <View
      style={{
        flexDirection: "row",
        gap: theme.spacing[3],
        padding: theme.spacing[4],
        borderRadius: theme.radii.lg,
        backgroundColor: meta.bg,
        borderWidth: 1,
        borderColor: meta.border,
      }}
    >
      <Icon size={22} color={meta.fg} strokeWidth={2} accessibilityElementsHidden />
      <View style={{ flex: 1 }}>
        <ThemedText variant="label" style={{ color: meta.fg }}>
          {title}
        </ThemedText>
        <ThemedText variant="bodySmall" style={{ color: meta.fg, marginTop: 4 }}>
          {message}
        </ThemedText>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${meta.label} alert: ${title}. ${message}`}
      >
        {inner}
      </Pressable>
    );
  }
  return (
    <View accessibilityRole="alert" accessibilityLabel={`${title}. ${message}`}>
      {inner}
    </View>
  );
}
