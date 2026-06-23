import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AgenticWorkflowControlRoom } from "@/components/showcase/AgenticWorkflowControlRoom";

describe("AgenticWorkflowControlRoom", () => {
  it("renders the interactive command center and updates inspector state", () => {
    render(<AgenticWorkflowControlRoom locale="en" />);

    expect(
      screen.getByRole("heading", {
        name: /Agentic Workflow Control Room/i
      })
    ).toBeTruthy();
    expect(screen.getByText(/Run #1427/i)).toBeTruthy();
    expect(screen.getByText(/Model Policy/i)).toBeTruthy();
    expect(screen.getByText(/Tool Policy/i)).toBeTruthy();

    fireEvent.click(
      screen.getByRole("button", { name: /Select Security Agent/i })
    );
    expect(screen.getByText(/Selected: Security Agent/i)).toBeTruthy();
    expect(screen.getByText(/Sandbox policy escalation review/i)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /Select Tests stage/i }));
    expect(screen.getByText(/Selected trace: Tests/i)).toBeTruthy();
    expect(screen.getByText(/Loop: Tests Failed/i)).toBeTruthy();

    const speedControl = screen.getByLabelText(/Replay speed/i);
    fireEvent.change(speedControl, { target: { value: "1.5" } });
    expect(screen.getByText(/Replay readout: 1.5x/i)).toBeTruthy();

    const approvalItem = screen.getByRole("checkbox", {
      name: /Security scan clean/i
    }) as HTMLInputElement;
    expect(approvalItem.checked).toBe(false);
    fireEvent.click(approvalItem);
    expect(approvalItem.checked).toBe(true);

    expect(
      screen.getByRole("heading", {
        name: /^Subagent-driven development$/i
      })
    ).toBeTruthy();
  });

  it("renders Korean command-center copy", () => {
    render(<AgenticWorkflowControlRoom locale="ko" />);

    expect(
      screen.getByRole("heading", {
        name: /에이전틱 워크플로우 컨트롤 룸/i
      })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", {
        name: /^하위 에이전트 기반 개발$/i
      })
    ).toBeTruthy();
  });
});
