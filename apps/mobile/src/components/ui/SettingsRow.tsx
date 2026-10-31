import { ChevronRight } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { type Theme, useTheme, useThemedStyles } from "@/theme";

export type SettingsRowProps = {
  title: string;
  description?: string;
} & (
  | { trailing: "chevron"; onPress: () => void }
  /** Read-only value, e.g. app version. Not pressable. */
  | { trailing: { value: string }; onPress?: never }
);

export function SettingsRow(props: SettingsRowProps) {
  const { title, description, trailing } = props;
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);

  const body = (
    <>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      {trailing === "chevron" ? (
        <ChevronRight size={theme.size.icon} color={theme.color.textSecondary} />
      ) : (
        <Text style={styles.value}>{trailing.value}</Text>
      )}
    </>
  );

  if (trailing !== "chevron") {
    return (
      <View style={styles.row} accessible accessibilityLabel={`${title}: ${trailing.value}`}>
        {body}
      </View>
    );
  }

  return (
    <Pressable
      onPress={props.onPress}
      accessibilityRole="button"
      accessibilityLabel={description ? `${title}. ${description}` : title}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      {body}
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
    text: { flex: 1, gap: t.space[1] },
    title: { ...t.text.bodyStrong, color: t.color.textPrimary },
    description: { ...t.text.small, color: t.color.textSecondary },
    value: { ...t.text.body, color: t.color.textSecondary },
    pressed: { opacity: t.motion.pressedOpacity },
  });
