import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { type Theme, useThemedStyles } from "@/theme";

import { Button } from "./Button";
import { Chip } from "./Chip";
import { ScoreBar } from "./ScoreBar";
import type { Tone } from "./tone";

/** A chip's text and tone. Verdict/status labels come from core labels, never retyped. */
export type ChipSpec = { label: string; tone: Tone };

type BaseProps = {
  title: string;
  /** Pre-formatted "Company · date". */
  subtitle: string;
  /** 0–100. Compact rows show "71", not "71%" (DESIGN_SYSTEM.md §7). */
  score: number;
  verdict: ChipSpec;
  /** Opens the Match analysis. */
  onPress: () => void;
};

function JobRowBase({
  title,
  subtitle,
  score,
  verdict,
  onPress,
  showBar,
  chips,
  spokenExtra,
  trailing,
}: BaseProps & {
  showBar?: boolean;
  chips: ChipSpec[];
  spokenExtra: string[];
  trailing?: ReactNode;
}) {
  const styles = useThemedStyles(makeStyles);
  const s = Math.round(score);
  const spoken = [title, subtitle, `score ${s} percent`, verdict.label, ...spokenExtra].join(", ");

  return (
    <View style={styles.row}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={spoken}
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}
      >
        <View style={styles.top}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.score}>{s}</Text>
        </View>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {showBar && <ScoreBar value={s} tone={verdict.tone} />}
        <View style={styles.chips}>
          {chips.map((c) => (
            <Chip key={c.label} label={c.label} tone={c.tone} />
          ))}
        </View>
      </Pressable>
      {trailing}
    </View>
  );
}

export type AnalysisRowProps = BaseProps & { status: ChipSpec };

/** Home → Recent analysis. */
export function AnalysisRow({ status, ...base }: AnalysisRowProps) {
  return <JobRowBase {...base} chips={[base.verdict, status]} spokenExtra={[status.label]} />;
}

export type HistoryRowProps = BaseProps & { status: ChipSpec; cvName: string };

/** History list: adds the score bar and the CV version used. */
export function HistoryRow({ status, cvName, ...base }: HistoryRowProps) {
  return (
    <JobRowBase
      {...base}
      showBar
      chips={[base.verdict, status, { label: cvName, tone: "neutral" }]}
      spokenExtra={[status.label, `CV ${cvName}`]}
    />
  );
}

export type MatchRowProps = BaseProps & {
  /** Up to 3 matched-skill labels; extras are dropped. */
  skills: string[];
  onMarkApplied?: () => void;
};

/** Top matches: score bar, matched skills and a "Mark applied" quick action. */
export function MatchRow({ skills, onMarkApplied, ...base }: MatchRowProps) {
  const top = skills.slice(0, 3);
  return (
    <JobRowBase
      {...base}
      showBar
      chips={[...top.map((label) => ({ label, tone: "accent" as const })), base.verdict]}
      spokenExtra={top.length ? [`matched ${top.join(", ")}`] : []}
      trailing={
        onMarkApplied && (
          <Button label="Mark applied" variant="secondary" size="md" onPress={onMarkApplied} />
        )
      }
    />
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    row: { gap: t.space[2] },
    main: { gap: t.space[2], paddingVertical: t.space[2] },
    top: { flexDirection: "row", alignItems: "baseline", gap: t.space[3] },
    title: { ...t.text.bodyStrong, color: t.color.textPrimary, flex: 1 },
    score: { ...t.text.bodyStrong, color: t.color.textPrimary, fontVariant: ["tabular-nums"] },
    subtitle: { ...t.text.small, color: t.color.textSecondary },
    chips: { flexDirection: "row", flexWrap: "wrap", gap: t.space[2] },
    pressed: { opacity: t.motion.pressedOpacity },
  });
