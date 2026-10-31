import { Pencil } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { type Theme, useTheme, useThemedStyles } from "@/theme";

import { Chip } from "./Chip";

export type VersionRowProps = {
  name: string;
  /** Exactly one version is active. */
  active: boolean;
  /** Pre-formatted date, e.g. "30 Oct 2026". */
  savedAt: string;
  /** Opens /cv-version/[id] (rename, set active, delete). */
  onPress: () => void;
};

export function VersionRow({ name, active, savedAt, onPress }: VersionRowProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const saved = `Saved ${savedAt}`;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={[name, active ? "Active" : null, saved].filter(Boolean).join(", ")}
      accessibilityHint="Rename, set active or delete"
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.body}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.chips}>
          {active && <Chip label="Active" tone="accent" />}
          <Chip label={saved} />
        </View>
      </View>
      <Pencil size={theme.size.iconSm} color={theme.color.textSecondary} />
    </Pressable>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: t.space[3],
      minHeight: t.size.minTarget,
      paddingVertical: t.space[3],
    },
    body: { flex: 1, gap: t.space[2] },
    name: { ...t.text.bodyStrong, color: t.color.textPrimary },
    chips: { flexDirection: "row", flexWrap: "wrap", gap: t.space[2] },
    pressed: { opacity: t.motion.pressedOpacity },
  });
