import type { LucideIcon } from "lucide-react-native";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { type Theme, useTheme, useThemedStyles } from "@/theme";

export type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "lg" | "md";
  icon?: LucideIcon;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "lg",
  icon: Icon,
  fullWidth = false,
  disabled = false,
  loading = false,
}: ButtonProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const inactive = disabled || loading;

  const fg = inactive
    ? theme.color.textSecondary
    : variant === "primary"
      ? theme.color.actionPrimaryText
      : theme.color.textPrimary;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        size === "lg" ? styles.lg : styles.md,
        styles[variant],
        inactive && variant !== "ghost" && styles.inactive,
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={fg} />
        ) : (
          Icon && <Icon size={theme.size.icon} color={fg} />
        )}
        <Text style={[styles.label, { color: fg }]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    base: {
      borderRadius: t.radius.full,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: t.space[6],
      paddingVertical: t.space[2],
    },
    // minHeight, not height, so the label can grow with large system text.
    lg: { minHeight: t.size.buttonLg },
    md: { minHeight: t.size.buttonMd },
    primary: { backgroundColor: t.color.actionPrimary },
    secondary: {
      backgroundColor: t.color.surfaceCard,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: t.color.borderStrong,
    },
    ghost: { backgroundColor: "transparent" },
    inactive: { backgroundColor: t.color.surfaceSunken, borderColor: t.color.surfaceSunken },
    fullWidth: { alignSelf: "stretch" },
    pressed: { opacity: t.motion.pressedOpacity },
    content: {
      flexDirection: "row",
      alignItems: "center",
      gap: t.space[2],
    },
    label: { ...t.text.title, textAlign: "center", flexShrink: 1 },
  });
