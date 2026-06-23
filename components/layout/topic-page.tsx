import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Lesson } from "@/lib/content/types";
import { getLocalizedPath, type Locale } from "@/lib/i18n/config";

export function TopicPage({
  locale,
  title,
  description,
  lessonsForTopic,
  surface = "main"
}: {
  locale: Locale;
  title: string;
  description: string;
  lessonsForTopic: Lesson[];
  surface?: "main" | "section";
}) {
  const Wrapper = surface;

  return (
    <Wrapper className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-normal text-ink">
          {title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted">{description}</p>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {lessonsForTopic.map((lesson) => (
          <Link
            key={lesson.id}
            href={getLocalizedPath(locale, lesson.slug)}
            className="group rounded-lg border border-line bg-white/70 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-microsoft hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-microsoft"
          >
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
              {lesson.level} · {lesson.durationMinutes} min
            </p>
            <h2 className="mt-3 text-xl font-semibold text-ink">
              {lesson.title[locale]}
            </h2>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">
              {lesson.summary[locale]}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-microsoft">
              {locale === "ko" ? "열기" : "Open"}
              <ArrowRight
                aria-hidden
                className="h-4 w-4 transition group-hover:translate-x-0.5"
              />
            </span>
          </Link>
        ))}
      </section>
    </Wrapper>
  );
}
