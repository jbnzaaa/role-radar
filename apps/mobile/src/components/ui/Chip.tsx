import { StyleSheet, Text, View } from "react-native";

import { type Theme, useTheme, useThemedStyles } from "@/theme";

import { type Tone, toneColors } from "./tone";

export type ChipProps = {
  label: string;
  tone?: Tone;
};

/** Small label for verdicts, statuses and keywords. Always carries text, never colour alone. */
export function Chip({ label, tone = "neutral" }: ChipProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { fg, bg } = toneColors(theme, tone);

  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: fg }]}>{label}</Text>
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    chip: {
      alignSelf: "flex-start",
      borderRadius: t.radius.full,
      paddingHorizontal: t.space[3],
      paddingVertical: t.space[1],
    },
    label: t.text.caption,
  });
