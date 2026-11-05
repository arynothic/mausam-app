import type { Severity } from "@mausam/shared";
import type { Theme } from "@/theme";
import type { LucideIcon } from "lucide-react-native";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  OctagonAlert,
} from "lucide-react-native";

export function getSeverityStyles(
  severity: Severity,
  colors: Theme["colors"],
): {
  Icon: LucideIcon;
  fg: string;
  bg: string;
  border: string;
  label: string;
} {
  const t = colors.severity[severity];
  const labels: Record<Severity, string> = {
    info: "Info",
    good: "Good",
    caution: "Caution",
    warning: "Warning",
    severe: "Severe",
  };
  const icons: Record<Severity, LucideIcon> = {
    info: Info,
    good: CheckCircle2,
    caution: AlertTriangle,
    warning: AlertTriangle,
    severe: OctagonAlert,
  };
  return {
    Icon: icons[severity],
    fg: t.fg,
    bg: t.bg,
    border: t.border,
    label: labels[severity],
  };
}
