import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { BottomSheet } from "../BottomSheet";

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

describe("BottomSheet", () => {
  it("shows title and content when visible, and closes from the backdrop", async () => {
    const onClose = jest.fn();
    await render(
      <SafeAreaProvider initialMetrics={metrics}>
        <BottomSheet title="Application status" visible onClose={onClose}>
          <Text>options</Text>
        </BottomSheet>
      </SafeAreaProvider>,
    );
    expect(screen.getByRole("header", { name: "Application status" })).toBeOnTheScreen();
    expect(screen.getByText("options")).toBeOnTheScreen();
    // The backdrop sits outside the accessibility-modal sheet, so it is hidden from screen readers.
    await fireEvent.press(
      screen.getByRole("button", { name: "Close", includeHiddenElements: true }),
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders nothing when hidden", async () => {
    await render(
      <SafeAreaProvider initialMetrics={metrics}>
        <BottomSheet title="Application status" visible={false} onClose={jest.fn()}>
          <Text>options</Text>
        </BottomSheet>
      </SafeAreaProvider>,
    );
    expect(screen.queryByText("options")).toBeNull();
  });
});
