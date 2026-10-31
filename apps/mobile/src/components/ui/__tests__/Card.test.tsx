import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { Card } from "../Card";

describe("Card", () => {
  it("renders title, description and children without being a button", async () => {
    await render(
      <Card title="Active CV" description="Used for new analyses">
        <Text>body</Text>
      </Card>,
    );
    expect(screen.getByRole("header", { name: "Active CV" })).toBeOnTheScreen();
    expect(screen.getByText("Used for new analyses")).toBeOnTheScreen();
    expect(screen.getByText("body")).toBeOnTheScreen();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("is a button named by its title when onPress is set", async () => {
    const onPress = jest.fn();
    await render(<Card title="Recent analysis" onPress={onPress} />);
    await fireEvent.press(screen.getByRole("button", { name: "Recent analysis" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
