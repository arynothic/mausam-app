import { useState } from "react";
import { View } from "react-native";
import { Link } from "expo-router";
import {
  buildHomeFeed,
  FIXTURE_NOW,
  FIXTURE_SNAPSHOT,
  profileFor,
  type InsightCard as InsightCardModel,
  type PersonaId,
} from "@mausam/shared";
import {
  AlertBanner,
  Badge,
  Button,
  Card,
  DayRow,
  EmptyState,
  ErrorState,
  GallerySection,
  Gauge,
  HourlyStrip,
  IconButton,
  InsightCard,
  ListRow,
  PersonaSwitcher,
  Pill,
  Screen,
  ScreenTitle,
  SegmentedControl,
  Sheet,
  SkeletonBlock,
  Sparkline,
  ThemedText,
  Toggle,
} from "@/components/ui";
import { useTheme } from "@/theme/ThemeProvider";
import { Settings } from "lucide-react-native";

const demoFeed = buildHomeFeed(FIXTURE_SNAPSHOT, profileFor("runner"), { now: FIXTURE_NOW });
const sampleCard: InsightCardModel = demoFeed.cards[0] ?? {
  id: "sample",
  type: "sample",
  personas: ["runner"],
  title: "Run suitability",
  headline: "Great conditions for a run today.",
  severity: "good",
  score: 80,
  data: {},
  whyExplanation: "Demo card for the gallery.",
};

export default function DevGalleryScreen() {
  const theme = useTheme();
  const [persona, setPersona] = useState<PersonaId>("runner");
  const [units, setUnits] = useState<"c" | "f">("c");
  const [notifications, setNotifications] = useState(true);
  const [whyOpen, setWhyOpen] = useState(false);
  const [whyCard, setWhyCard] = useState<InsightCardModel | null>(null);

  return (
    <Screen scroll>
      <Link href="/" asChild>
        <ThemedText color="accent" accessibilityRole="link">
          ← Home
        </ThemedText>
      </Link>
      <ScreenTitle style={{ marginTop: theme.spacing[4] }}>UI Gallery</ScreenTitle>
      <ThemedText color="secondary" style={{ marginTop: theme.spacing[2] }}>
        Mausam design system — tap targets ≥44pt, severity always icon + text.
      </ThemedText>

      <GallerySection title="Actions">
        <Button label="Primary action" onPress={() => undefined} />
        <Button label="Secondary" variant="secondary" onPress={() => undefined} />
        <View style={{ flexDirection: "row", gap: theme.spacing[2], alignItems: "center" }}>
          <IconButton icon={Settings} accessibilityLabel="Settings" onPress={() => undefined} />
          <Pill label="Chip" selected />
          <Pill label="Outline" />
        </View>
      </GallerySection>

      <GallerySection title="Controls">
        <SegmentedControl
          options={[
            { value: "c", label: "°C" },
            { value: "f", label: "°F" },
          ]}
          value={units}
          onChange={setUnits}
        />
        <Toggle
          label="Notifications"
          value={notifications}
          onValueChange={setNotifications}
        />
        <PersonaSwitcher
          personas={["runner", "farmer", "parent", "traveller"]}
          active={persona}
          onChange={setPersona}
        />
      </GallerySection>

      <GallerySection title="Data display">
        <Gauge value={72} label="Run score" />
        <Sparkline values={[12, 14, 13, 18, 22, 20, 24]} accessibilityLabel="Temperature trend" />
        <HourlyStrip
          hours={[
            { timeLabel: "Now", tempC: 28, precipPct: 10 },
            { timeLabel: "1 PM", tempC: 30, precipPct: 15 },
            { timeLabel: "2 PM", tempC: 31, precipPct: 40 },
          ]}
        />
        <Card>
          <DayRow dayLabel="Mon" tempMinC={24} tempMaxC={34} precipPct={60} />
          <DayRow dayLabel="Tue" tempMinC={25} tempMaxC={33} precipPct={10} />
        </Card>
      </GallerySection>

      <GallerySection title="Feedback">
        <Badge label="Moderate AQI" severity="caution" />
        <AlertBanner
          title="Thunderstorm watch"
          message="Demo alert — stay indoors if thunder is audible."
          severity="warning"
        />
        <InsightCard
          card={sampleCard}
          onWhyPress={(c) => {
            setWhyCard(c);
            setWhyOpen(true);
          }}
        />
        <SkeletonBlock lines={2} />
        <EmptyState actionLabel="Enable location" onAction={() => undefined} />
        <ErrorState onRetry={() => undefined} />
      </GallerySection>

      <GallerySection title="Lists">
        <Card padded={false} style={{ paddingHorizontal: theme.spacing[4] }}>
          <ListRow title="Saved places" subtitle="Delhi, Mumbai" onPress={() => undefined} />
          <ListRow title="Units" trailing={<ThemedText color="secondary">°C</ThemedText>} />
        </Card>
      </GallerySection>

      <Sheet visible={whyOpen} onClose={() => { setWhyOpen(false); }} title="Why am I seeing this?">
        <ThemedText variant="body">{whyCard?.whyExplanation ?? ""}</ThemedText>
      </Sheet>
    </Screen>
  );
}
