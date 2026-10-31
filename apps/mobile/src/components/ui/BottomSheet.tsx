import type { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { type Theme, useThemedStyles } from "@/theme";

export type BottomSheetProps = {
  title: string;
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function BottomSheet({ title, visible, onClose, children }: BottomSheetProps) {
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();

  return (
    <Modal
      visible={visible}
      transparent
      animationType={reduceMotion ? "none" : "slide"}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        />
        <View
          style={[styles.sheet, { paddingBottom: insets.bottom + styles.sheet.padding }]}
          accessibilityViewIsModal
          // VoiceOver escape gesture (two-finger Z); the backdrop is hidden from screen readers.
          onAccessibilityEscape={onClose}
        >
          <View style={styles.handle} />
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    root: { flex: 1, justifyContent: "flex-end" },
    backdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: t.color.textPrimary,
      opacity: t.opacity.backdrop,
    },
    sheet: {
      backgroundColor: t.color.surfaceCard,
      borderTopLeftRadius: t.radius.lg,
      borderTopRightRadius: t.radius.lg,
      padding: t.space[5],
      gap: t.space[3],
      ...t.shadow.raised,
    },
    handle: {
      alignSelf: "center",
      width: t.space[10],
      height: t.space[1],
      borderRadius: t.radius.full,
      backgroundColor: t.color.borderStrong,
    },
    title: { ...t.text.title, color: t.color.textPrimary },
  });
