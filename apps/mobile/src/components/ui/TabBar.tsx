import { type LucideIcon, Plus } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { type Theme, useTheme, useThemedStyles } from "@/theme";

export type TabBarItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  onPress: () => void;
};

export type TabBarButtonProps = Omit<TabBarItem, "key">;

export function TabBarButton({ label, icon: Icon, active, onPress }: TabBarButtonProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const fg = active ? theme.color.accent : theme.color.textSecondary;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
    >
      <View style={[styles.iconPill, active && styles.iconPillActive]}>
        <Icon size={theme.size.icon} color={fg} />
      </View>
      {/* Label on every tab, not only the active one (DESIGN_SYSTEM.md §8). */}
      <Text style={[styles.label, { color: fg }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

export type AddButtonProps = {
  onPress: () => void;
  accessibilityLabel: string;
};

export function AddButton({ onPress, accessibilityLabel }: AddButtonProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.add, pressed && styles.pressed]}
    >
      <Plus size={theme.size.icon} color={theme.color.actionPrimaryText} />
    </Pressable>
  );
}

export type TabBarProps = {
  /** Four tabs; the add button sits between the second and third. */
  tabs: [TabBarItem, TabBarItem, TabBarItem, TabBarItem];
  onAddPress: () => void;
  addLabel: string;
};

export function TabBar({ tabs, onAddPress, addLabel }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(makeStyles);
  const [a, b, c, d] = tabs;
  const render = ({ key, ...item }: TabBarItem) => <TabBarButton key={key} {...item} />;

  return (
    <View accessibilityRole="tablist" style={[styles.bar, { paddingBottom: insets.bottom }]}>
      {render(a)}
      {render(b)}
      <View style={styles.addSlot}>
        <AddButton onPress={onAddPress} accessibilityLabel={addLabel} />
      </View>
      {render(c)}
      {render(d)}
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    bar: {
      flexDirection: "row",
      alignItems: "center",
      minHeight: t.size.tabBar,
      backgroundColor: t.color.surfaceCard,
      paddingHorizontal: t.space[2],
      ...t.shadow.raised,
    },
    tab: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      minHeight: t.size.minTarget,
      paddingVertical: t.space[2],
      gap: t.space[1],
    },
    iconPill: {
      borderRadius: t.radius.full,
      paddingHorizontal: t.space[4],
      paddingVertical: t.space[1],
    },
    iconPillActive: { backgroundColor: t.color.accentSubtle },
    label: t.text.caption,
    addSlot: { flex: 1, alignItems: "center", justifyContent: "center" },
    add: {
      width: t.size.addButton,
      height: t.size.addButton,
      borderRadius: t.radius.full,
      backgroundColor: t.color.actionPrimary,
      alignItems: "center",
      justifyContent: "center",
    },
    pressed: { opacity: t.motion.pressedOpacity },
  });
