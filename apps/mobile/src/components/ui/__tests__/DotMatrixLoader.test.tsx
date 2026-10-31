import { render, screen } from "@testing-library/react-native";

import { DotMatrixLoader } from "../DotMatrixLoader";

describe("DotMatrixLoader", () => {
  it("renders rows × cols dots, hidden from screen readers", async () => {
    await render(<DotMatrixLoader rows={3} cols={4} />);
    const grid = screen.getByTestId("dot-matrix-loader", { includeHiddenElements: true });
    expect(grid).toHaveProp("accessibilityElementsHidden", true);
    expect(grid.children).toHaveLength(3);
  });
});
