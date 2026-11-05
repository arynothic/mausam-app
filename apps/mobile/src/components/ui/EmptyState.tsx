import { View } from "react-native";
import { Cloud } from "lucide-react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { ThemedText, ScreenTitle } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";

interface Props {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "Nothing here yet",
  message = "When data is available, it will show up in this space.",
  actionLabel,
  onAction,
}: Props) {
  const theme = useTheme();
  return (
    <View
      style={{
        alignItems: "center",
        paddingVertical: theme.spacing[8],
        paddingHorizontal: theme.spacing[4],
      }}
      accessibilityRole="text"
    >
      <Cloud size={40} color={theme.colors.textTertiary} strokeWidth={1.5} />
      <ScreenTitle style={{ marginTop: theme.spacing[4], textAlign: "center" }}>
        {title}
      </ScreenTitle>
      <ThemedText color="secondary" style={{ marginTop: theme.spacing[2], textAlign: "center" }}>
        {message}
      </ThemedText>
      {actionLabel && onAction ? (
        <View style={{ marginTop: theme.spacing[5], alignSelf: "stretch" }}>
          <Button label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}
