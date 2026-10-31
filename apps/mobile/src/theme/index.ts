import { createContext, useContext } from "react";

import { color, layout, motion, radius, shadow, size, space } from "./tokens";
import { text } from "./typography";

export type Theme = {
  color: Record<keyof typeof color, string>;
  space: typeof space;
  radius: typeof radius;
  size: typeof size;
  layout: typeof layout;
  shadow: typeof shadow;
  motion: typeof motion;
  text: typeof text;
};

export const lightTheme: Theme = { color, space, radius, size, layout, shadow, motion, text };

// Light only for now; dark mode later swaps the value here, not the components.
const ThemeContext = createContext<Theme>(lightTheme);

export const ThemeProvider = ThemeContext.Provider;

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

export { displayMaxFontSizeMultiplier, fontAssets, fontFamily } from "./typography";
