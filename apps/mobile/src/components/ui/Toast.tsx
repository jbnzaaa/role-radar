import { CircleAlert, CircleCheck, Info, type LucideIcon } from "lucide-react-native";
import { useEffect } from "react";
import { AccessibilityInfo, StyleSheet, Text } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { type Theme, useTheme, useThemedStyles } from "@/theme";

export type ToastTone = "success" | "info" | "error";

export type ToastProps = {
  message: string;
  tone?: ToastTone;
};

const ICON: Record<ToastTone, LucideIcon> = {
  success: CircleCheck,
  info: Info,
  error: CircleAlert,
};

/** Presentational toast; showing/hiding and timing live in the root toast host (P2-06). */
export function Toast({ message, tone = "success" }: ToastProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const reduceMotion = useReducedMotion();
  const Icon = ICON[tone];

  useEffect(() => {
    // iOS; Android reads the live region below.
    AccessibilityInfo.announceForAccessibility(message);
  }, [message]);

  return (
    <Animated.View
      entering={reduceMotion ? undefined : FadeInDown.duration(theme.motion.base)}
      exiting={reduceMotion ? undefined : FadeOutDown.duration(theme.motion.base)}
      style={styles.toast}
      accessible
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      accessibilityLabel={message}
    >
      <Icon size={theme.size.iconSm} color={theme.color.actionPrimaryText} />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    toast: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "center",
      gap: t.space[2],
      paddingVertical: t.space[3],
      paddingHorizontal: t.space[4],
      borderRadius: t.radius.full,
      backgroundColor: t.color.actionPrimary,
      ...t.shadow.raised,
    },
    message: { ...t.text.bodyStrong, color: t.color.actionPrimaryText, flexShrink: 1 },
  });
