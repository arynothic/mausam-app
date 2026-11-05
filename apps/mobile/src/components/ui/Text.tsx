import { StyleSheet, Text, type TextProps } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { typography } from "@/theme/typography";

type Variant = keyof typeof typography;

type Props = TextProps & {
  variant?: Variant;
  color?: "primary" | "secondary" | "tertiary" | "accent";
};

export function ThemedText({
  variant = "body",
  color = "primary",
  style,
  ...rest
}: Props) {
  const theme = useTheme();
  const colorMap = {
    primary: theme.colors.text,
    secondary: theme.colors.textSecondary,
    tertiary: theme.colors.textTertiary,
    accent: theme.colors.accent,
  };

  return (
    <Text
      {...rest}
      style={[typography[variant], { color: colorMap[color] }, style]}
    />
  );
}

export function ScreenTitle(props: TextProps) {
  return <ThemedText variant="title1" accessibilityRole="header" {...props} />;
}

export const textStyles = StyleSheet.create({});
