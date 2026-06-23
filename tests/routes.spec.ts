import { expect, test, type ConsoleMessage, type Page } from "@playwright/test";

type PageFailure = {
  kind: "console" | "pageerror" | "response";
  message: string;
};

type RouteSmokeCase = {
  path: string;
  heading: string;
};

const ignoredConsolePatterns = [/GPU stall/i, /WebGL.*GPU/i, /ReadPixels/i];

const routeSmokeCases: RouteSmokeCase[] = [
  {
    path: "/ko",
    heading: "AI 활용부터 작업환경 설계까지",
  },
  {
    path: "/en",
    heading: "From using AI tools to designing the environment where AI works",
  },
  {
    path: "/ko/glossary",
    heading: "한영 AI 용어집",
  },
  {
    path: "/en/glossary",
    heading: "Bilingual AI glossary",
  },
  {
    path: "/ko/resources",
    heading: "자료실과 공식 출처",
  },
  {
    path: "/en/resources",
    heading: "Resources and primary sources",
  },
  {
    path: "/ko/microsoft-copilot",
    heading: "Microsoft Copilot 업무 활용과 거버넌스",
  },
  {
    path: "/en/microsoft-copilot",
    heading: "Microsoft Copilot for work and governance",
  },
  {
    path: "/ko/agentic-ai",
    heading: "프롬프트에서 하네스와 루프 엔지니어링까지",
  },
  {
    path: "/en/agentic-ai",
    heading: "From prompts to harness and loop engineering",
  },
  {
    path: "/ko/paths",
    heading: "역할별 학습 경로",
  },
  {
    path: "/en/paths",
    heading: "Role-based learning paths",
  },
  {
    path: "/ko/github-copilot",
    heading: "GitHub Copilot 전체 지도와 학습 순서",
  },
  {
    path: "/en/github-copilot",
    heading: "GitHub Copilot overview and learning path",
  },
  {
    path: "/ko/github-copilot/cli",
    heading: "Copilot CLI와 승인 기반 개발 루프",
  },
  {
    path: "/en/github-copilot/cli",
    heading: "Copilot CLI and approval-based development loops",
  },
  {
    path: "/ko/github-copilot/review",
    heading: "Copilot 코드 리뷰, 보안, 관리자 정책",
  },
  {
    path: "/en/github-copilot/review",
    heading: "Copilot code review, security, and admin policy",
  },
];

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

test.describe("localized route smoke", () => {
  for (const route of routeSmokeCases) {
    test(`${route.path} renders its primary content`, async ({ page }) => {
      const watcher = watchPageFailures(page);
      const response = await page.goto(route.path, {
        waitUntil: "domcontentloaded",
      });

      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator("body")).toBeVisible();
      await expect(
        page.getByRole("heading", { name: route.heading, exact: true }),
      ).toBeVisible();

      watcher.assertNoFailures();
    });
  }
});

test("role-based paths expose concrete learner tracks and outcomes", async ({
  page,
}) => {
  const watcher = watchPageFailures(page);

  await page.goto("/en/paths", { waitUntil: "domcontentloaded" });

  await expect(
    page.getByRole("heading", { name: "Developer path", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Technical leader path", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Business user path", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Educator path", exact: true }),
  ).toBeVisible();

  await expect(page.getByText(/Start with GitHub Copilot overview/i)).toBeVisible();
  await expect(page.getByText(/Finish in AI Copilot Labs/i)).toBeVisible();
  await expect(page.getByText(/Team operating artifact/i)).toBeVisible();
  await expect(page.getByText(/Evidence of completion/i)).toBeVisible();

  watcher.assertNoFailures();
});

test("SEO metadata routes expose sitemap and robots files", async ({
  request,
}) => {
  const sitemap = await request.get("/sitemap.xml");
  const sitemapText = await sitemap.text();

  expect(sitemap.status()).toBeLessThan(400);
  expect(sitemapText).toContain("https://ai-copilot-guide.local/ko");
  expect(sitemapText).toContain(
    "https://ai-copilot-guide.local/en/github-copilot/cli",
  );
  expect(sitemapText).toContain(
    "https://ai-copilot-guide.local/en/showcase/digital-twin",
  );

  const robots = await request.get("/robots.txt");
  const robotsText = await robots.text();

  expect(robots.status()).toBeLessThan(400);
  expect(robotsText).toContain("User-Agent: *");
  expect(robotsText).toContain(
    "Sitemap: https://ai-copilot-guide.local/sitemap.xml",
  );
});
