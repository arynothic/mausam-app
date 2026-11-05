import { View } from "react-native";
import { WifiOff } from "lucide-react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { ThemedText, ScreenTitle } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";

interface Props {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "Check your connection and try again.",
  onRetry,
}: Props) {
  const theme = useTheme();
  return (
    <View
      style={{
        alignItems: "center",
        paddingVertical: theme.spacing[8],
        paddingHorizontal: theme.spacing[4],
      }}
      accessibilityRole="alert"
    >
      <WifiOff size={40} color={theme.colors.severity.warning.fg} strokeWidth={1.5} />
      <ScreenTitle style={{ marginTop: theme.spacing[4], textAlign: "center" }}>
        {title}
      </ScreenTitle>
      <ThemedText color="secondary" style={{ marginTop: theme.spacing[2], textAlign: "center" }}>
        {message}
      </ThemedText>
      {onRetry ? (
        <View style={{ marginTop: theme.spacing[5], alignSelf: "stretch" }}>
          <Button label="Try again" onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
}
