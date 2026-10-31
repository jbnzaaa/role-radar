import { CircleCheck, CircleDot, CircleX, type LucideIcon } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { type Theme, useTheme, useThemedStyles } from "@/theme";

import { Chip } from "./Chip";
import { type Tone, toneColors } from "./tone";

export type RequirementStatus = "met" | "partial" | "missing";
export type RequirementImportance = "must-have" | "nice-to-have";

// TODO(P2-05): move these labels to core labels.ts once it exists.
const STATUS: Record<RequirementStatus, { label: string; tone: Tone; icon: LucideIcon }> = {
  met: { label: "Met", tone: "met", icon: CircleCheck },
  partial: { label: "Partial", tone: "partial", icon: CircleDot },
  missing: { label: "Missing", tone: "missing", icon: CircleX },
};

export type RequirementRowProps = {
  title: string;
  evidence: string;
  status: RequirementStatus;
  importance: RequirementImportance;
};

export function RequirementRow({ title, evidence, status, importance }: RequirementRowProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { label, tone, icon: Icon } = STATUS[status];
  const spoken = `${title}, ${label}${importance === "nice-to-have" ? ", nice to have" : ""}. ${evidence}`;

  return (
    <View style={styles.row} accessible accessibilityLabel={spoken}>
      <Icon size={theme.size.icon} color={toneColors(theme, tone).fg} />
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.evidence}>{evidence}</Text>
        <Chip label={label} tone={tone} />
      </View>
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    row: { flexDirection: "row", gap: t.space[3], paddingVertical: t.space[2] },
    body: { flex: 1, gap: t.space[1] },
    title: { ...t.text.bodyStrong, color: t.color.textPrimary },
    evidence: { ...t.text.small, color: t.color.textSecondary },
  });
