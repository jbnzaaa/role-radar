import { render, screen } from "@testing-library/react-native";

import { KeyValueRow } from "../KeyValueRow";

describe("KeyValueRow", () => {
  it("is read as one element: label then value", async () => {
    await render(<KeyValueRow label="Analyses" value="12" />);
    expect(screen.getByLabelText("Analyses: 12")).toBeOnTheScreen();
    expect(screen.getByText("12")).toBeOnTheScreen();
  });
});
