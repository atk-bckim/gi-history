import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SemiconductorDesignExplorer } from "@/components/showcase/SemiconductorDesignExplorer";

describe("SemiconductorDesignExplorer", () => {
  it("renders an interactive semiconductor command center with layers, inspector state, and build breakdown", () => {
    render(<SemiconductorDesignExplorer locale="en" />);

    expect(
      screen.getByRole("heading", {
        name: /3D Semiconductor Design Explorer/i
      })
    ).toBeTruthy();

    for (const layer of [
      "Package body",
      "Organic substrate",
      "Interposer / RDL",
      "Logic chiplet",
      "HBM stacks",
      "Bumps / BGA",
      "Thermal",
      "Defects",
      "Cutaway"
    ]) {
      expect(screen.getByRole("checkbox", { name: layer })).toBeTruthy();
    }

    const defectsToggle = screen.getByRole("checkbox", {
      name: "Defects"
    }) as HTMLInputElement;
    fireEvent.click(defectsToggle);
    expect(defectsToggle.checked).toBe(false);
    expect(screen.getByText(/Defects hidden/i)).toBeTruthy();

    expect(screen.getAllByText(/PKG_THERMAL_01/i).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: /Select HBM_SIGNAL_07/i }));
    expect(screen.getAllByText(/HBM_SIGNAL_07/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/HBM escape routing congestion/i)).toBeTruthy();

    const frameSlider = screen.getByLabelText(/Simulation frame/i);
    fireEvent.change(frameSlider, { target: { value: "420" } });
    expect(screen.getByText(/Frame 420 \/ 600/i)).toBeTruthy();
    expect(screen.getAllByText(/TT \/ 0.80V \/ 25C/i).length).toBeGreaterThan(0);

    expect(screen.getByText(/AI Package Architecture/i)).toBeTruthy();
    expect(screen.getAllByText(/MCP Package Context/i).length).toBeGreaterThan(0);
  });

  it("renders Korean command copy from the locale prop", () => {
    render(<SemiconductorDesignExplorer locale="ko" />);

    expect(
      screen.getByRole("heading", {
        name: /3D 반도체 설계 탐색기/i
      })
    ).toBeTruthy();
    expect(screen.getByText(/AI 패키지 리뷰/i)).toBeTruthy();
  });
});
