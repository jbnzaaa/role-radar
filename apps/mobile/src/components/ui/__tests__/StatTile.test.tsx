import { render, screen } from "@testing-library/react-native";

import { StatTile } from "../StatTile";

describe("StatTile", () => {
  it("is read as value then label", async () => {
    await render(<StatTile value="71%" label="Average score" />);
    expect(screen.getByLabelText("71%, Average score")).toBeOnTheScreen();
  });

  it("caps the number's font scaling at 1.3", async () => {
    await render(<StatTile value="12" label="Analyses" />);
    expect(screen.getByText("12").props.maxFontSizeMultiplier).toBe(1.3);
  });
});
