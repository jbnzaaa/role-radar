import { fireEvent, render, screen } from "@testing-library/react-native";

import { PageHeader } from "../PageHeader";

describe("PageHeader", () => {
  it("renders a header with description and back", async () => {
    const onBack = jest.fn();
    await render(
      <PageHeader
        title="Quick analyze"
        description="Paste a job description to score it."
        onBack={onBack}
      />,
    );
    expect(screen.getByRole("header", { name: "Quick analyze" })).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "Back" }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("has no back button on tab screens", async () => {
    await render(<PageHeader title="History" />);
    expect(screen.queryByRole("button", { name: "Back" })).toBeNull();
  });
});
