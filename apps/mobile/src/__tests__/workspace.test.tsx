import { APP_NAME } from "@roleradar/core";
import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

// Smoke test: jest-expo + React Native Testing Library run and resolve the shared workspace package.
describe("mobile test setup", () => {
  it("renders a value from @roleradar/core", async () => {
    await render(<Text>{APP_NAME}</Text>);
    expect(screen.getByText("RoleRadar")).toBeOnTheScreen();
  });
});
