import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { type Theme, useTheme, useThemedStyles } from "@/theme";

export type GoogleSignInButtonProps = {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

/** Official Google "G" mark (48 × 48 artboard). */
function GoogleG({ size }: { size: number }) {
  const { brand } = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" accessibilityElementsHidden>
      <Path
        fill={brand.googleRed}
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <Path
        fill={brand.googleBlue}
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <Path
        fill={brand.googleYellow}
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <Path
        fill={brand.googleGreen}
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </Svg>
  );
}

/** "Continue with Google", light style per Google's sign-in branding guidelines. */
export function GoogleSignInButton({
  onPress,
  loading = false,
  disabled = false,
}: GoogleSignInButtonProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const inactive = disabled || loading;
  const label = "Continue with Google";

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        inactive && styles.inactive,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={theme.brand.googleText} />
        ) : (
          <GoogleG size={theme.size.googleLogo} />
        )}
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
}

const makeStyles = (t: Theme) =>
  StyleSheet.create({
    button: {
      alignSelf: "stretch",
      minHeight: t.size.buttonLg,
      justifyContent: "center",
      paddingHorizontal: t.space[4],
      borderRadius: t.radius.full,
      backgroundColor: t.brand.googleFill,
      borderWidth: StyleSheet.hairlineWidth * 2,
      borderColor: t.brand.googleStroke,
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: t.space[3],
    },
    label: { ...t.text.googleButton, color: t.brand.googleText, flexShrink: 1 },
    inactive: { opacity: t.motion.pressedOpacity },
    pressed: { opacity: t.motion.pressedOpacity },
  });
