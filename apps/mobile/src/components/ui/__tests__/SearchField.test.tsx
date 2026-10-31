import { fireEvent, render, screen } from "@testing-library/react-native";

import { SearchField } from "../SearchField";

describe("SearchField", () => {
  it("has no clear button when empty", async () => {
    await render(<SearchField value="" onChangeText={jest.fn()} placeholder="Search jobs" />);
    expect(screen.queryByRole("button", { name: "Clear search" })).toBeNull();
  });

  it("types and clears", async () => {
    const onChangeText = jest.fn();
    await render(
      <SearchField value="desi" onChangeText={onChangeText} placeholder="Search jobs" />,
    );
    await fireEvent.changeText(screen.getByLabelText("Search jobs"), "design");
    expect(onChangeText).toHaveBeenLastCalledWith("design");
    await fireEvent.press(screen.getByRole("button", { name: "Clear search" }));
    expect(onChangeText).toHaveBeenLastCalledWith("");
  });
});
