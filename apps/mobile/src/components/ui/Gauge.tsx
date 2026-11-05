import Svg, { Circle, Path } from "react-native-svg";
import { View } from "react-native";
import { useTheme } from "@/theme/ThemeProvider";
import { ThemedText } from "@/components/ui/Text";

interface Props {
  value: number;
  max?: number;
  label: string;
  unit?: string;
  size?: number;
}

/** Semi-circular gauge for UV, AQI, run score, etc. */
export function Gauge({ value, max = 100, label, unit, size = 120 }: Props) {
  const theme = useTheme();
  const clamped = Math.min(max, Math.max(0, value));
  const pct = clamped / max;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2 + 8;
  const startAngle = Math.PI;
  const endAngle = startAngle + Math.PI * pct;
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const largeArc = pct > 0.5 ? 1 : 0;
  const track = `M ${String(x1)} ${String(y1)} A ${String(r)} ${String(r)} 0 1 1 ${String(cx + r)} ${String(cy)}`;
  const fill = `M ${String(x1)} ${String(y1)} A ${String(r)} ${String(r)} 0 ${String(largeArc)} 1 ${String(x2)} ${String(y2)}`;

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={`${label} ${String(Math.round(clamped))}${unit ?? ""} out of ${String(max)}`}
      style={{ alignItems: "center", width: size }}
    >
      <Svg width={size} height={size * 0.65}>
        <Path d={track} stroke={theme.colors.surfaceMuted} strokeWidth={stroke} fill="none" />
        <Path d={fill} stroke={theme.colors.accent} strokeWidth={stroke} fill="none" strokeLinecap="round" />
        <Circle cx={cx} cy={cy} r={3} fill={theme.colors.accent} />
      </Svg>
      <ThemedText variant="display" style={{ fontSize: 32, lineHeight: 36, marginTop: -theme.spacing[2] }}>
        {String(Math.round(clamped))}
        {unit ?? ""}
      </ThemedText>
      <ThemedText variant="caption" color="secondary">
        {label}
      </ThemedText>
    </View>
  );
}
