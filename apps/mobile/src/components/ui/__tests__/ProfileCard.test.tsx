import { fireEvent, render, screen } from "@testing-library/react-native";

import { ProfileCard } from "../ProfileCard";

describe("ProfileCard", () => {
  it("shows identity and opens edit", async () => {
    const onEdit = jest.fn();
    await render(
      <ProfileCard
        name="Jay Beniza"
        email="jay@example.com"
        headline="UI/UX Designer"
        location="Metro Manila"
        onEdit={onEdit}
      />,
    );
    expect(screen.getByRole("header", { name: "Jay Beniza" })).toBeOnTheScreen();
    expect(screen.getByText("Signed in with Google")).toBeOnTheScreen();
    expect(screen.getByText("UI/UX Designer")).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "Edit profile" }));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it("hides empty details", async () => {
    await render(<ProfileCard name="Jay" email="jay@example.com" onEdit={jest.fn()} />);
    expect(screen.queryByText("Metro Manila")).toBeNull();
  });
});
