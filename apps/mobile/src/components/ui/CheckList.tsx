import type { LucideIcon } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { type Theme, useTheme, useThemedStyles } from "@/theme";

import { type Tone, toneColors } from "./tone";

export type CheckListProps = {
  items: string[];
  icon: LucideIcon;
  /** Icon colour; text always stays textPrimary. */
  tone?: Tone;
};

/** Tailoring tips, strengths, gaps. Short fixed lists, so a plain View (not a FlatList). */
export function CheckList({ items, icon: Icon, tone = "accent" }: CheckListProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const fg = toneColors(theme, tone).fg;

  return (
    <View style={styles.list} accessibilityRole="list">
      {items.map((item, i) => (
        <View key={`${i}-${item}`} style={styles.item} accessible accessibilityLabel={item}>
          <Icon size={theme.size.iconSm} color={fg} style={styles.icon} />
          <Text style={styles.text}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    list: { gap: t.space[2] },
    item: { flexDirection: "row", gap: t.space[2], alignItems: "flex-start" },
    // Nudge the 16 pt icon to sit on the first line of 22 pt body text.
    icon: { marginTop: (t.text.body.lineHeight - t.size.iconSm) / 2 },
    text: { ...t.text.body, color: t.color.textPrimary, flex: 1 },
  });
