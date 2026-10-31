import { render, screen } from "@testing-library/react-native";

import { LegendRow, StackedBar } from "../StackedBar";

describe("StackedBar", () => {
  it("summarises every segment for screen readers", async () => {
    await render(
      <StackedBar
        segments={[
          { label: "Strong match", count: 2, tone: "strong" },
          { label: "Good match", count: 3, tone: "good" },
          { label: "Partial match", count: 0, tone: "partial" },
        ]}
      />,
    );
    expect(
      screen.getByLabelText("Strong match 2, Good match 3, Partial match 0"),
    ).toBeOnTheScreen();
  });
});

describe("LegendRow", () => {
  it("is read as label: value", async () => {
    await render(<LegendRow label="Low match" value={4} tone="low" />);
    expect(screen.getByLabelText("Low match: 4")).toBeOnTheScreen();
  });
});
