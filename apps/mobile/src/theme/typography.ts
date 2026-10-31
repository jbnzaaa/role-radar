// Text styles from reference/DESIGN_SYSTEM.md §3. Font: Inter (body and display).
// With custom fonts each weight is its own family, so styles set fontFamily, not fontWeight.
// Per-weight imports: the package root would bundle all 18 Inter files.
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_500Medium } from "@expo-google-fonts/inter/500Medium";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { Inter_700Bold } from "@expo-google-fonts/inter/700Bold";
// Google sign-in button label must use Roboto Medium (Google branding guidelines).
import { Roboto_500Medium } from "@expo-google-fonts/roboto/500Medium";
import type { TextStyle } from "react-native";

/** Pass to `useFonts` in the root layout. */
export const fontAssets = {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Roboto_500Medium,
};

export const fontFamily = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semibold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
  googleButton: "Roboto_500Medium",
} as const;

/** Only display text and big score numbers cap Dynamic Type (DESIGN_SYSTEM.md §3). */
export const displayMaxFontSizeMultiplier = 1.3;

const numbers: TextStyle = { fontVariant: ["tabular-nums"] };
// Android adds extra top padding to large text; drop it for consistent alignment.
const display: TextStyle = { includeFontPadding: false };

export const text = {
  display: { fontFamily: fontFamily.bold, fontSize: 40, lineHeight: 44, ...display },
  scoreXl: {
    fontFamily: fontFamily.semibold,
    fontSize: 48,
    lineHeight: 52,
    ...numbers,
    ...display,
  },
  scoreLg: {
    fontFamily: fontFamily.semibold,
    fontSize: 40,
    lineHeight: 44,
    ...numbers,
    ...display,
  },
  stat: { fontFamily: fontFamily.semibold, fontSize: 24, lineHeight: 30, ...numbers },
  title: { fontFamily: fontFamily.semibold, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: fontFamily.semibold, fontSize: 15, lineHeight: 22 },
  small: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fontFamily.medium, fontSize: 12, lineHeight: 16 },
  input: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 22 },
  /** Google branding spec for the sign-in button label. */
  googleButton: { fontFamily: fontFamily.googleButton, fontSize: 14, lineHeight: 20 },
} as const satisfies Record<string, TextStyle>;
