import * as Haptics from "expo-haptics";
import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { minTouchTarget } from "@/theme/typography";
import { ThemedText } from "@/components/ui/Text";

type Variant = "primary" | "secondary" | "ghost";

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  haptic?: boolean;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  loading,
  disabled,
  accessibilityLabel,
  haptic = true,
}: Props) {
  const theme = useTheme();
  const isPrimary = variant === "primary";
  const isGhost = variant === "ghost";

  const bg = isPrimary
    ? theme.colors.accent
    : isGhost
      ? "transparent"
      : theme.colors.surface;
  const border = isGhost ? "transparent" : theme.colors.border;
  const textColor = isPrimary ? theme.colors.surface : theme.colors.text;

  return (
    <Pressable
      disabled={(disabled ?? false) || (loading ?? false)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!disabled || !!loading }}
      onPress={() => {
        if (haptic) void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.btn,
        {
          minHeight: minTouchTarget,
          borderRadius: theme.radii.lg,
          backgroundColor: bg,
          borderColor: border,
          opacity: pressed ? 0.9 : disabled ? 0.5 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <ThemedText variant="label" style={{ color: textColor, textAlign: "center" }}>
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
