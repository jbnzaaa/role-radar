import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { type Theme, useTheme, useThemedStyles } from "@/theme";

export type AvatarProps = {
  name: string;
  /** Google photo URL. Falls back to initials when missing or it fails to load (e.g. offline). */
  uri?: string;
  size?: "sm" | "lg";
};

export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase() || "?";
}

export function Avatar({ name, uri, size = "sm" }: AvatarProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [failed, setFailed] = useState(false);
  const d = size === "lg" ? theme.size.avatarLg : theme.size.avatarSm;
  const box = { width: d, height: d };

  if (uri && !failed) {
    return (
      <Image
        source={{ uri }}
        onError={() => setFailed(true)}
        style={[styles.base, box]}
        accessibilityIgnoresInvertColors
        accessibilityLabel={name}
      />
    );
  }

  return (
    <View style={[styles.base, styles.fallback, box]} accessible accessibilityLabel={name}>
      <Text style={size === "lg" ? styles.initialsLg : styles.initialsSm}>{initials(name)}</Text>
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    base: { borderRadius: t.radius.full },
    fallback: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: t.color.accentSubtle,
    },
    initialsSm: { ...t.text.bodyStrong, color: t.color.accent },
    initialsLg: { ...t.text.stat, color: t.color.accent },
  });
