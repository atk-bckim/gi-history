"use client";

import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  glossaryTerms,
  lessons,
  resourceSections
} from "@/lib/content/registry";
import { getLocalizedPath, type Locale } from "@/lib/i18n/config";

type SearchKind = "lesson" | "glossary" | "resource";

type SearchItem = {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle: string;
  href: string;
  haystack: string;
};

const copy = {
  ko: {
    label: "학습 콘텐츠 검색",
    placeholder: "예: MCP, agent mode, 거버넌스, 프롬프트",
    results: "검색 결과",
    empty: "검색 결과가 없습니다. 다른 용어나 영어 원어로 다시 검색해 보세요.",
    lesson: "Lesson",
    glossary: "Glossary",
    resource: "Resource"
  },
  en: {
    label: "Search learning content",
    placeholder: "Try MCP, agent mode, governance, prompt files",
    results: "Search results",
    empty: "No results. Try another term or the Korean/English source word.",
    lesson: "Lesson",
    glossary: "Glossary",
    resource: "Resource"
  }
} satisfies Record<Locale, Record<string, string>>;

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function buildSearchItems(locale: Locale): SearchItem[] {
  const alternateLocale: Locale = locale === "ko" ? "en" : "ko";
  const items: SearchItem[] = [];

  for (const lesson of lessons) {
    items.push({
      id: `lesson-${lesson.id}`,
      kind: "lesson",
      title: lesson.title[locale],
      subtitle: lesson.summary[locale],
      href: getLocalizedPath(locale, lesson.slug),
      haystack: normalize(
        [
          lesson.title.ko,
          lesson.title.en,
          lesson.summary.ko,
          lesson.summary.en,
          lesson.tools.join(" "),
          lesson.outcomes.map((outcome) => `${outcome.ko} ${outcome.en}`).join(" ")
        ].join(" ")
      )
    });
  }

  for (const term of glossaryTerms) {
    items.push({
      id: `glossary-${term.id}`,
      kind: "glossary",
      title: term.term[locale],
      subtitle: `${term.term[alternateLocale]} - ${term.definition[locale]}`,
      href: getLocalizedPath(locale, `/glossary#${term.id}`),
      haystack: normalize(
        [
          term.term.ko,
          term.term.en,
          term.definition.ko,
          term.definition.en,
          term.learnerNotes.ko,
          term.learnerNotes.en,
          term.keywords.join(" "),
          term.related.join(" ")
        ].join(" ")
      )
    });
  }

  for (const section of resourceSections) {
    for (const item of section.items) {
      items.push({
        id: `resource-${section.id}-${item.title.en}`,
        kind: "resource",
        title: item.title[locale],
        subtitle: item.description[locale],
        href: getLocalizedPath(locale, `/resources#${section.id}`),
        haystack: normalize(
          [
            section.title.ko,
            section.title.en,
            section.summary.ko,
            section.summary.en,
            item.title.ko,
            item.title.en,
            item.description.ko,
            item.description.en,
            item.actions.map((action) => `${action.ko} ${action.en}`).join(" ")
          ].join(" ")
        )
      });
    }
  }

  return items;
}

function kindLabel(kind: SearchKind, locale: Locale) {
  return copy[locale][kind];
}

export function StaticSearch({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [query, setQuery] = useState("");
  const items = useMemo(() => buildSearchItems(locale), [locale]);
  const normalizedQuery = normalize(query);
  const results = useMemo(() => {
    if (!normalizedQuery) {
      return items.slice(0, 6);
    }

    return items
      .filter((item) => item.haystack.includes(normalizedQuery))
      .sort((left, right) => {
        const leftTitle = normalize(left.title);
        const rightTitle = normalize(right.title);
        const leftSubtitle = normalize(left.subtitle);
        const rightSubtitle = normalize(right.subtitle);
        const score = (title: string, subtitle: string) =>
          (title.includes(normalizedQuery) ? 10 : 0) +
          (title.startsWith(normalizedQuery) ? 5 : 0) +
          (subtitle.includes(normalizedQuery) ? 3 : 0);

        return score(rightTitle, rightSubtitle) - score(leftTitle, leftSubtitle);
      })
      .slice(0, 8);
  }, [items, normalizedQuery]);

  return (
    <section className="rounded-lg border border-line bg-white/75 p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-github text-white">
          <Search className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-ink">{t.label}</h2>
          <p className="mt-1 text-sm text-muted">
            {locale === "ko"
              ? "강의, 용어집, 자료실을 한 번에 찾습니다."
              : "Search lessons, glossary terms, and resources together."}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <input
          type="search"
          aria-label={t.label}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.placeholder}
          className="w-full rounded-md border border-line bg-paper px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-microsoft focus:bg-white focus:ring-2 focus:ring-microsoft/20"
        />
      </div>

      <div className="mt-5" aria-live="polite">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {t.results}
        </p>
        {results.length > 0 ? (
          <div className="mt-3 grid gap-3">
            {results.map((result) => (
              <a
                key={result.id}
                href={result.href}
                className="group rounded-md border border-line bg-paper p-4 transition hover:border-microsoft hover:bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-xs text-microsoft">
                      {kindLabel(result.kind, locale)}
                    </span>
                    <h3 className="mt-1 text-base font-semibold text-ink">
                      {result.title}
                    </h3>
                  </div>
                  <ArrowRight
                    className="mt-1 h-4 w-4 shrink-0 text-muted transition group-hover:translate-x-1 group-hover:text-microsoft"
                    aria-hidden
                  />
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
                  {result.subtitle}
                </p>
              </a>
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-md border border-line bg-paper px-4 py-3 text-sm text-muted">
            {t.empty}
          </p>
        )}
      </div>
    </section>
  );
}
