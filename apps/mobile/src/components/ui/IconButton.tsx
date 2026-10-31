import type { LucideIcon } from "lucide-react-native";
import { Pressable, StyleSheet } from "react-native";

import { type Theme, useTheme, useThemedStyles } from "@/theme";

export type IconButtonProps = {
  icon: LucideIcon;
  /** Required: icon-only buttons need a spoken name. */
  accessibilityLabel: string;
  onPress: () => void;
  variant?: "surface" | "plain";
  disabled?: boolean;
};

export function IconButton({
  icon: Icon,
  accessibilityLabel,
  onPress,
  variant = "surface",
  disabled = false,
}: IconButtonProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  // Visual size is 40; hitSlop brings the touch target to 44.
  const slop = (theme.size.minTarget - theme.size.backButton) / 2;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={slop}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        variant === "surface" && styles.surface,
        pressed && styles.pressed,
      ]}
    >
      <Icon
        size={theme.size.icon}
        color={disabled ? theme.color.borderStrong : theme.color.textPrimary}
      />
    </Pressable>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    base: {
      width: t.size.backButton,
      height: t.size.backButton,
      borderRadius: t.radius.full,
      alignItems: "center",
      justifyContent: "center",
    },
    surface: { backgroundColor: t.color.surfaceCard },
    pressed: { opacity: t.motion.pressedOpacity },
  });
