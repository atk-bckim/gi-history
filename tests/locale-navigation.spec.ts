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

test("locale toggle keeps the lesson slug and persists the selected locale", async ({
  page,
}) => {
  const watcher = watchPageFailures(page);

  await page.goto("/ko/github-copilot/cli", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("heading", {
      name: "Copilot CLI와 승인 기반 개발 루프",
      exact: true,
    }),
  ).toBeVisible();
  const languageToggle = page.locator('[aria-label="Language"]');
  const koreanButton = languageToggle.getByRole("button", {
    name: "KO",
    exact: true,
  });
  const englishButton = languageToggle.getByRole("button", {
    name: "EN",
    exact: true,
  });

  await expect(koreanButton).toHaveAttribute("aria-pressed", "true");

  await expect(async () => {
    await englishButton.click();
    await expect
      .poll(
        () =>
          page.evaluate(() =>
            window.localStorage.getItem("ai-copilot-guide-locale"),
          ),
        { timeout: 1_000 },
      )
      .toBe("en");
    await expect(page).toHaveURL(/\/en\/github-copilot\/cli$/, {
      timeout: 3_000,
    });
  }).toPass({ timeout: 20_000 });

  await expect(
    page.getByRole("heading", {
      name: "Copilot CLI and approval-based development loops",
      exact: true,
    }),
  ).toBeVisible();
  await expect(englishButton).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.localStorage.getItem("ai-copilot-guide-locale"),
      ),
    )
    .toBe("en");
  await expect
    .poll(() =>
      page.evaluate(() => document.cookie.includes("ai-copilot-guide-locale=en")),
    )
    .toBe(true);

  watcher.assertNoFailures();
});

test("root route honors the persisted locale preference", async ({
  context,
  page,
}) => {
  const watcher = watchPageFailures(page);

  await context.addCookies([
    {
      name: "ai-copilot-guide-locale",
      value: "en",
      url: "http://localhost:3000",
    },
  ]);

  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page).toHaveURL(/\/en$/);
  await expect(
    page.getByRole("heading", {
      name: "From using AI tools to designing the environment where AI works",
      exact: true,
    }),
  ).toBeVisible();

  watcher.assertNoFailures();
});
