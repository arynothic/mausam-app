import { Pressable, StyleSheet } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { minTouchTarget } from "@/theme/typography";
import { ThemedText } from "@/components/ui/Text";

interface Props {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
}

export function Pill({ label, selected, onPress, accessibilityLabel }: Props) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [
        styles.pill,
        {
          minHeight: minTouchTarget,
          borderRadius: theme.radii.pill,
          paddingHorizontal: theme.spacing[4],
          backgroundColor: selected ? theme.colors.accentMuted : theme.colors.surface,
          borderColor: selected ? theme.colors.accent : theme.colors.border,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <ThemedText variant="label" color={selected ? "accent" : "secondary"}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

/** Alias */
export const Chip = Pill;

const styles = StyleSheet.create({
  pill: {
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    alignItems: "center",
  },
});
