import type { PropsWithChildren, ReactNode } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
  type ViewStyle,
} from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";
import { useTheme } from "@/theme/ThemeProvider";

type Props = PropsWithChildren<{
  scroll?: boolean;
  edges?: Edge[];
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  scrollProps?: ScrollViewProps;
  header?: ReactNode;
}>;

export function Screen({
  children,
  scroll = false,
  edges = ["top", "bottom"],
  style,
  contentContainerStyle,
  scrollProps,
  header,
}: Props) {
  const theme = useTheme();
  const padding = theme.spacing[5];

  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { padding, paddingTop: header ? theme.spacing[2] : padding },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      {...scrollProps}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fill, { padding }, contentContainerStyle]}>{children}</View>
  );

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.fill, { backgroundColor: theme.colors.background }, style]}
    >
      {header}
      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scrollContent: { paddingBottom: 48 },
});
