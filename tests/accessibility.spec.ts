import { expect, test, type ConsoleMessage, type Page } from "@playwright/test";

type PageFailure = {
  kind: "console" | "pageerror" | "response";
  message: string;
};

const ignoredConsolePatterns = [/GPU stall/i, /WebGL.*GPU/i, /ReadPixels/i];

function isIgnoredConsoleMessage(message: string) {
  return ignoredConsolePatterns.some((pattern) => pattern.test(message));
}

function watchPageFailures(page: Page) {
  const failures: PageFailure[] = [];

  page.on("console", (message: ConsoleMessage) => {
    if (message.type() !== "error") {
      return;
    }

    const text = message.text();

    if (!isIgnoredConsoleMessage(text)) {
      failures.push({ kind: "console", message: text });
    }
  });

  page.on("pageerror", (error) => {
    const message = error.message;

    if (!isIgnoredConsoleMessage(message)) {
      failures.push({ kind: "pageerror", message });
    }
  });

  page.on("response", (response) => {
    if (response.status() >= 400) {
      failures.push({
        kind: "response",
        message: `${response.status()} ${response.url()}`
      });
    }
  });

  return {
    assertNoFailures() {
      expect(
        failures.map((failure) => `${failure.kind}: ${failure.message}`)
      ).toEqual([]);
    }
  };
}

async function gotoAndCheck(page: Page, path: string) {
  const watcher = watchPageFailures(page);

  await page.goto(path, { waitUntil: "load" });
  await expect(page.locator("body")).toBeVisible();

  return watcher;
}

test("header locale toggle can be reached and changed from the keyboard", async ({
  page
}) => {
  const watcher = await gotoAndCheck(page, "/ko/github-copilot/vscode");

  await expect(
    page.getByRole("heading", {
      name: "VS Code Copilot 기본기와 컨텍스트 지정",
      exact: true
    })
  ).toBeVisible();

  const languageToggle = page.locator('header [aria-label="Language"]');
  const koreanButton = languageToggle.getByRole("button", {
    name: "KO",
    exact: true
  });
  const englishButton = languageToggle.getByRole("button", {
    name: "EN",
    exact: true
  });

  await expect(koreanButton).toHaveAttribute("aria-pressed", "true");

  await koreanButton.focus();
  await expect(koreanButton).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(englishButton).toBeFocused();
  await englishButton.press("Enter");

  await expect(page).toHaveURL(/\/en\/github-copilot\/vscode$/);
  await expect(
    page.getByRole("heading", {
      name: "VS Code Copilot fundamentals and context targeting",
      exact: true
    })
  ).toBeVisible();
  await expect(englishButton).toHaveAttribute("aria-pressed", "true");

  watcher.assertNoFailures();
});

