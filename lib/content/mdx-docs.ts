import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import type { SourceRef } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/config";

const contentRoot = path.join(process.cwd(), "content");

const contentFileBySlug: Record<string, string> = {
  "/github-copilot": "github-copilot/overview.mdx",
  "/github-copilot/vscode": "github-copilot/vscode.mdx",
  "/github-copilot/cli": "github-copilot/cli.mdx",
  "/github-copilot/agents": "github-copilot/agents.mdx",
  "/github-copilot/review": "github-copilot/review-security-admin.mdx",
  "/microsoft-copilot": "microsoft-copilot/governance.mdx",
  "/agentic-ai": "agentic-ai/concepts.mdx"
};

export type MdxDocument = {
  slug: string;
  locale: Locale;
  html: string;
  headings: MdxHeading[];
  sourceRefs: SourceRef[];
};

export type MdxHeading = {
  id: string;
  level: 2 | 3;
  text: string;
};

function extractFrontmatter(source: string) {
  if (!source.startsWith("---")) {
    return { frontmatter: "", body: source };
  }

  const end = source.indexOf("\n---", 3);
  if (end === -1) {
    return { frontmatter: "", body: source };
  }

  return {
    frontmatter: source.slice(3, end).trim(),
    body: source.slice(end + 4).trim()
  };
}

function parseQuotedValue(line: string, key: string) {
  const match = new RegExp(`^\\s*${key}:\\s*"(.+)"\\s*$`).exec(line);

  return match?.[1] ?? "";
}

function parseFrontmatterSourceRefs(frontmatter: string): SourceRef[] {
  const lines = frontmatter.split(/\r?\n/);
  const sourceStart = lines.findIndex((line) => line.trim() === "sourceRefs:");

  if (sourceStart === -1) {
    return [];
  }

  const sources: SourceRef[] = [];
  let current: Partial<SourceRef> | null = null;

  for (const line of lines.slice(sourceStart + 1)) {
    if (!line.startsWith("  ")) {
      break;
    }

    const idMatch = /^\s+-\s+id:\s*"(.+)"\s*$/.exec(line);
    if (idMatch) {
      if (current?.id && current.title && current.url && current.publisher) {
        sources.push(current as SourceRef);
      }

      current = { id: idMatch[1] };
      continue;
    }

    if (!current) {
      continue;
    }

    const title = parseQuotedValue(line, "title");
    const url = parseQuotedValue(line, "url");
    const publisher = parseQuotedValue(line, "publisher");

    if (title) current.title = title;
    if (url) current.url = url;
    if (publisher) current.publisher = publisher;
  }

  if (current?.id && current.title && current.url && current.publisher) {
    sources.push(current as SourceRef);
  }

  return sources;
}

function stripLeadingH1(source: string) {
  return source.replace(/^# .+(?:\r?\n)+/, "").trim();
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function removeInlineMarkdown(value: string) {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~]/g, "")
    .trim();
}

function addHeadingAnchors(source: string) {
  const headings: MdxHeading[] = [];
  let inFence = false;

  const body = source
    .split(/\r?\n/)
    .map((line) => {
      if (line.trim().startsWith("```")) {
        inFence = !inFence;
        return line;
      }

      if (inFence) {
        return line;
      }

      const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);

      if (!match) {
        return line;
      }

      const level = match[1].length as 2 | 3;
      const text = removeInlineMarkdown(match[2]);
      const id = `section-${headings.length + 1}`;

      headings.push({ id, level, text });

      return `<h${level} id="${id}">${escapeHtml(text)}</h${level}>`;
    })
    .join("\n");

  return { body, headings };
}

marked.use({
  gfm: true,
  breaks: false
});

export function getMdxDocument(locale: Locale, slug: string): MdxDocument | null {
  const relativePath = contentFileBySlug[slug];

  if (!relativePath) {
    return null;
  }

  const filePath = path.join(contentRoot, locale, relativePath);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const source = fs.readFileSync(filePath, "utf8");
  const { frontmatter, body: sourceBody } = extractFrontmatter(source);
  const { body, headings } = addHeadingAnchors(
    stripLeadingH1(sourceBody)
  );

  return {
    slug,
    locale,
    html: marked.parse(body, { async: false }) as string,
    headings,
    sourceRefs: parseFrontmatterSourceRefs(frontmatter)
  };
}
