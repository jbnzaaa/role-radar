import { fireEvent, render, screen } from "@testing-library/react-native";

import { EmptyState } from "../EmptyState";

describe("EmptyState", () => {
  it("shows title, body and an optional action", async () => {
    const onPress = jest.fn();
    await render(
      <EmptyState
        title="No analyses yet"
        body="Paste a job description to see how well your CV matches."
        action={{ label: "Analyze a job", onPress }}
      />,
    );
    expect(screen.getByRole("header", { name: "No analyses yet" })).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "Analyze a job" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("has no button without an action", async () => {
    await render(<EmptyState title="Nothing here" body="Try another search." />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
