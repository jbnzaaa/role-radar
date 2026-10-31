import { fireEvent, render, screen } from "@testing-library/react-native";
import { CircleUser, FileText, History, House } from "lucide-react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { TabBar, type TabBarItem } from "../TabBar";

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

function setup(onTab = jest.fn(), onAdd = jest.fn()) {
  const tab = (key: string, label: string, icon: TabBarItem["icon"], active = false) => ({
    key,
    label,
    icon,
    active,
    onPress: () => onTab(key),
  });
  return render(
    <SafeAreaProvider initialMetrics={metrics}>
      <TabBar
        tabs={[
          tab("home", "Home", House, true),
          tab("cv", "CV", FileText),
          tab("history", "History", History),
          tab("profile", "Profile", CircleUser),
        ]}
        onAddPress={onAdd}
        addLabel="Analyze a job"
      />
    </SafeAreaProvider>,
  );
}

describe("TabBar", () => {
  it("shows all four tabs with the active one selected", async () => {
    await setup();
    expect(screen.getAllByRole("tab")).toHaveLength(4);
    expect(screen.getByRole("tab", { name: "Home" })).toBeSelected();
    expect(screen.getByRole("tab", { name: "CV" })).not.toBeSelected();
  });

  it("calls the tab and add handlers", async () => {
    const onTab = jest.fn();
    const onAdd = jest.fn();
    await setup(onTab, onAdd);
    await fireEvent.press(screen.getByRole("tab", { name: "History" }));
    expect(onTab).toHaveBeenCalledWith("history");
    await fireEvent.press(screen.getByRole("button", { name: "Analyze a job" }));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });
});
