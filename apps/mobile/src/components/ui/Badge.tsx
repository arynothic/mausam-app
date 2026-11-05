import { View } from "react-native";
import type { Severity } from "@mausam/shared";
import { useTheme } from "@/theme/ThemeProvider";
import { getSeverityStyles } from "@/components/ui/severity";
import { ThemedText } from "@/components/ui/Text";

interface Props {
  label: string;
  severity?: Severity;
}

export function Badge({ label, severity = "info" }: Props) {
  const theme = useTheme();
  const meta = getSeverityStyles(severity, theme.colors);
  const { Icon } = meta;
  return (
    <View
      accessibilityLabel={`${meta.label}: ${label}`}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        alignSelf: "flex-start",
        paddingHorizontal: theme.spacing[2],
        paddingVertical: 4,
        borderRadius: theme.radii.pill,
        backgroundColor: meta.bg,
        borderWidth: 1,
        borderColor: meta.border,
      }}
    >
      <Icon size={14} color={meta.fg} strokeWidth={2} />
      <ThemedText variant="caption" style={{ color: meta.fg }}>
        {label}
      </ThemedText>
    </View>
  );
}
