import { fireEvent, render, screen } from "@testing-library/react-native";

import { VersionRow } from "../VersionRow";

describe("VersionRow", () => {
  it("reads active versions and opens on press", async () => {
    const onPress = jest.fn();
    await render(
      <VersionRow name="CV – October 2026" active savedAt="30 Oct 2026" onPress={onPress} />,
    );
    await fireEvent.press(
      screen.getByRole("button", { name: "CV – October 2026, Active, Saved 30 Oct 2026" }),
    );
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("has no Active chip when inactive", async () => {
    await render(
      <VersionRow name="CV v1" active={false} savedAt="1 Oct 2026" onPress={jest.fn()} />,
    );
    expect(screen.queryByText("Active")).toBeNull();
    expect(screen.getByRole("button", { name: "CV v1, Saved 1 Oct 2026" })).toBeOnTheScreen();
  });
});
