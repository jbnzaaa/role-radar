import { StyleSheet, Text, View } from "react-native";

import { displayMaxFontSizeMultiplier, type Theme, useThemedStyles } from "@/theme";

import { Avatar } from "./Avatar";

export type HomeHeaderProps = {
  /** First name for the greeting. */
  name: string;
  subtitle: string;
  avatarUri?: string;
};

export function HomeHeader({ name, subtitle, avatarUri }: HomeHeaderProps) {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.header}>
      <View style={styles.titles}>
        <Text
          style={styles.title}
          accessibilityRole="header"
          maxFontSizeMultiplier={displayMaxFontSizeMultiplier}
        >
          {`Hello, ${name}`}
        </Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Avatar name={name} uri={avatarUri} />
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: t.space[3],
      paddingBottom: t.layout.titleBlockGap,
    },
    titles: { flex: 1, gap: t.space[2] },
    title: { ...t.text.display, color: t.color.textDisplay },
    subtitle: { ...t.text.body, color: t.color.textSecondary },
  });
