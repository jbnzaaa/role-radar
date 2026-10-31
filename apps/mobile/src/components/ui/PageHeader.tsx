import { ArrowLeft } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { displayMaxFontSizeMultiplier, type Theme, useThemedStyles } from "@/theme";

import { IconButton } from "./IconButton";

export type PageHeaderProps = {
  title: string;
  description?: string;
  /** Detail screens only; tab screens have no back button. */
  onBack?: () => void;
};

/** Title block for a screen. Safe-area top padding comes from the Screen wrapper, not here. */
export function PageHeader({ title, description, onBack }: PageHeaderProps) {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.header}>
      {onBack && <IconButton icon={ArrowLeft} accessibilityLabel="Back" onPress={onBack} />}
      <View style={styles.titles}>
        <Text
          style={styles.title}
          accessibilityRole="header"
          maxFontSizeMultiplier={displayMaxFontSizeMultiplier}
        >
          {title}
        </Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    header: { gap: t.space[4], paddingBottom: t.layout.titleBlockGap },
    titles: { gap: t.space[2] },
    title: { ...t.text.display, color: t.color.textDisplay },
    description: { ...t.text.body, color: t.color.textSecondary },
  });
