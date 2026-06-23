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
        message: `${response.status()} ${response.url()}`,
      });
    }
  });

  return {
    assertNoFailures() {
      expect(
        failures.map((failure) => `${failure.kind}: ${failure.message}`),
      ).toEqual([]);
    },
  };
}

async function gotoAndCheck(page: Page, path: string) {
  const watcher = watchPageFailures(page);

  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expect(page.locator("body")).toBeVisible();

  return watcher;
}

async function expectLessonDocument(page: Page) {
  const article = page.locator(".lesson-markdown");

  await expect(article).toBeVisible();
  await expect.poll(() => article.locator("h2").count()).toBeGreaterThan(1);
  await expect.poll(() => article.locator("table").count()).toBeGreaterThan(0);
  await expect(article.locator("h1")).toHaveCount(0);
}

test("Korean home page renders the learning dashboard", async ({ page }) => {
  const watcher = await gotoAndCheck(page, "/ko");

  await expect(page.getByText("AI 활용부터")).toBeVisible();
  await expect(page.getByText("작업환경 설계까지")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /GitHub Copilot 시작/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "핵심 개념 흐름" }),
  ).toBeVisible();

  watcher.assertNoFailures();
});

test("Korean VS Code Copilot lesson renders MDX sections and table", async ({
  page,
}) => {
  const watcher = await gotoAndCheck(page, "/ko/github-copilot/vscode");

  await expect(
    page.getByRole("heading", {
      name: "VS Code Copilot 기본기와 컨텍스트 지정",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "표면별 역할" }),
  ).toBeVisible();
  await expectLessonDocument(page);

  watcher.assertNoFailures();
});

test("Korean Copilot agents lesson renders MDX sections and table", async ({
  page,
}) => {
  const watcher = await gotoAndCheck(page, "/ko/github-copilot/agents");

  await expect(
    page.getByRole("heading", { name: "Cloud/Coding Agent와 IDE Agent Mode" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "한눈에 비교" }),
  ).toBeVisible();
  await expectLessonDocument(page);

  watcher.assertNoFailures();
});

test("Korean labs page renders the interactive lab surface", async ({
  page,
}) => {
  const watcher = await gotoAndCheck(page, "/ko/labs");

  await expect(
    page.getByRole("heading", { name: "AI Copilot 실습실" }),
  ).toBeVisible();
  await expect(page.getByText("Interactive Labs")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "프롬프트 구조 실습" }),
  ).toBeVisible();

  watcher.assertNoFailures();
});

test("English showcase page renders the showcase landing surface", async ({
  page,
}) => {
  const watcher = await gotoAndCheck(page, "/en/showcase");

  await expect(
    page.getByRole("heading", {
      name: "High-complexity web showcases built with AI",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "3D Digital Twin Command Center" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Open Digital Twin/ }),
  ).toBeVisible();

  watcher.assertNoFailures();
});

test.describe("digital twin", () => {
  test("desktop renders command center and a reasonably sized canvas", async ({
    page,
  }) => {
    const watcher = await gotoAndCheck(page, "/en/showcase/digital-twin");

    await expect(
      page.getByRole("heading", { name: "3D Digital Twin Command Center" }),
    ).toBeVisible();
    await expect(page.getByText("Semiconductor Fab - Line 7")).toBeVisible();
    await expect(page.getByText("AI COPILOT ANALYSIS")).toBeVisible();

    const canvas = page.locator("canvas").first();
    await expect(canvas).toBeVisible();

    await expect
      .poll(async () => {
        const box = await canvas.boundingBox();
        return (box?.width ?? 0) > 500 && (box?.height ?? 0) > 400;
      })
      .toBe(true);

    const box = await canvas.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThan(500);
    expect(box?.height ?? 0).toBeGreaterThan(400);

    watcher.assertNoFailures();
  });

  test("mobile renders the responsive telemetry fallback", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const watcher = await gotoAndCheck(page, "/en/showcase/digital-twin");

    await expect(
      page.getByRole("heading", { name: "3D Digital Twin Command Center" }),
    ).toBeVisible();
    await expect(page.getByTestId("mobile-fallback-panel")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Line 7 telemetry map" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Select CMP-03" }),
    ).toBeVisible();

    watcher.assertNoFailures();
  });
});

test.describe("advanced showcase pages", () => {
  test("semiconductor explorer renders the interactive 3D design surface", async ({
    page,
  }) => {
    const watcher = await gotoAndCheck(
      page,
      "/en/showcase/semiconductor-design-explorer",
    );

    await expect(
      page.getByRole("heading", { name: "3D Semiconductor Design Explorer" }),
    ).toBeVisible();
    await expect(page.getByText("AI PACKAGE REVIEW")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "MCP PACKAGE CONTEXT", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("checkbox", { name: "Interposer / RDL" })).toBeVisible();
    await expect(page.getByRole("checkbox", { name: "Defects" })).toBeVisible();

    const canvas = page.locator("canvas").first();
    await expect(canvas).toBeVisible();
    await expect
      .poll(async () => {
        const box = await canvas.boundingBox();
        return (box?.width ?? 0) > 420 && (box?.height ?? 0) > 300;
      })
      .toBe(true);
    await expect(page.getByText("Advanced package fallback is active")).toBeHidden();

    watcher.assertNoFailures();
  });

  test("agentic workflow control room renders trace graph and approvals", async ({
    page,
  }) => {
    const watcher = await gotoAndCheck(
      page,
      "/en/showcase/agentic-workflow-control-room",
    );

    await expect(
      page.getByRole("heading", { name: "Agentic Workflow Control Room" }),
    ).toBeVisible();
    await expect(page.getByText("AGENT ROSTER")).toBeVisible();
    await expect(page.getByText("WORKFLOW GRAPH")).toBeVisible();
    await expect(page.getByText("APPROVAL GATE")).toBeVisible();
    await expect(page.getByRole("button", { name: "Implementer Agent" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Approval" })).toBeVisible();

    watcher.assertNoFailures();
  });
});
