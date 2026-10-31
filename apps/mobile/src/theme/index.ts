import { createContext, useContext, useMemo } from "react";

import { brand, color, layout, motion, opacity, radius, shadow, size, space } from "./tokens";
import { text } from "./typography";

export type Theme = {
  color: Record<keyof typeof color, string>;
  brand: typeof brand;
  space: typeof space;
  radius: typeof radius;
  size: typeof size;
  layout: typeof layout;
  shadow: typeof shadow;
  motion: typeof motion;
  opacity: typeof opacity;
  text: typeof text;
};

export const lightTheme: Theme = {
  color,
  brand,
  space,
  radius,
  size,
  layout,
  shadow,
  motion,
  opacity,
  text,
};

// Light only for now; dark mode later swaps the value here, not the components.
const ThemeContext = createContext<Theme>(lightTheme);

export const ThemeProvider = ThemeContext.Provider;

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

/**
 * Build a StyleSheet from the theme. Define `factory` at module scope so it stays stable:
 * `const makeStyles = (t: Theme) => StyleSheet.create({ ... });`
 */
export function useThemedStyles<T>(factory: (theme: Theme) => T): T {
  const theme = useTheme();
  return useMemo(() => factory(theme), [factory, theme]);
}

export { displayMaxFontSizeMultiplier, fontAssets, fontFamily } from "./typography";
