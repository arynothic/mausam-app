import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { minTouchTarget } from "@/theme/typography";
import { ThemedText } from "@/components/ui/Text";

interface Props<T extends string> {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel = "Segmented control",
}: Props<T>) {
  const theme = useTheme();
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.wrap,
        {
          backgroundColor: theme.colors.surfaceMuted,
          borderRadius: theme.radii.lg,
          padding: 4,
        },
      ]}
    >
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => { onChange(opt.value); }}
            style={[
              styles.segment,
              {
                minHeight: minTouchTarget - 8,
                borderRadius: theme.radii.md,
                backgroundColor: selected ? theme.colors.surface : "transparent",
              },
            ]}
          >
            <ThemedText variant="label" color={selected ? "primary" : "secondary"}>
              {opt.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row" },
  segment: { flex: 1, alignItems: "center", justifyContent: "center" },
});
