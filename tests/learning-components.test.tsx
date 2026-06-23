import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AgentLoopVisualizer } from "@/components/learning/agent-loop-visualizer";
import { ContextStack } from "@/components/learning/context-stack";
import { CopilotWorkflowSimulator } from "@/components/learning/copilot-workflow-simulator";
import { PromptBuilder } from "@/components/learning/prompt-builder";
import {
  PROMPT_CRITERIA,
  scorePromptDraft
} from "@/components/learning/prompt-scoring";
import { QuizEngine } from "@/components/learning/quiz-engine";
import {
  evaluateQuizAnswer,
  type QuizQuestion
} from "@/components/learning/quiz-model";

describe("PromptBuilder scoring", () => {
  it("starts as an empty exercise and lets learners load or clear a sample prompt", () => {
    render(<PromptBuilder locale="en" />);

    expect(
      screen.queryByDisplayValue(/Refactor the checkout form to reduce validation bugs/i)
    ).toBeNull();
    expect(
      screen.getByText(/Fill the fields to preview the assembled prompt/i)
    ).toBeTruthy();
    expect(screen.getByText("0", { selector: "div" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Use sample" }));
    expect(
      screen.getByDisplayValue(/Refactor the checkout form to reduce validation bugs/i)
    ).toBeTruthy();
    expect(screen.getByText("100")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(
      screen.queryByDisplayValue(/Refactor the checkout form to reduce validation bugs/i)
    ).toBeNull();
    expect(
      screen.getByText(/Fill the fields to preview the assembled prompt/i)
    ).toBeTruthy();
  });

  it("scores all five prompt quality dimensions deterministically", () => {
    const score = scorePromptDraft({
      goal: "Refactor the checkout form to reduce validation bugs for guest users.",
      context:
        "Use app/checkout/Form.tsx, the Zod schema, and the failing test log from checkout-validation.test.ts.",
      constraints:
        "Do not change the payment provider, keep keyboard accessibility, and preserve strict TypeScript types.",
      output:
        "Return a patch summary, updated test names, and any residual risks in bullet form.",
      verification:
        "Run npm test checkout-validation and explain which edge cases were verified."
    });

    expect(score.total).toBe(100);
    expect(score.items.map((item) => item.id)).toEqual(
      PROMPT_CRITERIA.map((criterion) => criterion.id)
    );
    expect(score.items.every((item) => item.points === 20)).toBe(true);
    expect(score.items.every((item) => item.status === "strong")).toBe(true);
  });

  it("keeps missing and thin prompt sections visible in feedback", () => {
    const score = scorePromptDraft({
      goal: "Fix bug",
      context: "",
      constraints: "",
      output: "Patch",
      verification: ""
    });

    expect(score.total).toBe(20);
    expect(score.items.find((item) => item.id === "goal")?.points).toBe(10);
    expect(score.items.find((item) => item.id === "output")?.points).toBe(10);
    expect(score.items.find((item) => item.id === "context")?.status).toBe(
      "missing"
    );
    expect(score.items.find((item) => item.id === "verification")?.feedback).toContain(
      "verification"
    );
  });
});

describe("Interactive learning lab states", () => {
  it("shows selected context-stack guidance and updates it when learners choose a layer", () => {
    render(<ContextStack locale="en" />);

    expect(screen.getByText(/Selected context: Selected code/i)).toBeTruthy();
    expect(
      screen.getByText(/Focus the model on the exact function or component/i)
    ).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /Official docs/i }));
    expect(screen.getByText(/Selected context: Official docs/i)).toBeTruthy();
    expect(
      screen.getByText(/Anchor version-sensitive API details/i)
    ).toBeTruthy();
  });

  it("shows selected workflow-stage feedback and changes it by step", () => {
    render(<CopilotWorkflowSimulator locale="en" />);

    expect(screen.getByText(/Active stage: Requirement/i)).toBeTruthy();
    expect(
      screen.getByText(/Capture acceptance criteria before asking for code/i)
    ).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /Test generation/i }));
    expect(screen.getByText(/Active stage: Test generation/i)).toBeTruthy();
    expect(
      screen.getByText(/Turn acceptance criteria into regression tests/i)
    ).toBeTruthy();
  });

  it("teaches an end-to-end Copilot run with artifacts, approvals, and verification evidence", () => {
    render(<CopilotWorkflowSimulator locale="en" />);

    expect(screen.getByText(/Checkout duplicate submit incident/i)).toBeTruthy();
    expect(screen.getByText(/Issue brief/i)).toBeTruthy();
    expect(screen.getByText(/Context pack/i)).toBeTruthy();
    expect(screen.getByText(/agent-mode dry run/i)).toBeTruthy();
    expect(screen.getByText(/No-write investigation/i)).toBeTruthy();
    expect(screen.getByText(/Approval gate/i)).toBeTruthy();
    expect(screen.getByText(/Verification evidence/i)).toBeTruthy();
    expect(screen.getByText(/npm test checkout-submit/i)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /PR review/i }));

    expect(screen.getByText(/Review contract/i)).toBeTruthy();
    expect(screen.getByText(/human reviewer owns merge approval/i)).toBeTruthy();
  });

  it("makes the agent loop selectable and explains the current loop step", () => {
    render(<AgentLoopVisualizer locale="en" />);

    expect(screen.getByText(/Selected loop step: Plan/i)).toBeTruthy();
    expect(
      screen.getByText(/Define the next smallest action and the evidence needed/i)
    ).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /Select Observe/i }));
    expect(screen.getByText(/Selected loop step: Observe/i)).toBeTruthy();
    expect(
      screen.getByText(/Read tool output, errors, diffs, and user feedback/i)
    ).toBeTruthy();
  });
});

