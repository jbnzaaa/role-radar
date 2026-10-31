import { fireEvent, render, screen } from "@testing-library/react-native";

import { FileCard } from "../FileCard";

describe("FileCard", () => {
  it("describes a PDF with its page count and replaces the file", async () => {
    const onReplace = jest.fn();
    await render(<FileCard name="jay-cv.pdf" type="pdf" pages={2} onReplace={onReplace} />);
    expect(screen.getByLabelText("jay-cv.pdf, PDF Document · 2 pages")).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole("button", { name: "Replace file" }));
    expect(onReplace).toHaveBeenCalledTimes(1);
  });

  it("omits pages when unknown and uses the singular for one page", async () => {
    const { rerender } = await render(
      <FileCard name="cv.docx" type="docx" onReplace={jest.fn()} />,
    );
    expect(screen.getByText("Word Document")).toBeOnTheScreen();
    await rerender(<FileCard name="cv.pdf" type="pdf" pages={1} onReplace={jest.fn()} />);
    expect(screen.getByText("PDF Document · 1 page")).toBeOnTheScreen();
  });
});
