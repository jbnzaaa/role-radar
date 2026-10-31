import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import { displayMaxFontSizeMultiplier, type Theme, useTheme, useThemedStyles } from "@/theme";

import { type Tone, toneColors } from "./tone";

// Verdict bands Low 0–44, Partial 45–64, Good 65–79, Strong 80–100 (DESIGN_SYSTEM.md §2.2);
// edges sit between whole scores. TODO(P3-06): take thresholds from core scoring.
const BANDS: { from: number; to: number; tone: Tone }[] = [
  { from: 0, to: 44.5, tone: "low" },
  { from: 44.5, to: 64.5, tone: "partial" },
  { from: 64.5, to: 79.5, tone: "good" },
  { from: 79.5, to: 100, tone: "strong" },
];

export type GaugeProps = {
  /** 0–100, or null for the empty state. */
  value: number | null;
  /** Verdict text under the number, e.g. "Good match" (or the empty message). */
  label: string;
  size?: "lg" | "md";
  /** What the number means, e.g. "Average match score". */
  accessibilityName: string;
};

/** Semicircle point for a 0–100 value: 0 = left, 100 = right, over the top. */
function point(cx: number, cy: number, r: number, v: number) {
  const a = Math.PI - (v / 100) * Math.PI;
  return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
}

function arc(cx: number, cy: number, r: number, from: number, to: number) {
  const s = point(cx, cy, r, from);
  const e = point(cx, cy, r, to);
  return `M ${s.x} ${s.y} A ${r} ${r} 0 0 1 ${e.x} ${e.y}`;
}

export function Gauge({ value, label, size = "lg", accessibilityName }: GaugeProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);

  const width = size === "lg" ? theme.size.gaugeLg : theme.size.gaugeMd;
  const stroke = width * 0.08;
  const markerR = stroke * 0.8;
  const r = width / 2 - markerR;
  const cx = width / 2;
  const cy = r + markerR;
  const height = cy + markerR;

  const v = value === null ? null : Math.round(Math.min(100, Math.max(0, value)));
  const marker = v === null ? null : point(cx, cy, r, v);
  const spoken =
    v === null ? `${accessibilityName}, ${label}` : `${accessibilityName} ${v} percent, ${label}`;

  return (
    <View style={styles.wrap} accessible accessibilityRole="image" accessibilityLabel={spoken}>
      <Svg width={width} height={height}>
        {BANDS.map((b) => (
          <Path
            key={b.tone}
            d={arc(cx, cy, r, b.from, b.to)}
            stroke={v === null ? theme.color.border : toneColors(theme, b.tone).fg}
            strokeOpacity={v === null ? 1 : theme.opacity.band}
            strokeWidth={stroke}
            fill="none"
          />
        ))}
        {marker && (
          <Circle
            cx={marker.x}
            cy={marker.y}
            r={markerR}
            fill={theme.color.surfaceCard}
            stroke={theme.color.textPrimary}
            strokeWidth={stroke / 4}
          />
        )}
      </Svg>
      <View style={[styles.centre, { width }]}>
        <Text
          style={size === "lg" ? styles.valueLg : styles.valueMd}
          maxFontSizeMultiplier={displayMaxFontSizeMultiplier}
        >
          {v === null ? "–" : `${v}%`}
        </Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    wrap: { alignItems: "center" },
    // Number and verdict sit inside the arc, on its baseline.
    centre: { position: "absolute", bottom: 0, alignItems: "center" },
    valueLg: { ...t.text.scoreXl, color: t.color.textPrimary },
    valueMd: { ...t.text.scoreLg, color: t.color.textPrimary },
    label: { ...t.text.small, color: t.color.textSecondary, textAlign: "center" },
  });
