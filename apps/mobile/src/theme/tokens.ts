// Design tokens. Values come from reference/DESIGN_SYSTEM.md §2 and §4 — keep the two in sync.
// Components never use these primitives directly; they use the semantic tokens via useTheme().
import { Platform } from "react-native";

export const primitives = {
  neutral: {
    0: "#FFFFFF",
    50: "#FAFAFA",
    100: "#F4F4F5",
    200: "#E4E4E7",
    300: "#D4D4D8",
    500: "#71717A",
    600: "#52525B",
    700: "#3F3F46",
    900: "#18181B",
  },
  accent: { 50: "#EEF2FF", 600: "#4F46E5", 700: "#4338CA" },
  green: { 50: "#F0FDF4", 700: "#15803D" },
  blue: { 50: "#EFF6FF", 700: "#1D4ED8" },
  amber: { 50: "#FFFBEB", 700: "#B45309" },
  red: { 50: "#FEF2F2", 700: "#B91C1C" },
} as const;

const p = primitives;

export const color = {
  bgPage: p.neutral[50],
  surfaceCard: p.neutral[0],
  surfaceSunken: p.neutral[100],
  border: p.neutral[200],
  borderStrong: p.neutral[300],
  textPrimary: p.neutral[900],
  textSecondary: p.neutral[600],
  textDisplay: p.neutral[700],
  actionPrimary: p.neutral[900],
  actionPrimaryText: p.neutral[0],
  accent: p.accent[700],
  accentSubtle: p.accent[50],
  verdictStrong: p.green[700],
  verdictStrongBg: p.green[50],
  verdictGood: p.blue[700],
  verdictGoodBg: p.blue[50],
  verdictPartial: p.amber[700],
  verdictPartialBg: p.amber[50],
  verdictLow: p.red[700],
  verdictLowBg: p.red[50],
} as const;

export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48 } as const;

export const radius = { sm: 8, md: 12, lg: 20, full: 999 } as const;

// Fixed sizes from DESIGN_SYSTEM.md §4 → Layout.
export const size = {
  minTarget: 44,
  buttonLg: 52,
  buttonMd: 44,
  backButton: 40,
  tabBar: 64,
  addButton: 52,
  icon: 24,
  iconSm: 16,
  bar: 8,
  gaugeLg: 220,
  gaugeMd: 160,
  textAreaMin: 160,
  textAreaMax: 320,
} as const;

export const opacity = {
  /** Gauge bands are verdict colours at reduced strength (DESIGN_SYSTEM.md §2.2). */
  band: 0.3,
} as const;

// Named layout spacing from DESIGN_SYSTEM.md §4 → Layout.
export const layout = {
  screenPadding: space[5],
  cardGap: space[2],
  cardPadding: space[4],
  titleBlockGap: space[6],
} as const;

export const shadow = {
  // Tab bar and sheets. The one place platform shadow differences live.
  raised: Platform.select({
    ios: {
      shadowColor: p.neutral[900],
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: -2 },
    },
    default: { elevation: 8 },
  }),
} as const;

export const motion = {
  fast: 120,
  base: 200,
  pressedOpacity: 0.7,
} as const;
