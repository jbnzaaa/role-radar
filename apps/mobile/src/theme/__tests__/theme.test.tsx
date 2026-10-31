import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { lightTheme, useTheme } from "@/theme";
import { color } from "@/theme/tokens";

// WCAG 2.x relative luminance and contrast ratio.
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

describe("colour contrast (DESIGN_SYSTEM.md §2.2, §8: text ≥ 4.5:1)", () => {
  const textPairs: [string, string, string][] = [
    ["textPrimary on bgPage", color.textPrimary, color.bgPage],
    ["textPrimary on surfaceCard", color.textPrimary, color.surfaceCard],
    ["textSecondary on surfaceCard", color.textSecondary, color.surfaceCard],
    ["textSecondary on surfaceSunken", color.textSecondary, color.surfaceSunken],
    ["textDisplay on bgPage", color.textDisplay, color.bgPage],
    ["actionPrimaryText on actionPrimary", color.actionPrimaryText, color.actionPrimary],
    ["accent on surfaceCard", color.accent, color.surfaceCard],
    ["accent on accentSubtle", color.accent, color.accentSubtle],
    ["verdictStrong on its Bg", color.verdictStrong, color.verdictStrongBg],
    ["verdictGood on its Bg", color.verdictGood, color.verdictGoodBg],
    ["verdictPartial on its Bg", color.verdictPartial, color.verdictPartialBg],
    ["verdictLow on its Bg", color.verdictLow, color.verdictLowBg],
  ];

  it.each(textPairs)("%s", (_name, fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("typography", () => {
  it("has no text style below 12", () => {
    for (const style of Object.values(lightTheme.text)) {
      expect(style.fontSize).toBeGreaterThanOrEqual(12);
    }
  });
});

describe("useTheme", () => {
  it("returns the light theme without a provider", async () => {
    function Probe() {
      const theme = useTheme();
      return <Text>{theme.color.bgPage}</Text>;
    }
    await render(<Probe />);
    expect(screen.getByText(color.bgPage)).toBeOnTheScreen();
  });
});
