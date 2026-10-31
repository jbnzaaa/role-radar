import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { type Theme, useThemedStyles } from "@/theme";

export type CardProps = {
  title?: string;
  description?: string;
  /** Makes the whole card pressable. */
  onPress?: () => void;
  /** Spoken name when pressable; defaults to the title. */
  accessibilityLabel?: string;
  children?: ReactNode;
};

export function Card({ title, description, onPress, accessibilityLabel, children }: CardProps) {
  const styles = useThemedStyles(makeStyles);

  const content = (
    <>
      {(title || description) && (
        <View style={styles.header}>
          {title && (
            <Text style={styles.title} accessibilityRole="header">
              {title}
            </Text>
          )}
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
      )}
      {children}
    </>
  );

  if (!onPress) return <View style={styles.card}>{content}</View>;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: t.color.surfaceCard,
      borderRadius: t.radius.lg,
      padding: t.layout.cardPadding,
      gap: t.space[3],
    },
    header: { gap: t.space[1] },
    title: { ...t.text.title, color: t.color.textPrimary },
    description: { ...t.text.small, color: t.color.textSecondary },
    pressed: { opacity: t.motion.pressedOpacity },
  });
