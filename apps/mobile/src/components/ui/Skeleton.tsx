import { useEffect } from "react";
import { View, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/theme/ThemeProvider";

interface Props {
  height?: number;
  width?: number | `${number}%`;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ height = 16, width = "100%", borderRadius, style }: Props) {
  const theme = useTheme();
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.9, { duration: 900 }), -1, true);
  }, [opacity]);

  const anim = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        anim,
        {
          height,
          width,
          borderRadius: borderRadius ?? theme.radii.sm,
          backgroundColor: theme.colors.surfaceMuted,
        },
        style,
      ]}
    />
  );
}

export function SkeletonBlock({ lines = 3 }: { lines?: number }) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing[2] }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? "70%" : "100%"} />
      ))}
    </View>
  );
}
