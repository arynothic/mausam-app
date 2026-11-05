import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { minTouchTarget } from "@/theme/typography";

interface Props {
  icon: LucideIcon;
  onPress?: () => void;
  accessibilityLabel: string;
  selected?: boolean;
}

export function IconButton({ icon: Icon, onPress, accessibilityLabel, selected }: Props) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={() => {
        void Haptics.selectionAsync();
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.hit,
        {
          width: minTouchTarget,
          height: minTouchTarget,
          borderRadius: theme.radii.md,
          backgroundColor: selected ? theme.colors.accentMuted : "transparent",
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Icon size={22} color={theme.colors.text} strokeWidth={1.75} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: { justifyContent: "center", alignItems: "center" },
});
