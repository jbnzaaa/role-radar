import { render, screen } from "@testing-library/react-native";

import { ScoreBar } from "../ScoreBar";

describe("ScoreBar", () => {
  it("exposes its value as a progress bar", async () => {
    await render(<ScoreBar value={71.4} tone="good" accessibilityLabel="Match score" />);
    expect(screen.getByRole("progressbar", { name: "Match score" })).toHaveAccessibilityValue({
      min: 0,
      max: 100,
      now: 71,
      text: "71%",
    });
  });

  it("clamps values to 0–100", async () => {
    await render(<ScoreBar value={140} accessibilityLabel="Score" />);
    expect(screen.getByRole("progressbar")).toHaveAccessibilityValue({ now: 100 });
  });
});
