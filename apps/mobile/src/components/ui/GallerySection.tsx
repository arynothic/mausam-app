import type { ReactNode } from "react";
import { View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { ThemedText } from "@/components/ui/Text";

interface Props {
  title: string;
  children: ReactNode;
}

export function GallerySection({ title, children }: Props) {
  const theme = useTheme();
  return (
    <View style={{ marginTop: theme.spacing[8], gap: theme.spacing[3] }}>
      <ThemedText variant="label" color="secondary">
        {title.toUpperCase()}
      </ThemedText>
      {children}
    </View>
  );
}
