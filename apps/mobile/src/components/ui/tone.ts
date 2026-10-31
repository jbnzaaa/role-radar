import type { Theme } from "@/theme";

/** Meaning-based colour pairs shared by Chip, ScoreBar and other primitives. */
export type Tone = "neutral" | "strong" | "good" | "partial" | "low" | "met" | "missing" | "accent";

export function toneColors(theme: Theme, tone: Tone): { fg: string; bg: string } {
  const c = theme.color;
  switch (tone) {
    case "strong":
    case "met":
      return { fg: c.verdictStrong, bg: c.verdictStrongBg };
    case "good":
      return { fg: c.verdictGood, bg: c.verdictGoodBg };
    case "partial":
      return { fg: c.verdictPartial, bg: c.verdictPartialBg };
    case "low":
    case "missing":
      return { fg: c.verdictLow, bg: c.verdictLowBg };
    case "accent":
      return { fg: c.accent, bg: c.accentSubtle };
    case "neutral":
      return { fg: c.textSecondary, bg: c.surfaceSunken };
  }
}
