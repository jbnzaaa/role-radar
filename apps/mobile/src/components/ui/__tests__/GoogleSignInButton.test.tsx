import { fireEvent, render, screen } from "@testing-library/react-native";

import { GoogleSignInButton } from "../GoogleSignInButton";

const name = "Continue with Google";

describe("GoogleSignInButton", () => {
  it("uses Google's wording and calls onPress", async () => {
    const onPress = jest.fn();
    await render(<GoogleSignInButton onPress={onPress} />);
    await fireEvent.press(screen.getByRole("button", { name }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("is busy and disabled while loading", async () => {
    const onPress = jest.fn();
    await render(<GoogleSignInButton onPress={onPress} loading />);
    const button = screen.getByRole("button", { name });
    expect(button).toBeBusy();
    await fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });
});
