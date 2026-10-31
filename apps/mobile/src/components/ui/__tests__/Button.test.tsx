import { fireEvent, render, screen } from "@testing-library/react-native";

import { Button } from "../Button";

describe("Button", () => {
  it("calls onPress", async () => {
    const onPress = jest.fn();
    await render(<Button label="Analyze" onPress={onPress} />);
    await fireEvent.press(screen.getByRole("button", { name: "Analyze" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("is disabled and busy while loading", async () => {
    const onPress = jest.fn();
    await render(<Button label="Analyze" onPress={onPress} loading />);
    const button = screen.getByRole("button", { name: "Analyze" });
    await fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
    expect(button).toBeBusy();
  });

  it("does not call onPress when disabled", async () => {
    const onPress = jest.fn();
    await render(<Button label="Save" onPress={onPress} disabled variant="secondary" />);
    await fireEvent.press(screen.getByRole("button", { name: "Save" }));
    expect(onPress).not.toHaveBeenCalled();
  });
});
