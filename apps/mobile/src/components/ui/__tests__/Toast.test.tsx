import { render, screen } from "@testing-library/react-native";
import { AccessibilityInfo } from "react-native";

import { Toast } from "../Toast";

describe("Toast", () => {
  it("shows the message and announces it", async () => {
    const announce = jest.spyOn(AccessibilityInfo, "announceForAccessibility");
    await render(<Toast message="Status updated" />);
    expect(screen.getByRole("alert", { name: "Status updated" })).toBeOnTheScreen();
    expect(announce).toHaveBeenCalledWith("Status updated");
  });
});