describe("QuizEngine feedback", () => {
  const question: QuizQuestion = {
    id: "context-vs-prompt",
    prompt: "Which choice improves Copilot answer quality most reliably?",
    options: [
      {
        id: "specific-context",
        label: "Attach the relevant file, failing test, and expected output.",
        correct: true,
        explanation:
          "Grounding the request with concrete context reduces ambiguity."
      },
      {
        id: "more-adjectives",
        label: "Ask for a very excellent and professional answer.",
        correct: false,
        explanation:
          "Style adjectives do not replace task context or verification criteria."
      }
    ]
  };

  it("returns text feedback that identifies correctness and the right answer", () => {
    expect(evaluateQuizAnswer(question, "specific-context")).toEqual({
      isCorrect: true,
      selectedLabel: "Attach the relevant file, failing test, and expected output.",
      correctLabel: "Attach the relevant file, failing test, and expected output.",
      statusText: "Correct",
      message: "Correct: Grounding the request with concrete context reduces ambiguity."
    });

    expect(evaluateQuizAnswer(question, "more-adjectives")).toEqual({
      isCorrect: false,
      selectedLabel: "Ask for a very excellent and professional answer.",
      correctLabel: "Attach the relevant file, failing test, and expected output.",
      statusText: "Review",
      message:
        "Review: Style adjectives do not replace task context or verification criteria. Correct answer: Attach the relevant file, failing test, and expected output."
    });
  });

  it("rejects unknown option ids instead of returning ambiguous feedback", () => {
    expect(() => evaluateQuizAnswer(question, "missing-option")).toThrow(
      'Invalid quiz answer for question "context-vs-prompt".'
    );
  });

  it("localizes Korean correctness and review status text", () => {
    expect(evaluateQuizAnswer(question, "specific-context", "ko")).toMatchObject({
      statusText: "정답",
      message: "정답: Grounding the request with concrete context reduces ambiguity."
    });

    expect(evaluateQuizAnswer(question, "more-adjectives", "ko")).toMatchObject({
      statusText: "복습 필요",
      message:
        "복습 필요: Style adjectives do not replace task context or verification criteria. 정답: Attach the relevant file, failing test, and expected output."
    });
  });

  it("requires checking an answer before advancing and summarizes completion with retry", () => {
    const questions: QuizQuestion[] = [
      {
        id: "first",
        prompt: "First prompt?",
        options: [
          {
            id: "first-correct",
            label: "First correct",
            correct: true,
            explanation: "First explanation."
          },
          {
            id: "first-wrong",
            label: "First wrong",
            correct: false,
            explanation: "First wrong explanation."
          }
        ]
      },
      {
        id: "second",
        prompt: "Second prompt?",
        options: [
          {
            id: "second-correct",
            label: "Second correct",
            correct: true,
            explanation: "Second explanation."
          },
          {
            id: "second-wrong",
            label: "Second wrong",
            correct: false,
            explanation: "Second wrong explanation."
          }
        ]
      }
    ];

    render(<QuizEngine questions={questions} locale="en" />);

    const nextButton = screen.getByRole("button", {
      name: "Next question"
    }) as HTMLButtonElement;
    expect(screen.getByText(/Score: 0\/2/i)).toBeTruthy();
    expect(nextButton.disabled).toBe(true);

    fireEvent.click(screen.getByLabelText("First correct"));
    expect(nextButton.disabled).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Check answer" }));
    expect(screen.getByText(/Score: 1\/2/i)).toBeTruthy();
    expect(nextButton.disabled).toBe(false);

    fireEvent.click(nextButton);
    expect(screen.getByText("Second prompt?")).toBeTruthy();

    fireEvent.click(screen.getByLabelText("Second wrong"));
    fireEvent.click(screen.getByRole("button", { name: "Check answer" }));
    expect(screen.getByText(/Score: 1\/2/i)).toBeTruthy();
    expect(screen.getByText(/Quiz complete/i)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Retry quiz" }));
    expect(screen.getByText("First prompt?")).toBeTruthy();
    expect(screen.getByText(/Score: 0\/2/i)).toBeTruthy();
  });
});
