import { Pressable, View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { minTouchTarget } from "@/theme/typography";
import { ThemedText } from "@/components/ui/Text";

interface Props {
  value: boolean;
  onValueChange: (next: boolean) => void;
  label: string;
  accessibilityHint?: string;
}

export function Toggle({ value, onValueChange, label, accessibilityHint }: Props) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      onPress={() => { onValueChange(!value); }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: minTouchTarget,
      }}
    >
      <ThemedText variant="body">{label}</ThemedText>
      <View
        style={{
          width: 52,
          height: 32,
          borderRadius: theme.radii.pill,
          backgroundColor: value ? theme.colors.accent : theme.colors.surfaceMuted,
          padding: 3,
          justifyContent: "center",
          alignItems: value ? "flex-end" : "flex-start",
        }}
      >
        <View
          style={{
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: theme.colors.surface,
          }}
        />
      </View>
    </Pressable>
  );
}
