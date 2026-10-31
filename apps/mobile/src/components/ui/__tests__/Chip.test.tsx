import { render, screen } from "@testing-library/react-native";

import { Chip } from "../Chip";
import { lightTheme } from "@/theme";

describe("Chip", () => {
  it("renders its label with the tone colours", async () => {
    await render(<Chip label="Strong match" tone="strong" />);
    expect(screen.getByText("Strong match")).toHaveStyle({
      color: lightTheme.color.verdictStrong,
    });
  });

  it("defaults to the neutral tone", async () => {
    await render(<Chip label="Saved" />);
    expect(screen.getByText("Saved")).toHaveStyle({ color: lightTheme.color.textSecondary });
  });
});
