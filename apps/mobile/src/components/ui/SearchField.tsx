import { Search, X } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { type Theme, useTheme, useThemedStyles } from "@/theme";

export type SearchFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
};

export function SearchField({ value, onChangeText, placeholder }: SearchFieldProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [focused, setFocused] = useState(false);
  const slop = (theme.size.minTarget - theme.size.icon) / 2;

  return (
    <View style={[styles.field, focused && styles.focused]}>
      <Search size={theme.size.iconSm} color={theme.color.textSecondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.color.textSecondary}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        returnKeyType="search"
        autoCorrect={false}
        accessibilityLabel={placeholder}
        style={styles.input}
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText("")}
          hitSlop={slop}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          style={({ pressed }) => pressed && styles.pressed}
        >
          <X size={theme.size.icon} color={theme.color.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    field: {
      flexDirection: "row",
      alignItems: "center",
      gap: t.space[2],
      minHeight: t.size.minTarget,
      paddingHorizontal: t.space[4],
      borderRadius: t.radius.full,
      backgroundColor: t.color.surfaceCard,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: t.color.border,
    },
    focused: { borderColor: t.color.accent },
    input: { ...t.text.input, color: t.color.textPrimary, flex: 1, paddingVertical: t.space[2] },
    pressed: { opacity: t.motion.pressedOpacity },
  });
