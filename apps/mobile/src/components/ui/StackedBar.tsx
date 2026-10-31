import { StyleSheet, Text, View } from "react-native";

import { type Theme, useTheme, useThemedStyles } from "@/theme";

import { type Tone, toneColors } from "./tone";

export type StackedBarSegment = {
  label: string;
  count: number;
  tone: Tone;
};

export type StackedBarProps = {
  segments: StackedBarSegment[];
};

/** Horizontal bar split by segment value. Pair with LegendRow for the text equivalent. */
export function StackedBar({ segments }: StackedBarProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const visible = segments.filter((s) => s.count > 0);
  const summary = segments.map((s) => `${s.label} ${s.count}`).join(", ");

  return (
    <View style={styles.track} accessible accessibilityRole="image" accessibilityLabel={summary}>
      {visible.map((s) => (
        <View
          key={s.label}
          style={{ flex: s.count, backgroundColor: toneColors(theme, s.tone).fg }}
        />
      ))}
    </View>
  );
}

export type LegendRowProps = {
  label: string;
  value: number | string;
  tone: Tone;
};

export function LegendRow({ label, value, tone }: LegendRowProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.legend} accessible accessibilityLabel={`${label}: ${value}`}>
      <View style={[styles.swatch, { backgroundColor: toneColors(theme, tone).fg }]} />
      <Text style={styles.legendLabel}>{label}</Text>
      <Text style={styles.legendValue}>{value}</Text>
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    track: {
      flexDirection: "row",
      height: t.size.bar,
      borderRadius: t.radius.full,
      backgroundColor: t.color.surfaceSunken,
      overflow: "hidden",
    },
    legend: {
      flexDirection: "row",
      alignItems: "center",
      gap: t.space[2],
      minHeight: t.size.iconSm,
    },
    swatch: { width: t.space[3], height: t.space[3], borderRadius: t.radius.full },
    legendLabel: { ...t.text.small, color: t.color.textSecondary, flex: 1 },
    legendValue: {
      ...t.text.bodyStrong,
      color: t.color.textPrimary,
      fontVariant: ["tabular-nums"],
    },
  });
