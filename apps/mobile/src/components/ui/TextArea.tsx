import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { type Theme, useTheme, useThemedStyles } from "@/theme";

export type TextAreaProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  /** Character limit shown in the counter; going over shows the counter in the error colour. */
  max: number;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  /** Small action at the top-right, e.g. Paste. */
  action?: { label: string; onPress: () => void };
  /** Fill the remaining height (Quick analyze); otherwise min/max height with its own scroll. */
  fill?: boolean;
};

const format = (n: number) => n.toLocaleString("en-US");

export function TextArea({
  label,
  value,
  onChangeText,
  max,
  placeholder,
  error,
  disabled = false,
  action,
  fill = false,
}: TextAreaProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [focused, setFocused] = useState(false);
  const over = value.length > max;
  const counter = `${format(value.length)} / ${format(max)}`;

  return (
    <View style={[styles.wrap, fill && styles.fill]}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {action && (
          <Pressable
            onPress={action.onPress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={action.label}
            style={({ pressed }) => [styles.action, pressed && styles.pressed]}
          >
            <Text style={styles.actionLabel}>{action.label}</Text>
          </Pressable>
        )}
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.color.textSecondary}
        editable={!disabled}
        multiline
        textAlignVertical="top"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={label}
        accessibilityHint={counter}
        style={[
          styles.input,
          fill ? styles.fill : styles.bounded,
          focused && styles.focused,
          (error || over) && styles.errorBorder,
          disabled && styles.disabled,
        ]}
      />
      <View style={styles.footer}>
        <Text style={[styles.meta, styles.errorText]} accessibilityLiveRegion="polite">
          {error ?? ""}
        </Text>
        <Text style={[styles.meta, over && styles.errorText]}>{counter}</Text>
      </View>
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    wrap: { gap: t.space[2] },
    fill: { flex: 1 },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    label: { ...t.text.title, color: t.color.textPrimary, flexShrink: 1 },
    action: {
      minHeight: t.size.minTarget,
      justifyContent: "center",
      paddingHorizontal: t.space[3],
    },
    actionLabel: { ...t.text.bodyStrong, color: t.color.accent },
    input: {
      ...t.text.input,
      color: t.color.textPrimary,
      backgroundColor: t.color.surfaceCard,
      borderRadius: t.radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: t.color.border,
      padding: t.space[4],
    },
    bounded: { minHeight: t.size.textAreaMin, maxHeight: t.size.textAreaMax },
    focused: { borderColor: t.color.accent },
    errorBorder: { borderColor: t.color.verdictLow },
    disabled: { backgroundColor: t.color.surfaceSunken, color: t.color.textSecondary },
    footer: { flexDirection: "row", justifyContent: "space-between", gap: t.space[3] },
    meta: { ...t.text.small, color: t.color.textSecondary },
    errorText: { color: t.color.verdictLow, flexShrink: 1 },
    pressed: { opacity: t.motion.pressedOpacity },
  });
