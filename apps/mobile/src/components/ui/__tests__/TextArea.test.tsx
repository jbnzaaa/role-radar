import { fireEvent, render, screen } from "@testing-library/react-native";

import { lightTheme } from "@/theme";

import { TextArea } from "../TextArea";

describe("TextArea", () => {
  it("shows a formatted counter and calls onChangeText", async () => {
    const onChangeText = jest.fn();
    await render(
      <TextArea label="Job description" value="abc" onChangeText={onChangeText} max={20000} />,
    );
    expect(screen.getByText("3 / 20,000")).toBeOnTheScreen();
    await fireEvent.changeText(screen.getByLabelText("Job description"), "abcd");
    expect(onChangeText).toHaveBeenCalledWith("abcd");
  });

  it("marks the counter when over the limit", async () => {
    await render(<TextArea label="CV text" value="abcdef" onChangeText={jest.fn()} max={5} />);
    expect(screen.getByText("6 / 5")).toHaveStyle({ color: lightTheme.color.verdictLow });
  });

  it("runs the action and shows an error", async () => {
    const onPaste = jest.fn();
    await render(
      <TextArea
        label="Job description"
        value=""
        onChangeText={jest.fn()}
        max={20000}
        error="Paste at least 200 characters."
        action={{ label: "Paste", onPress: onPaste }}
      />,
    );
    await fireEvent.press(screen.getByRole("button", { name: "Paste" }));
    expect(onPaste).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Paste at least 200 characters.")).toBeOnTheScreen();
  });
});
