import Svg, { Polyline } from "react-native-svg";
import { View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";

interface Props {
  values: number[];
  width?: number;
  height?: number;
  accessibilityLabel?: string;
}

export function Sparkline({ values, width = 120, height = 36, accessibilityLabel }: Props) {
  const theme = useTheme();
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${String(x)},${String(y)}`;
    })
    .join(" ");

  return (
    <View accessibilityLabel={accessibilityLabel ?? "Trend sparkline"}>
      <Svg width={width} height={height}>
        <Polyline
          points={points}
          fill="none"
          stroke={theme.colors.accent}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}
