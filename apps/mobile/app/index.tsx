import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PERSONA_DEFINITIONS } from "@mausam/shared";
import { ScreenTitle, ThemedText } from "@/components/ui/Text";
import { useTheme } from "@/theme/ThemeProvider";
import { defaultWeatherMood, weatherGradients } from "@/theme";

export default function HomePlaceholder() {
  const theme = useTheme();
  const mood = defaultWeatherMood(true);
  const gradient = weatherGradients[mood];

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.scheme === "dark" ? "light" : "dark"} />
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient
          colors={gradient.colors}
          locations={gradient.locations}
          style={[styles.hero, { borderRadius: theme.radii.xxl }]}
        >
          <ThemedText variant="caption" color="secondary">
            Mausam · Phase 1
          </ThemedText>
          <ScreenTitle style={{ marginTop: theme.spacing[2] }}>Personal weather</ScreenTitle>
          <ThemedText color="secondary" style={{ marginTop: theme.spacing[2] }}>
            {PERSONA_DEFINITIONS.length} personas ready in shared package.
          </ThemedText>
        </LinearGradient>
        <View style={{ marginTop: theme.spacing[6], gap: theme.spacing[2] }}>
          {PERSONA_DEFINITIONS.map((p) => (
            <View
              key={p.id}
              style={[
                styles.row,
                {
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.radii.lg,
                  padding: theme.spacing[4],
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <ThemedText variant="title3">
                {p.emoji} {p.id}
              </ThemedText>
              <ThemedText variant="bodySmall" color="secondary">
                {p.insightModuleIds.length} insight modules (Phase 3)
              </ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  hero: { padding: 24, minHeight: 160, justifyContent: "flex-end" },
  row: { borderWidth: StyleSheet.hairlineWidth },
});
