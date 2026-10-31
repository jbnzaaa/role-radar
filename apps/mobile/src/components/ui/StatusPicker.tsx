import * as Haptics from "expo-haptics";
import { Check, ChevronDown } from "lucide-react-native";
import { useState } from "react";
import { ActionSheetIOS, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { type Theme, useTheme, useThemedStyles } from "@/theme";

import { BottomSheet } from "./BottomSheet";

export type StatusOption<T extends string> = { value: T; label: string };

export type StatusPickerProps<T extends string> = {
  /** Sheet title and spoken name, e.g. "Application status". */
  title: string;
  value: T;
  /** Labels come from core labels, never retyped. */
  options: StatusOption<T>[];
  onChange: (value: T) => void;
};

/** Native action sheet on iOS, our BottomSheet elsewhere (the one platform switch for pickers). */
const useNativeSheet = Platform.select({ ios: true, default: false });

export function StatusPicker<T extends string>({
  title,
  value,
  options,
  onChange,
}: StatusPickerProps<T>) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value)?.label ?? value;

  const choose = (next: T) => {
    setOpen(false);
    if (next === value) return;
    void Haptics.selectionAsync();
    onChange(next);
  };

  const show = () => {
    if (!useNativeSheet) return setOpen(true);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title,
        options: [...options.map((o) => o.label), "Cancel"],
        cancelButtonIndex: options.length,
      },
      (i) => {
        const picked = options[i];
        if (picked) choose(picked.value);
      },
    );
  };

  return (
    <>
      <Pressable
        onPress={show}
        accessibilityRole="button"
        accessibilityLabel={`${title}: ${current}`}
        accessibilityHint="Opens a list to change it"
        style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}
      >
        <Text style={styles.triggerLabel}>{current}</Text>
        <ChevronDown size={theme.size.iconSm} color={theme.color.textSecondary} />
      </Pressable>

      {!useNativeSheet && (
        <BottomSheet title={title} visible={open} onClose={() => setOpen(false)}>
          <View accessibilityRole="radiogroup">
            {options.map((o) => {
              const selected = o.value === value;
              return (
                <Pressable
                  key={o.value}
                  onPress={() => choose(o.value)}
                  accessibilityRole="radio"
                  accessibilityLabel={o.label}
                  accessibilityState={{ checked: selected }}
                  style={({ pressed }) => [styles.option, pressed && styles.pressed]}
                >
                  <Text style={[styles.optionLabel, selected && styles.optionSelected]}>
                    {o.label}
                  </Text>
                  {selected && <Check size={theme.size.icon} color={theme.color.accent} />}
                </Pressable>
              );
            })}
          </View>
        </BottomSheet>
      )}
    </>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    trigger: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      gap: t.space[2],
      minHeight: t.size.minTarget,
      paddingHorizontal: t.space[4],
      borderRadius: t.radius.full,
      backgroundColor: t.color.surfaceSunken,
    },
    triggerLabel: { ...t.text.bodyStrong, color: t.color.textPrimary },
    option: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: t.size.minTarget,
      paddingVertical: t.space[2],
    },
    optionLabel: { ...t.text.body, color: t.color.textPrimary },
    optionSelected: { ...t.text.bodyStrong, color: t.color.accent },
    pressed: { opacity: t.motion.pressedOpacity },
  });
