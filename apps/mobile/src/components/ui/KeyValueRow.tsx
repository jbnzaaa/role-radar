import { StyleSheet, Text, View } from "react-native";

import { type Theme, useThemedStyles } from "@/theme";

export type KeyValueRowProps = {
  label: string;
  value: string;
};

/** Label on the left, value on the right; wraps instead of clipping at large text sizes. */
export function KeyValueRow({ label, value }: KeyValueRowProps) {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.row} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "baseline",
      columnGap: t.space[3],
      rowGap: t.space[1],
    },
    label: { ...t.text.small, color: t.color.textSecondary, flexShrink: 1 },
    value: { ...t.text.bodyStrong, color: t.color.textPrimary, flexShrink: 1, textAlign: "right" },
  });
