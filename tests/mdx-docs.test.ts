import { describe, expect, it } from "vitest";
import { getMdxDocument } from "@/lib/content/mdx-docs";
import { lessons } from "@/lib/content/registry";
import { locales } from "@/lib/i18n/config";

describe("MDX lesson documents", () => {
  it("adds stable heading anchors and table-of-contents data", () => {
    const document = getMdxDocument("ko", "/github-copilot/vscode");

    expect(document).not.toBeNull();
    expect(document?.headings.length).toBeGreaterThanOrEqual(6);
    expect(document?.headings[0]).toEqual({
      id: "section-1",
      level: 2,
      text: "표면별 역할"
    });
    expect(document?.html).toContain('id="section-1"');
    expect(document?.html).not.toContain(
      "<h1>VS Code에서 GitHub Copilot 사용하기</h1>"
    );
  });

  it("preserves detailed source references from lesson frontmatter", () => {
    const document = getMdxDocument("en", "/github-copilot/vscode");

    expect(document).not.toBeNull();
    expect(document?.sourceRefs.length).toBeGreaterThanOrEqual(6);
    expect(document?.sourceRefs.map((source) => source.id)).toContain(
      "vscode-trust-safety"
    );

    for (const source of document?.sourceRefs ?? []) {
      expect(() => new URL(source.url)).not.toThrow();
      expect(source.title.length).toBeGreaterThan(5);
      expect(source.publisher.length).toBeGreaterThan(5);
    }
  });

  it("ships a deep GitHub Copilot overview lesson instead of only a card hub", () => {
    const document = getMdxDocument("en", "/github-copilot");

    expect(document).not.toBeNull();
    expect(document?.headings.map((heading) => heading.text)).toContain(
      "Which Copilot surface should you use?"
    );
    expect(document?.html).toContain("Copilot Business");
    expect(document?.html).toContain("cloud agent");
    expect(document?.html).toContain("MCP");
    expect(document?.sourceRefs.length).toBeGreaterThanOrEqual(5);
  });

  it("keeps CLI and cloud-agent lessons grounded in operational practice", () => {
    const expectations = [
      {
        locale: "en" as const,
        slug: "/github-copilot/cli",
        phrases: [
          "approval matrix",
          "no-write investigation",
          "MCP",
          "practice run"
        ]
      },
      {
        locale: "ko" as const,
        slug: "/github-copilot/cli",
        phrases: [
          "승인 매트릭스",
          "쓰기 없는 조사",
          "MCP",
          "실습 흐름"
        ]
      },
      {
        locale: "en" as const,
        slug: "/github-copilot/agents",
        phrases: [
          "issue brief",
          "PR review contract",
          "MCP and cloud agent",
          "rollback"
        ]
      },
      {
        locale: "ko" as const,
        slug: "/github-copilot/agents",
        phrases: [
          "이슈 브리프",
          "PR 리뷰 계약",
          "MCP와 cloud agent",
          "롤백"
        ]
      }
    ];

    for (const expectation of expectations) {
      const document = getMdxDocument(expectation.locale, expectation.slug);

      expect(document, `${expectation.locale} ${expectation.slug}`).not.toBeNull();

      for (const phrase of expectation.phrases) {
        expect(
          document?.html.toLowerCase(),
          `${expectation.locale} ${expectation.slug} should include ${phrase}`
        ).toContain(phrase.toLowerCase());
      }
    }
  });

  it("keeps VS Code and review lessons grounded in team operating models", () => {
    const expectations = [
      {
        locale: "en" as const,
        slug: "/github-copilot/vscode",
        phrases: [
          "context pack",
          "agent-mode dry run",
          "workspace trust checklist",
          "surface decision matrix"
        ]
      },
      {
        locale: "ko" as const,
        slug: "/github-copilot/vscode",
        phrases: [
          "컨텍스트 팩",
          "agent-mode dry run",
          "workspace trust 체크리스트",
          "표면 선택 매트릭스"
        ]
      },
      {
        locale: "en" as const,
        slug: "/github-copilot/review",
        phrases: [
          "policy matrix",
          "security triage runbook",
          "automatic review rollout",
          "exception register"
        ]
      },
      {
        locale: "ko" as const,
        slug: "/github-copilot/review",
        phrases: [
          "정책 매트릭스",
          "보안 triage runbook",
          "automatic review rollout",
          "예외 등록부"
        ]
      }
    ];

    for (const expectation of expectations) {
      const document = getMdxDocument(expectation.locale, expectation.slug);

      expect(document, `${expectation.locale} ${expectation.slug}`).not.toBeNull();

      for (const phrase of expectation.phrases) {
        expect(
          document?.html.toLowerCase(),
          `${expectation.locale} ${expectation.slug} should include ${phrase}`
        ).toContain(phrase.toLowerCase());
      }
    }
  });

  it("teaches agentic AI as operational practice, not only vocabulary", () => {
    const expectations = [
      {
        locale: "en" as const,
        slug: "/agentic-ai",
        phrases: [
          "deep interview script",
          "brainstorming funnel",
          "subagent delegation brief",
          "harness readiness scorecard",
          "Ralph Wiggum Loop"
        ]
      },
      {
        locale: "ko" as const,
        slug: "/agentic-ai",
        phrases: [
          "딥 인터뷰 스크립트",
          "브레인스토밍 퍼널",
          "서브에이전트 위임 브리프",
          "하네스 준비도 스코어카드",
          "Ralph Wiggum Loop"
        ]
      }
    ];

    for (const expectation of expectations) {
      const document = getMdxDocument(expectation.locale, expectation.slug);

      expect(document, `${expectation.locale} ${expectation.slug}`).not.toBeNull();

      for (const phrase of expectation.phrases) {
        expect(
          document?.html.toLowerCase(),
          `${expectation.locale} ${expectation.slug} should include ${phrase}`
        ).toContain(phrase.toLowerCase());
      }
    }
  });

  it("keeps Microsoft Copilot training tied to rollout artifacts", () => {
    const expectations = [
      {
        locale: "en" as const,
        slug: "/microsoft-copilot",
        phrases: [
          "department rollout playbook",
          "meeting recap prompt",
          "connector decision register",
          "Purview evidence checklist",
          "agent knowledge-source review"
        ]
      },
      {
        locale: "ko" as const,
        slug: "/microsoft-copilot",
        phrases: [
          "부서별 rollout playbook",
          "회의 요약 프롬프트",
          "connector 결정 등록부",
          "Purview 증거 체크리스트",
          "agent knowledge-source 검토"
        ]
      }
    ];

    for (const expectation of expectations) {
      const document = getMdxDocument(expectation.locale, expectation.slug);

      expect(document, `${expectation.locale} ${expectation.slug}`).not.toBeNull();

      for (const phrase of expectation.phrases) {
        expect(
          document?.html.toLowerCase(),
          `${expectation.locale} ${expectation.slug} should include ${phrase}`
        ).toContain(phrase.toLowerCase());
      }
    }
  });

  it("keeps every registered lesson backed by substantive bilingual MDX", () => {
    for (const lesson of lessons) {
      for (const locale of locales) {
        const document = getMdxDocument(locale, lesson.slug);

        expect(document, `${locale} ${lesson.slug}`).not.toBeNull();
        expect(document?.headings.length, `${locale} ${lesson.slug} headings`)
          .toBeGreaterThanOrEqual(5);
        expect(document?.html, `${locale} ${lesson.slug} practice`).toMatch(
          locale === "ko" ? /실습|시나리오|체크리스트/ : /Practice|Scenario|Checklist/i
        );
        expect(document?.html, `${locale} ${lesson.slug} investigation date`).toMatch(
          locale === "ko" ? /조사 기준|조사 기준일/ : /Investigation date/i
        );
        expect(document?.sourceRefs.length, `${locale} ${lesson.slug} sources`)
          .toBeGreaterThanOrEqual(2);
      }
    }
  });
});
