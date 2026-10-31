import { fireEvent, render, screen } from "@testing-library/react-native";
import { ArrowLeft } from "lucide-react-native";

import { IconButton } from "../IconButton";

describe("IconButton", () => {
  it("is a labelled button that calls onPress", async () => {
    const onPress = jest.fn();
    await render(<IconButton icon={ArrowLeft} accessibilityLabel="Back" onPress={onPress} />);
    await fireEvent.press(screen.getByRole("button", { name: "Back" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", async () => {
    const onPress = jest.fn();
    await render(
      <IconButton icon={ArrowLeft} accessibilityLabel="Back" onPress={onPress} disabled />,
    );
    await fireEvent.press(screen.getByRole("button", { name: "Back" }));
    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Back" })).toBeDisabled();
  });
});
