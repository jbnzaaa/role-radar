import { fireEvent, render, screen } from "@testing-library/react-native";

import { SettingsRow } from "../SettingsRow";

describe("SettingsRow", () => {
  it("is a button with a chevron", async () => {
    const onPress = jest.fn();
    await render(
      <SettingsRow
        title="Privacy & data"
        description="Last backup: 30 Oct 2026"
        trailing="chevron"
        onPress={onPress}
      />,
    );
    await fireEvent.press(
      screen.getByRole("button", { name: "Privacy & data. Last backup: 30 Oct 2026" }),
    );
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("shows a read-only value without being a button", async () => {
    await render(<SettingsRow title="App version" trailing={{ value: "1.0.0" }} />);
    expect(screen.getByLabelText("App version: 1.0.0")).toBeOnTheScreen();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
