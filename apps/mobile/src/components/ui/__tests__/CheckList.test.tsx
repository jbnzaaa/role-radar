import { render, screen } from "@testing-library/react-native";
import { CircleCheck } from "lucide-react-native";

import { CheckList } from "../CheckList";

describe("CheckList", () => {
  it("renders every item as its own accessible element", async () => {
    await render(
      <CheckList
        icon={CircleCheck}
        tone="met"
        items={["Strong Figma skills", "Shipped a design system"]}
      />,
    );
    expect(screen.getByLabelText("Strong Figma skills")).toBeOnTheScreen();
    expect(screen.getByText("Shipped a design system")).toBeOnTheScreen();
  });
});
