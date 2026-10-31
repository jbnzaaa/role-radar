import { fireEvent, render, screen } from "@testing-library/react-native";

import { Avatar, initials } from "../Avatar";

describe("initials", () => {
  it.each([
    ["Jay Beniza", "JB"],
    ["  maria  de la cruz ", "MC"],
    ["Jay", "J"],
    ["", "?"],
  ])("%s → %s", (name, expected) => {
    expect(initials(name)).toBe(expected);
  });
});

describe("Avatar", () => {
  it("shows initials without a photo", async () => {
    await render(<Avatar name="Jay Beniza" />);
    expect(screen.getByText("JB")).toBeOnTheScreen();
  });

  it("falls back to initials when the photo fails", async () => {
    await render(<Avatar name="Jay Beniza" uri="https://example.com/p.jpg" />);
    expect(screen.queryByText("JB")).toBeNull();
    await fireEvent(screen.getByLabelText("Jay Beniza"), "error");
    expect(screen.getByText("JB")).toBeOnTheScreen();
  });
});
