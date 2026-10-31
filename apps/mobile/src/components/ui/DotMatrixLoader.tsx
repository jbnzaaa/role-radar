import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { type Theme, useTheme, useThemedStyles } from "@/theme";

export type DotMatrixLoaderProps = {
  rows?: number;
  cols?: number;
};

function Dot({ index, total, animate }: { index: number; total: number; animate: boolean }) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const opacity = useSharedValue<number>(theme.opacity.dotIdle);

  useEffect(() => {
    if (!animate) {
      opacity.value = theme.opacity.dotIdle;
      return;
    }
    // A diagonal wave: each dot lights up a little after the previous one.
    const loop = theme.motion.loaderLoop;
    const half = loop / 4;
    opacity.value = withDelay(
      (index / total) * (loop / 2),
      withRepeat(
        withSequence(
          withTiming(1, { duration: half }),
          withTiming(theme.opacity.dotIdle, { duration: half }),
          withTiming(theme.opacity.dotIdle, { duration: loop - 2 * half }),
        ),
        -1,
      ),
    );
    return () => cancelAnimation(opacity);
  }, [animate, index, total, opacity, theme]);

  const animated = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[styles.dot, animated]} />;
}

/** Decorative; the screen announces progress text separately. Static with Reduce Motion. */
export function DotMatrixLoader({ rows = 5, cols = 7 }: DotMatrixLoaderProps) {
  const styles = useThemedStyles(makeStyles);
  const reduceMotion = useReducedMotion();
  const total = rows + cols - 2 || 1;

  return (
    <View
      style={styles.grid}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      testID="dot-matrix-loader"
    >
      {Array.from({ length: rows }, (_, r) => (
        <View key={r} style={styles.row}>
          {Array.from({ length: cols }, (_, c) => (
            <Dot key={c} index={r + c} total={total} animate={!reduceMotion} />
          ))}
        </View>
      ))}
    </View>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    grid: { gap: t.space[2], alignSelf: "center" },
    row: { flexDirection: "row", gap: t.space[2] },
    dot: {
      width: t.space[3],
      height: t.space[3],
      borderRadius: t.radius.full,
      backgroundColor: t.color.accent,
    },
  });
