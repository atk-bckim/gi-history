import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DigitalTwinCommandCenter } from "@/components/showcase/DigitalTwinCommandCenter";
import { ShowcasePreviewPage } from "@/components/showcase/ShowcasePreviewPage";

describe("AI Web Design Lab showcase components", () => {
  it("renders the digital twin command center with telemetry, layer controls, timeline, and selected AI analysis", () => {
    render(<DigitalTwinCommandCenter locale="en" />);

    expect(
      screen.getByRole("heading", {
        name: /3D Digital Twin Command Center/i
      })
    ).toBeTruthy();
    expect(screen.getByText(/Semiconductor Fab - Line 7/i)).toBeTruthy();
    expect(screen.getByText(/2,842/i)).toBeTruthy();
    expect(screen.getByText(/89.7%/i)).toBeTruthy();

    for (const layer of [
      "Sensors",
      "Heatmap",
      "Throughput",
      "Defects",
      "Maintenance",
      "Facility"
    ]) {
      expect(screen.getByRole("checkbox", { name: layer })).toBeTruthy();
    }

    const timeSlider = screen.getByLabelText(/Time position/i);
    expect(timeSlider).toBeTruthy();
    fireEvent.change(timeSlider, { target: { value: "4" } });
    expect(screen.getByText(/14:30/i)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /Select CMP-03/i }));
    expect(screen.getByText(/CMP-03/i)).toBeTruthy();
    expect(
      screen.getByText(/Slurry temperature deviation detected/i)
    ).toBeTruthy();

    const defectsToggle = screen.getByRole("checkbox", {
      name: "Defects"
    }) as HTMLInputElement;
    fireEvent.click(defectsToggle);
    expect(defectsToggle.checked).toBe(false);

    expect(screen.getByTestId("mobile-fallback-panel")).toBeTruthy();
    expect(screen.getByRole("checkbox", { name: /Reduced motion/i })).toBeTruthy();
  });

  it("renders the semiconductor design explorer preview surface", () => {
    render(
      <ShowcasePreviewPage
        locale="en"
        showcaseId="semiconductor-design-explorer"
      />
    );

    expect(
      screen.getByRole("heading", {
        name: /3D Semiconductor Design Explorer/i
      })
    ).toBeTruthy();
    expect(screen.getByText(/Package render/i)).toBeTruthy();
    expect(screen.getByText(/Cutaway toggles/i)).toBeTruthy();
    expect(screen.getByText(/Defect markers/i)).toBeTruthy();
    expect(screen.getByText(/Copilot prompt storyboard/i)).toBeTruthy();
    expect(screen.getByText(/MCP context map/i)).toBeTruthy();
    expect(screen.getByText(/agent review checklist/i)).toBeTruthy();
  });

  it("renders the agentic workflow control room preview surface", () => {
    render(
      <ShowcasePreviewPage
        locale="en"
        showcaseId="agentic-workflow-control-room"
      />
    );

    expect(
      screen.getByRole("heading", {
        name: /Agentic Workflow Control Room/i
      })
    ).toBeTruthy();
    expect(screen.getByText(/Research agent/i)).toBeTruthy();
    expect(screen.getByText(/Approval gates/i)).toBeTruthy();
    expect(screen.getByText(/Trace replay/i)).toBeTruthy();
    expect(screen.getByText(/subagent dispatch plan/i)).toBeTruthy();
    expect(screen.getByText(/approval policy harness/i)).toBeTruthy();
    expect(screen.getByText(/loop evaluation rubric/i)).toBeTruthy();
  });

  it("renders localized AI build explanations for preview showcases", () => {
    render(
      <ShowcasePreviewPage
        locale="ko"
        showcaseId="semiconductor-design-explorer"
      />
    );

    expect(screen.getByText(/Copilot 프롬프트 스토리보드/i)).toBeTruthy();
    expect(screen.getByText(/MCP 컨텍스트 맵/i)).toBeTruthy();
  });
});
