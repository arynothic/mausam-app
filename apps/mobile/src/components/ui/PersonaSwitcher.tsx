import { ScrollView } from "react-native";
import { PERSONA_DEFINITIONS, type PersonaId } from "@mausam/shared";
import { useTheme } from "@/theme/ThemeProvider";
import { Pill } from "@/components/ui/Pill";

interface Props {
  personas: PersonaId[];
  active: PersonaId;
  onChange: (id: PersonaId) => void;
}

export function PersonaSwitcher({ personas, active, onChange }: Props) {
  const theme = useTheme();
  const options = PERSONA_DEFINITIONS.filter((p) => personas.includes(p.id));

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityLabel="Persona switcher"
      contentContainerStyle={{ gap: theme.spacing[2], paddingVertical: theme.spacing[1] }}
    >
      {options.map((p) => (
        <Pill
          key={p.id}
          label={`${p.emoji} ${p.id}`}
          selected={p.id === active}
          onPress={() => { onChange(p.id); }}
        />
      ))}
    </ScrollView>
  );
}
