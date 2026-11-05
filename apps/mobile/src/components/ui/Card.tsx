import type { ReactNode } from "react";
import { Pressable, StyleSheet, View, type ViewStyle } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { elevation } from "@/theme/elevation";

interface Props {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padded?: boolean;
  accessibilityLabel?: string;
}

export function Card({
  children,
  onPress,
  style,
  padded = true,
  accessibilityLabel,
}: Props) {
  const theme = useTheme();
  const inner = (
    <View
      style={[
        styles.card,
        elevation.sm,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.lg,
          borderColor: theme.colors.border,
          padding: padded ? theme.spacing[4] : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1 })}
      >
        {inner}
      </Pressable>
    );
  }
  return (
    <View accessibilityLabel={accessibilityLabel} accessible={!!accessibilityLabel}>
      {inner}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: StyleSheet.hairlineWidth },
});
