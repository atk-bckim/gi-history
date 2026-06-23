import { describe, expect, it } from "vitest";
import {
  glossaryTerms,
  lessons,
  resourceSections,
  sourceRefs
} from "@/lib/content/registry";

describe("content registry", () => {
  it("ships paired Korean and English lesson content", () => {
    const lessonIds = new Set(lessons.map((lesson) => lesson.id));

    expect(lessonIds.has("github-copilot-vscode")).toBe(true);
    expect(lessonIds.has("github-copilot-cli")).toBe(true);
    expect(lessonIds.has("agentic-ai-evolution")).toBe(true);

    for (const lesson of lessons) {
      expect(lesson.title.ko.length).toBeGreaterThan(5);
      expect(lesson.title.en.length).toBeGreaterThan(5);
      expect(lesson.summary.ko.length).toBeGreaterThan(20);
      expect(lesson.summary.en.length).toBeGreaterThan(20);
      expect(lesson.sourceRefIds.length).toBeGreaterThan(0);
    }
  });

  it("links every lesson source reference to a known source", () => {
    const knownSourceIds = new Set(sourceRefs.map((source) => source.id));

    for (const lesson of lessons) {
      for (const sourceId of lesson.sourceRefIds) {
        expect(knownSourceIds.has(sourceId)).toBe(true);
      }
    }
  });

  it("keeps bilingual glossary terms searchable in both languages", () => {
    const requiredTermIds = [
      "prompt-engineering",
      "context-engineering",
      "mcp",
      "rag",
      "agent",
      "agent-skill",
      "subagent",
      "harness-engineering",
      "loop-engineering",
      "rlhf-feedback-loop",
      "evals",
      "tool-use",
      "custom-instructions",
      "prompt-files",
      "cloud-coding-agent",
      "inline-chat",
      "edit-mode",
      "agent-mode",
      "workspace-trust",
      "terminal-sandboxing",
      "content-exclusion",
      "public-code-matching",
      "enterprise-data-protection",
      "microsoft-graph",
      "purview",
      "copilot-studio",
      "custom-agents",
      "tool-approval",
      "code-scanning"
    ];

    expect(glossaryTerms.length).toBeGreaterThanOrEqual(
      requiredTermIds.length
    );

    const termIds = new Set(glossaryTerms.map((term) => term.id));
    for (const termId of requiredTermIds) {
      expect(termIds.has(termId)).toBe(true);
    }

    for (const term of glossaryTerms) {
      expect(term.term.ko.length).toBeGreaterThan(1);
      expect(term.term.en.length).toBeGreaterThan(2);
      expect(term.definition.ko.length).toBeGreaterThan(10);
      expect(term.definition.en.length).toBeGreaterThan(10);
      expect(term.learnerNotes.ko.length).toBeGreaterThan(20);
      expect(term.learnerNotes.en.length).toBeGreaterThan(20);
      expect(term.related.length).toBeGreaterThan(0);
      expect(term.keywords.length).toBeGreaterThan(1);

      for (const relatedId of term.related) {
        expect(termIds.has(relatedId)).toBe(true);
      }
    }
  });

  it("ships structured bilingual resource categories for learner workflows", () => {
    const requiredSectionIds = [
      "official-docs",
      "copilot-workflow-checklists",
      "prompt-templates",
      "governance-security-checklist",
      "practice-scenarios"
    ];

    const sectionIds = new Set(resourceSections.map((section) => section.id));
    for (const sectionId of requiredSectionIds) {
      expect(sectionIds.has(sectionId)).toBe(true);
    }

    for (const section of resourceSections) {
      const knownSourceIds = new Set(sourceRefs.map((source) => source.id));

      expect(section.title.ko.length).toBeGreaterThan(2);
      expect(section.title.en.length).toBeGreaterThan(5);
      expect(section.summary.ko.length).toBeGreaterThan(20);
      expect(section.summary.en.length).toBeGreaterThan(20);
      expect(section.items.length).toBeGreaterThan(0);

      for (const item of section.items) {
        expect(item.title.ko.length).toBeGreaterThan(2);
        expect(item.title.en.length).toBeGreaterThan(5);
        expect(item.description.ko.length).toBeGreaterThan(20);
        expect(item.description.en.length).toBeGreaterThan(20);
        expect(item.actions.length).toBeGreaterThan(0);

        for (const sourceId of item.sourceRefIds ?? []) {
          expect(knownSourceIds.has(sourceId)).toBe(true);
        }
      }
    }
  });
});
