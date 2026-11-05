import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { ScreenTitle, ThemedText } from "@/components/ui/Text";
import { useTheme } from "@/theme/ThemeProvider";

/** Component gallery — expanded in Phase 4 */
export default function DevGalleryScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing[5] }}>
        <Link href="/" asChild>
          <ThemedText color="accent" accessibilityRole="link">
            ← Back
          </ThemedText>
        </Link>
        <ScreenTitle style={{ marginTop: theme.spacing[4] }}>UI Gallery</ScreenTitle>
        <ThemedText color="secondary" style={{ marginTop: theme.spacing[2] }}>
          Design tokens and components will be previewed here in Phase 4.
        </ThemedText>
        <View
          style={{
            marginTop: theme.spacing[6],
            padding: theme.spacing[4],
            borderRadius: theme.radii.lg,
            backgroundColor: theme.colors.surface,
          }}
        >
          <ThemedText variant="label">Typography</ThemedText>
          <ThemedText variant="display" style={{ marginTop: theme.spacing[2] }}>
            28°
          </ThemedText>
          <ThemedText variant="body" style={{ marginTop: theme.spacing[2] }}>
            Body — calm, readable copy before numbers.
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
