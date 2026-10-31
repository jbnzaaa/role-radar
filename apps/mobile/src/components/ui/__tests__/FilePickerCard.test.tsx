import { fireEvent, render, screen } from "@testing-library/react-native";

import { FilePickerCard } from "../FilePickerCard";

const label = "Choose a file. PDF or DOCX · Max 4 MB";

describe("FilePickerCard", () => {
  it("opens the picker when idle", async () => {
    const onPress = jest.fn();
    await render(<FilePickerCard accept="PDF or DOCX" maxMb={4} onPress={onPress} />);
    await fireEvent.press(screen.getByRole("button", { name: label }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("is busy and shows the uploading label", async () => {
    const onPress = jest.fn();
    await render(
      <FilePickerCard accept="PDF or DOCX" maxMb={4} state="uploading" onPress={onPress} />,
    );
    expect(screen.getByText("Reading your CV…")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: label })).toBeBusy();
    await fireEvent.press(screen.getByRole("button", { name: label }));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("shows a reason when disabled", async () => {
    await render(
      <FilePickerCard
        accept="PDF or DOCX"
        maxMb={4}
        disabled
        message="You're offline. You can still paste your CV text."
        onPress={jest.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: label })).toBeDisabled();
    expect(screen.getByText("You're offline. You can still paste your CV text.")).toBeOnTheScreen();
  });
});
