import { fireEvent, render, screen } from "@testing-library/react-native";

import { AnalysisRow, HistoryRow, MatchRow } from "../JobRows";

const base = {
  title: "Product Designer",
  subtitle: "Acme · 30 Oct",
  score: 71.2,
  verdict: { label: "Good match", tone: "good" as const },
};

describe("AnalysisRow", () => {
  it("is one button read with score, verdict and status", async () => {
    const onPress = jest.fn();
    await render(
      <AnalysisRow {...base} status={{ label: "Saved", tone: "neutral" }} onPress={onPress} />,
    );
    const row = screen.getByRole("button", {
      name: "Product Designer, Acme · 30 Oct, score 71 percent, Good match, Saved",
    });
    await fireEvent.press(row);
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.getByText("71")).toBeOnTheScreen();
  });
});

describe("HistoryRow", () => {
  it("adds the score bar and CV chip", async () => {
    await render(
      <HistoryRow
        {...base}
        status={{ label: "Applied", tone: "accent" }}
        cvName="Design CV v2"
        onPress={jest.fn()}
      />,
    );
    expect(screen.getByText("Design CV v2")).toBeOnTheScreen();
    expect(screen.getByRole("progressbar")).toHaveAccessibilityValue({ now: 71 });
  });
});

describe("MatchRow", () => {
  it("shows at most 3 skills and a separate Mark applied button", async () => {
    const onMarkApplied = jest.fn();
    const onPress = jest.fn();
    await render(
      <MatchRow
        {...base}
        skills={["Figma", "Prototyping", "User research", "SQL"]}
        onPress={onPress}
        onMarkApplied={onMarkApplied}
      />,
    );
    expect(screen.getByText("User research")).toBeOnTheScreen();
    expect(screen.queryByText("SQL")).toBeNull();
    await fireEvent.press(screen.getByRole("button", { name: "Mark applied" }));
    expect(onMarkApplied).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });
});
