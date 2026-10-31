import { render, screen } from "@testing-library/react-native";

import { HomeHeader } from "../HomeHeader";

describe("HomeHeader", () => {
  it("greets by name with an avatar", async () => {
    await render(<HomeHeader name="Jay" subtitle="Ready to find your next role?" />);
    expect(screen.getByRole("header", { name: "Hello, Jay" })).toBeOnTheScreen();
    expect(screen.getByText("J")).toBeOnTheScreen();
  });
});
