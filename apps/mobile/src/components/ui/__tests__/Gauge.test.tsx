import { render, screen } from "@testing-library/react-native";

import { Gauge } from "../Gauge";

describe("Gauge", () => {
  it("is one accessible element with score and verdict", async () => {
    await render(<Gauge value={71} label="Good match" accessibilityName="Average match score" />);
    expect(screen.getByLabelText("Average match score 71 percent, Good match")).toBeOnTheScreen();
    expect(screen.getByText("71%")).toBeOnTheScreen();
  });

  it("shows the empty state without a number", async () => {
    await render(
      <Gauge
        value={null}
        label="No analyses this week yet"
        size="md"
        accessibilityName="Average match score"
      />,
    );
    expect(
      screen.getByLabelText("Average match score, No analyses this week yet"),
    ).toBeOnTheScreen();
    expect(screen.getByText("–")).toBeOnTheScreen();
  });
});
