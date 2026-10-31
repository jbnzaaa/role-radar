import { StyleSheet, View } from "react-native";

import { type Theme, useTheme, useThemedStyles } from "@/theme";

import { type Tone, toneColors } from "./tone";

export type ScoreBarProps = {
  /** 0–100; values outside are clamped. */
  value: number;
  tone?: Tone;
  /** Spoken name, e.g. "Match score". */
  accessibilityLabel?: string;
};

export function ScoreBar({ value, tone = "accent", accessibilityLabel }: ScoreBarProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const pct = Math.round(Math.min(100, Math.max(0, value)));

  return (
    <View
      style={styles.track}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: pct, text: `${pct}%` }}
    >
      <View
        style={[styles.fill, { width: `${pct}%`, backgroundColor: toneColors(theme, tone).fg }]}
      />
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    track: {
      height: t.size.bar,
      borderRadius: t.radius.full,
      backgroundColor: t.color.surfaceSunken,
      overflow: "hidden",
    },
    fill: { height: "100%", borderRadius: t.radius.full },
  });
