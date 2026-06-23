import { expect, test, type ConsoleMessage, type Page } from "@playwright/test";

type PageFailure = {
  kind: "console" | "pageerror" | "response";
  message: string;
};

type OverflowOffender = {
  selector: string;
  text: string;
  left: number;
  right: number;
  width: number;
};

type OverflowSnapshot = {
  viewportWidth: number;
  documentWidth: number;
  overflowBy: number;
  offenders: OverflowOffender[];
};

const ignoredConsolePatterns = [/GPU stall/i, /WebGL.*GPU/i, /ReadPixels/i];

const mobileRoutes = [
  { path: "/ko", heading: "AI 활용부터 작업환경 설계까지" },
  { path: "/ko/labs", heading: "AI Copilot 실습실" },
  {
    path: "/en/github-copilot",
    heading: "GitHub Copilot overview and learning path",
  },
  {
    path: "/en/github-copilot/vscode",
    heading: "VS Code Copilot fundamentals and context targeting",
  },
  {
    path: "/ko/github-copilot/cli",
    heading: "Copilot CLI와 승인 기반 개발 루프",
  },
  {
    path: "/ko/github-copilot/review",
    heading: "Copilot 코드 리뷰, 보안, 관리자 정책",
  },
  {
    path: "/ko/agentic-ai",
    heading: "프롬프트에서 하네스와 루프 엔지니어링까지",
  },
  {
    path: "/en/microsoft-copilot",
    heading: "Microsoft Copilot for work and governance",
  },
  {
    path: "/en/paths",
    heading: "Role-based learning paths",
  },
  {
    path: "/en/showcase",
    heading: "High-complexity web showcases built with AI",
  },
  {
    path: "/en/showcase/digital-twin",
    heading: "3D Digital Twin Command Center",
  },
  {
    path: "/en/showcase/semiconductor-design-explorer",
    heading: "3D Semiconductor Design Explorer",
  },
  {
    path: "/en/showcase/agentic-workflow-control-room",
    heading: "Agentic Workflow Control Room",
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

async function getOverflowSnapshot(page: Page): Promise<OverflowSnapshot> {
  return page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const documentWidth = Math.max(
      document.documentElement.scrollWidth,
      document.body?.scrollWidth ?? 0,
    );

    const offenders = Array.from(
      document.body.querySelectorAll<HTMLElement>("*"),
    )
      .flatMap((element) => {
        const style = window.getComputedStyle(element);

        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          style.opacity === "0"
        ) {
          return [];
        }

        const rect = element.getBoundingClientRect();

        if (rect.width <= 0 || rect.height <= 0) {
          return [];
        }

        if (rect.left >= -1 && rect.right <= viewportWidth + 1) {
          return [];
        }

        const id = element.id ? `#${element.id}` : "";
        const className =
          typeof element.className === "string"
            ? element.className
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 4)
                .map((name) => `.${name}`)
                .join("")
            : "";

        return [
          {
            selector: `${element.tagName.toLowerCase()}${id}${className}`,
            text: (element.textContent ?? "")
              .trim()
              .replace(/\s+/g, " ")
              .slice(0, 80),
            left: Math.floor(rect.left),
            right: Math.ceil(rect.right),
            width: Math.ceil(rect.width),
          },
        ];
      })
      .slice(0, 8);

    return {
      viewportWidth,
      documentWidth,
      overflowBy: documentWidth - viewportWidth,
      offenders,
    };
  });
}

test.describe("mobile responsive layout", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const route of mobileRoutes) {
    test(`${route.path} has no horizontal overflow`, async ({ page }) => {
      const watcher = watchPageFailures(page);

      await page.goto(route.path, { waitUntil: "domcontentloaded" });
      await expect(
        page.getByRole("heading", { name: route.heading, exact: true }),
      ).toBeVisible();

      await expect
        .poll(async () => (await getOverflowSnapshot(page)).overflowBy)
        .toBeLessThanOrEqual(1);

      const overflow = await getOverflowSnapshot(page);
      expect(
        overflow.documentWidth,
        `Horizontal overflow on ${route.path}: ${JSON.stringify(
          overflow,
          null,
          2,
        )}`,
      ).toBeLessThanOrEqual(overflow.viewportWidth + 1);

      watcher.assertNoFailures();
    });
  }
});
