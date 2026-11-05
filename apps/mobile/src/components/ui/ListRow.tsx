import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { ChevronRight } from "lucide-react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { minTouchTarget } from "@/theme/typography";
import { ThemedText } from "@/components/ui/Text";

interface Props {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  onPress?: () => void;
  trailing?: ReactNode;
}

export function ListRow({ title, subtitle, icon: Icon, onPress, trailing }: Props) {
  const theme = useTheme();
  const content = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        minHeight: minTouchTarget,
        paddingVertical: theme.spacing[2],
        gap: theme.spacing[3],
      }}
    >
      {Icon ? <Icon size={22} color={theme.colors.accent} strokeWidth={1.75} /> : null}
      <View style={{ flex: 1 }}>
        <ThemedText variant="body">{title}</ThemedText>
        {subtitle ? (
          <ThemedText variant="bodySmall" color="secondary">
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {trailing ?? (onPress ? <ChevronRight size={20} color={theme.colors.textTertiary} /> : null)}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      >
        {content}
      </Pressable>
    );
  }
  return content;
}