test("lesson table-of-contents links expose progress and work with keyboard activation", async ({
  page
}) => {
  const watcher = await gotoAndCheck(page, "/en/github-copilot/vscode");

  const toc = page.getByRole("navigation", { name: "On this page" });
  const progress = page.getByRole("progressbar", { name: "Reading progress" });
  const contextLink = toc.getByRole("link", { name: "Context targeting" });

  await expect(toc).toBeVisible();
  await expect(progress).toHaveAttribute("aria-valuemin", "0");
  await expect(progress).toHaveAttribute("aria-valuemax", "100");
  await expect(progress).toHaveAttribute("aria-valuenow", /\d+/);

  const contextHref = await contextLink.getAttribute("href");

  expect(contextHref).toMatch(/^#[\w-]+$/);
  const contextHash = contextHref ?? "";
  const contextTargetId = contextHash.slice(1);

  await contextLink.focus();
  await expect(contextLink).toBeFocused();
  await contextLink.press("Enter");

  await expect(page).toHaveURL(new RegExp(`${contextHash}$`));
  await expect(
    page.getByRole("heading", { name: "Context targeting", exact: true })
  ).toBeVisible();
  await expect(page.locator(`[id="${contextTargetId}"]`)).toContainText(
    "Context targeting"
  );
  await expect(contextLink).toHaveAttribute("aria-current", "location");

  watcher.assertNoFailures();
});

test("quiz answer, check, next, completion, and retry controls are keyboard operable", async ({
  page
}) => {
  const watcher = await gotoAndCheck(page, "/en/labs");

  await expect(
    page.getByRole("heading", {
      name: "Which request improves Copilot answer quality most reliably?",
      exact: true
    })
  ).toBeVisible();

  const firstCorrectAnswer = page.getByRole("radio", {
    name: /Attach the relevant file, failing test, and expected output/i
  });
  const checkButton = page.getByRole("button", { name: "Check answer" });
  const nextButton = page.getByRole("button", { name: "Next question" });

  await expect(checkButton).toBeDisabled();
  await expect(nextButton).toBeDisabled();

  await firstCorrectAnswer.focus();
  await expect(firstCorrectAnswer).toBeFocused();
  await firstCorrectAnswer.press("Space");
  await expect(firstCorrectAnswer).toBeChecked();
  await expect(checkButton).toBeEnabled();

  await checkButton.focus();
  await expect(checkButton).toBeFocused();
  await checkButton.press("Enter");
  await expect(page.getByRole("status")).toContainText("Correct:");
  await expect(page.getByText("Score: 1/2")).toBeVisible();
  await expect(nextButton).toBeEnabled();

  await nextButton.focus();
  await expect(nextButton).toBeFocused();
  await nextButton.press("Enter");
  await expect(
    page.getByRole("heading", {
      name: "What is the main role of observe in an agent loop?",
      exact: true
    })
  ).toBeVisible();

  const secondReviewAnswer = page.getByRole("radio", {
    name: "Make the final answer look more polished."
  });

  await secondReviewAnswer.focus();
  await secondReviewAnswer.press("Space");
  await expect(secondReviewAnswer).toBeChecked();
  await checkButton.focus();
  await checkButton.press("Enter");

  await expect(page.getByRole("status")).toContainText("Review:");
  await expect(page.getByText("Quiz complete")).toBeVisible();

  const retryButton = page.getByRole("button", { name: "Retry quiz" });

  await retryButton.focus();
  await expect(retryButton).toBeFocused();
  await retryButton.press("Enter");
  await expect(
    page.getByRole("heading", {
      name: "Which request improves Copilot answer quality most reliably?",
      exact: true
    })
  ).toBeVisible();
  await expect(page.getByText("Score: 0/2")).toBeVisible();

  watcher.assertNoFailures();
});

test("interactive lab controls are focusable and respond to keyboard input", async ({
  page
}) => {
  const watcher = await gotoAndCheck(page, "/en/labs");

  const promptLanguage = page.getByRole("tablist", { name: "Prompt language" });
  const koreanTab = promptLanguage.getByRole("tab", { name: "Korean" });

  await koreanTab.focus();
  await expect(koreanTab).toBeFocused();
  await koreanTab.press("Enter");
  await expect(
    page.getByRole("heading", { name: "프롬프트 구조 실습", exact: true })
  ).toBeVisible();
  await expect(page.getByRole("tab", { name: "한국어" })).toHaveAttribute(
    "aria-selected",
    "true"
  );

  const englishTab = page.getByRole("tab", { name: "영어" });

  await englishTab.focus();
  await expect(englishTab).toBeFocused();
  await englishTab.press("Enter");
  await expect(
    page.getByRole("heading", {
      name: "Prompt structure practice",
      exact: true
    })
  ).toBeVisible();
  await expect(page.getByRole("tab", { name: "English" })).toHaveAttribute(
    "aria-selected",
    "true"
  );

  const goalField = page.getByRole("textbox", { name: /^Goal/ });

  await goalField.focus();
  await expect(goalField).toBeFocused();
  await page.keyboard.type("Fix duplicate quiz feedback for keyboard users.");
  await expect(goalField).toHaveValue(
    "Fix duplicate quiz feedback for keyboard users."
  );

  const useSampleButton = page.getByRole("button", { name: "Use sample" });

  await useSampleButton.focus();
  await expect(useSampleButton).toBeFocused();
  await useSampleButton.press("Enter");
  await expect(goalField).toHaveValue(
    "Refactor the checkout form to reduce validation bugs for guest users."
  );

  const clearButton = page.getByRole("button", { name: "Clear" });

  await clearButton.focus();
  await expect(clearButton).toBeFocused();
  await clearButton.press("Enter");
  await expect(goalField).toHaveValue("");

  const officialDocsButton = page.getByRole("button", { name: /Official docs/ });

  await officialDocsButton.focus();
  await expect(officialDocsButton).toBeFocused();
  await officialDocsButton.press("Space");
  await expect(page.getByText("Selected context: Official docs")).toBeVisible();

  const testGenerationButton = page.getByRole("button", {
    name: /Test generation/
  });

  await testGenerationButton.focus();
  await expect(testGenerationButton).toBeFocused();
  await testGenerationButton.press("Enter");
  await expect(page.getByText("Active stage: Test generation")).toBeVisible();

  const observeButton = page.getByRole("button", { name: "Select Observe" });

  await observeButton.focus();
  await expect(observeButton).toBeFocused();
  await observeButton.press("Space");
  await expect(page.getByText("Selected loop step: Observe")).toBeVisible();

  watcher.assertNoFailures();
});

test("showcase controls expose keyboard-operable buttons and checkboxes", async ({
  page
}) => {
  const watcher = await gotoAndCheck(
    page,
    "/en/showcase/agentic-workflow-control-room"
  );

  const securityAgentButton = page.getByRole("button", {
    name: "Select Security Agent"
  });

  await securityAgentButton.focus();
  await expect(securityAgentButton).toBeFocused();
  await securityAgentButton.press("Enter");
  await expect(page.getByText("Selected: Security Agent")).toBeVisible();

  const approvalStageButton = page.getByRole("button", {
    name: "Select Approval stage"
  });

  await approvalStageButton.focus();
  await expect(approvalStageButton).toBeFocused();
  await approvalStageButton.press("Enter");
  await expect(page.getByText("Selected trace: Approval")).toBeVisible();

  const securityApproval = page.getByRole("checkbox", {
    name: "Security scan clean"
  });

  await expect(securityApproval).not.toBeChecked();
  await securityApproval.focus();
  await expect(securityApproval).toBeFocused();
  await securityApproval.press("Space");
  await expect(securityApproval).toBeChecked();

  watcher.assertNoFailures();
});
