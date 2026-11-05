import { Pressable, View } from "react-native";
import type { InsightCard as InsightCardModel } from "@mausam/shared";
import { HelpCircle } from "lucide-react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { getSeverityStyles } from "@/components/ui/severity";
import { Card } from "@/components/ui/Card";
import { ThemedText } from "@/components/ui/Text";
import { IconButton } from "@/components/ui/IconButton";

interface Props {
  card: InsightCardModel;
  onWhyPress?: (card: InsightCardModel) => void;
}

export function InsightCard({ card, onWhyPress }: Props) {
  const theme = useTheme();
  const meta = getSeverityStyles(card.severity, theme.colors);
  const { Icon } = meta;

  return (
    <Card accessibilityLabel={`${card.title}. ${card.headline}`}>
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: theme.spacing[3] }}>
        <View
          style={{
            padding: 8,
            borderRadius: theme.radii.md,
            backgroundColor: meta.bg,
            borderWidth: 1,
            borderColor: meta.border,
          }}
        >
          <Icon size={20} color={meta.fg} strokeWidth={2} />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText variant="label" color="secondary">
            {card.title}
          </ThemedText>
          <ThemedText variant="title3" style={{ marginTop: theme.spacing[1] }}>
            {card.headline}
          </ThemedText>
          {card.actionHint ? (
            <ThemedText variant="bodySmall" color="accent" style={{ marginTop: theme.spacing[2] }}>
              {card.actionHint}
            </ThemedText>
          ) : null}
        </View>
        {onWhyPress ? (
          <IconButton
            icon={HelpCircle}
            accessibilityLabel={`Why am I seeing ${card.title}?`}
            onPress={() => { onWhyPress(card); }}
          />
        ) : null}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Why am I seeing this: ${card.whyExplanation}`}
        onPress={() => onWhyPress?.(card)}
        style={{ marginTop: theme.spacing[3] }}
      >
        <ThemedText variant="caption" color="accent">
          Why am I seeing this?
        </ThemedText>
      </Pressable>
    </Card>
  );
}
