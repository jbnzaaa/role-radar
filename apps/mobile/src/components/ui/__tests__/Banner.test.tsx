import { render, screen } from "@testing-library/react-native";

import { lightTheme } from "@/theme";

import { Banner } from "../Banner";

describe("Banner", () => {
  it("is an alert with the warning colours", async () => {
    await render(<Banner tone="warning" message="You're offline. Analyses need a connection." />);
    expect(
      screen.getByRole("alert", { name: "You're offline. Analyses need a connection." }),
    ).toBeOnTheScreen();
    expect(screen.getByText("You're offline. Analyses need a connection.")).toHaveStyle({
      color: lightTheme.color.verdictPartial,
    });
  });
});
