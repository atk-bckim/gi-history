"use client";

import { useEffect, useState } from "react";
import type { MdxHeading } from "@/lib/content/mdx-docs";
import type { Locale } from "@/lib/i18n/config";

type LessonTableOfContentsProps = {
  headings: MdxHeading[];
  locale: Locale;
};

function clampProgress(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function LessonTableOfContents({
  headings,
  locale
}: LessonTableOfContentsProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    const updateReadingState = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress =
        scrollable > 0 ? clampProgress((window.scrollY / scrollable) * 100) : 0;

      setProgress(nextProgress);

      const visibleHeading = headings
        .map((heading) => ({
          id: heading.id,
          top:
            document.getElementById(heading.id)?.getBoundingClientRect().top ??
            Number.POSITIVE_INFINITY
        }))
        .filter((heading) => heading.top <= 120)
        .at(-1);

      if (visibleHeading) {
        setActiveId(visibleHeading.id);
      } else {
        setActiveId(headings[0].id);
      }
    };

    updateReadingState();
    window.addEventListener("scroll", updateReadingState, { passive: true });
    window.addEventListener("resize", updateReadingState);

    return () => {
      window.removeEventListener("scroll", updateReadingState);
      window.removeEventListener("resize", updateReadingState);
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  const progressLabel = locale === "ko" ? "읽기 진행률" : "Reading progress";

  return (
    <section className="rounded-lg border border-line bg-white/75 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-ink">
          {locale === "ko" ? "문서 목차" : "On this page"}
        </h2>
        <span className="font-mono text-xs text-muted">{progress}%</span>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>{progressLabel}</span>
        </div>
        <div
          aria-label={progressLabel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          role="progressbar"
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-canvas"
        >
          <div
            className="h-full rounded-full bg-microsoft transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <nav
        aria-label={locale === "ko" ? "문서 목차" : "On this page"}
        className="mt-4 space-y-1 text-sm"
      >
        {headings.map((heading) => {
          const isActive = activeId === heading.id;

          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              aria-current={isActive ? "location" : undefined}
              onClick={() => setActiveId(heading.id)}
              className={
                heading.level === 3
                  ? [
                      "block rounded-md py-1.5 pl-5 pr-2 leading-5 transition",
                      isActive
                        ? "bg-canvas font-semibold text-ink"
                        : "text-muted hover:bg-canvas hover:text-ink"
                    ].join(" ")
                  : [
                      "block rounded-md px-2 py-1.5 font-medium leading-5 transition",
                      isActive
                        ? "bg-canvas text-ink"
                        : "text-muted hover:bg-canvas hover:text-ink"
                    ].join(" ")
              }
            >
              {heading.text}
            </a>
          );
        })}
      </nav>
    </section>
  );
}
