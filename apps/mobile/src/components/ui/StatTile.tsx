import { StyleSheet, Text, View } from "react-native";

import { displayMaxFontSizeMultiplier, type Theme, useThemedStyles } from "@/theme";

export type StatTileProps = {
  value: string;
  label: string;
};

/** Big number + label, e.g. History overview. Read as one element: "12, Analyses". */
export function StatTile({ value, label }: StatTileProps) {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.tile} accessible accessibilityLabel={`${value}, ${label}`}>
      <Text style={styles.value} maxFontSizeMultiplier={displayMaxFontSizeMultiplier}>
        {value}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    tile: {
      flex: 1,
      backgroundColor: t.color.surfaceSunken,
      borderRadius: t.radius.md,
      padding: t.space[3],
      gap: t.space[1],
    },
    value: { ...t.text.stat, color: t.color.textPrimary },
    label: { ...t.text.small, color: t.color.textSecondary },
  });
