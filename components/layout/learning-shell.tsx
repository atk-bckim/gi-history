import Link from "next/link";
import { ArrowRight, BookMarked, Clock3, ExternalLink } from "lucide-react";
import { LessonTableOfContents } from "@/components/layout/lesson-table-of-contents";
import type { MdxHeading } from "@/lib/content/mdx-docs";
import type { Lesson, SourceRef } from "@/lib/content/types";
import { getSourceRefs } from "@/lib/content/selectors";
import { getLocalizedPath, type Locale } from "@/lib/i18n/config";

type LearningShellProps = {
  locale: Locale;
  lesson: Lesson;
  toc?: MdxHeading[];
  sourceRefs?: SourceRef[];
  children: React.ReactNode;
};

export function LearningShell({
  locale,
  lesson,
  toc = [],
  sourceRefs,
  children
}: LearningShellProps) {
  const sources = sourceRefs && sourceRefs.length > 0
    ? sourceRefs
    : getSourceRefs(lesson.sourceRefIds);

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)_280px] lg:px-8">
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-lg border border-line bg-white/65 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            {locale === "ko" ? "커리큘럼" : "Curriculum"}
          </p>
          <nav className="mt-4 space-y-2 text-sm">
            {[
              ["/github-copilot", "GitHub Copilot"],
              ["/github-copilot/vscode", "VS Code"],
              ["/github-copilot/cli", "Copilot CLI"],
              ["/github-copilot/agents", locale === "ko" ? "에이전트" : "Agents"],
              ["/github-copilot/review", locale === "ko" ? "리뷰" : "Review"],
              ["/agentic-ai", "Agentic AI"]
            ].map(([href, label]) => (
              <Link
                key={href}
                href={getLocalizedPath(locale, href)}
                className="block rounded-md px-3 py-2 font-medium text-muted transition hover:bg-white hover:text-ink"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <article className="min-w-0">
        <header className="rounded-lg border border-line bg-white/75 p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            <span className="inline-flex items-center gap-2">
              <BookMarked aria-hidden className="h-4 w-4 text-microsoft" />
              {lesson.level}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 aria-hidden className="h-4 w-4 text-microsoft" />
              {lesson.durationMinutes} min
            </span>
            <span>
              {locale === "ko" ? "조사 기준" : "Research baseline"}{" "}
              {lesson.updatedAt}
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-normal text-ink">
            {lesson.title[locale]}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            {lesson.summary[locale]}
          </p>
        </header>

        <div className="prose prose-neutral mt-6 max-w-none rounded-lg border border-line bg-white/70 p-6 shadow-sm prose-headings:tracking-normal prose-p:text-muted prose-a:text-microsoft sm:p-8">
          {children}
        </div>

        <Link
          href={getLocalizedPath(locale, "/labs")}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-github px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-microsoft"
        >
          {locale === "ko" ? "관련 실습 열기" : "Open related lab"}
          <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
      </article>

      <aside className="space-y-5">
        {toc.length > 0 ? (
          <LessonTableOfContents headings={toc} locale={locale} />
        ) : null}

        <section className="rounded-lg border border-line bg-white/75 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-ink">
            {locale === "ko" ? "학습 결과" : "Learning outcomes"}
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
            {lesson.outcomes.map((outcome) => (
              <li key={outcome.en}>{outcome[locale]}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-line bg-white/75 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-ink">
            {locale === "ko" ? "공식 출처" : "Primary sources"}
          </h2>
          <div className="mt-4 space-y-3">
            {sources.map((source) => (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2 rounded-md border border-line bg-canvas p-3 text-sm text-muted transition hover:border-microsoft hover:text-ink"
              >
                <ExternalLink aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  <span className="block font-semibold text-ink">{source.title}</span>
                  <span className="block text-xs">{source.publisher}</span>
                </span>
              </a>
            ))}
          </div>
        </section>
      </aside>
    </main>
  );
}
