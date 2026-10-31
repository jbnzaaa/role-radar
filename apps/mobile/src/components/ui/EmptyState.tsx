import { StyleSheet, Text, View } from "react-native";

import { type Theme, useThemedStyles } from "@/theme";

import { Button } from "./Button";

export type EmptyStateProps = {
  title: string;
  body: string;
  action?: { label: string; onPress: () => void };
};

export function EmptyState({ title, body, action }: EmptyStateProps) {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Text style={styles.body}>{body}</Text>
      {action && <Button label={action.label} onPress={action.onPress} size="md" />}
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    wrap: { alignItems: "center", gap: t.space[3], paddingVertical: t.space[8] },
    title: { ...t.text.title, color: t.color.textPrimary, textAlign: "center" },
    body: { ...t.text.body, color: t.color.textSecondary, textAlign: "center" },
  });
