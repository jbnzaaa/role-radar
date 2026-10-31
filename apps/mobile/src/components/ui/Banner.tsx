import { Info, type LucideIcon, TriangleAlert } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { type Theme, useTheme, useThemedStyles } from "@/theme";

import { toneColors } from "./tone";

export type BannerProps = {
  tone?: "info" | "warning";
  message: string;
  /** Overrides the tone's default icon, e.g. WifiOff for offline. */
  icon?: LucideIcon;
};

export function Banner({ tone = "info", message, icon }: BannerProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { fg, bg } = toneColors(theme, tone === "warning" ? "partial" : "accent");
  const Icon = icon ?? (tone === "warning" ? TriangleAlert : Info);

  return (
    <View
      style={[styles.banner, { backgroundColor: bg }]}
      accessible
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      accessibilityLabel={message}
    >
      <Icon size={theme.size.iconSm} color={fg} style={styles.icon} />
      <Text style={[styles.message, { color: fg }]}>{message}</Text>
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    banner: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: t.space[2],
      padding: t.space[3],
      borderRadius: t.radius.md,
    },
    icon: { marginTop: (t.text.small.lineHeight - t.size.iconSm) / 2 },
    message: { ...t.text.small, flex: 1 },
  });
