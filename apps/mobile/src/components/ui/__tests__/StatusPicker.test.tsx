import { fireEvent, render, screen } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import { ActionSheetIOS } from "react-native";

import { StatusPicker } from "../StatusPicker";

jest.mock("expo-haptics", () => ({ selectionAsync: jest.fn(() => Promise.resolve()) }));

const options = [
  { value: "not_applied", label: "Not applied" },
  { value: "applied", label: "Applied" },
] as const;

describe("StatusPicker (iOS action sheet)", () => {
  it("shows the current label and changes status with a haptic", async () => {
    const sheet = jest
      .spyOn(ActionSheetIOS, "showActionSheetWithOptions")
      .mockImplementation((_opts, callback) => callback(1));
    const onChange = jest.fn();
    await render(
      <StatusPicker
        title="Application status"
        value="not_applied"
        options={[...options]}
        onChange={onChange}
      />,
    );
    await fireEvent.press(screen.getByRole("button", { name: "Application status: Not applied" }));
    expect(sheet).toHaveBeenCalledWith(
      expect.objectContaining({
        options: ["Not applied", "Applied", "Cancel"],
        cancelButtonIndex: 2,
      }),
      expect.any(Function),
    );
    expect(onChange).toHaveBeenCalledWith("applied");
    expect(Haptics.selectionAsync).toHaveBeenCalled();
  });

  it("does nothing on cancel", async () => {
    jest
      .spyOn(ActionSheetIOS, "showActionSheetWithOptions")
      .mockImplementation((_opts, callback) => callback(2));
    const onChange = jest.fn();
    await render(
      <StatusPicker
        title="Application status"
        value="applied"
        options={[...options]}
        onChange={onChange}
      />,
    );
    await fireEvent.press(screen.getByRole("button", { name: "Application status: Applied" }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
