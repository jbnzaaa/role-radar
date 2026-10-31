import { render, screen } from "@testing-library/react-native";

import { RequirementRow } from "../RequirementRow";

describe("RequirementRow", () => {
  it("is read with status label and evidence", async () => {
    await render(
      <RequirementRow
        title="3+ years in product design"
        evidence="CV shows 3.5 years at two studios."
        status="met"
        importance="must-have"
      />,
    );
    expect(
      screen.getByLabelText("3+ years in product design, Met. CV shows 3.5 years at two studios."),
    ).toBeOnTheScreen();
    expect(screen.getByText("Met")).toBeOnTheScreen();
  });

  it("mentions nice-to-have importance", async () => {
    await render(
      <RequirementRow
        title="Motion design"
        evidence="Not in CV."
        status="missing"
        importance="nice-to-have"
      />,
    );
    expect(
      screen.getByLabelText("Motion design, Missing, nice to have. Not in CV."),
    ).toBeOnTheScreen();
  });
});
