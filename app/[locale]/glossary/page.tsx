import { glossaryTerms } from "@/lib/content/registry";
import type { Locale } from "@/lib/i18n/config";

export default async function GlossaryPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const termById = new Map(glossaryTerms.map((term) => [term.id, term]));

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-semibold text-ink">
        {locale === "ko" ? "한영 AI 용어집" : "Bilingual AI glossary"}
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
        {locale === "ko"
          ? "한국어로 이해하되 영어 원어를 함께 익히도록 모든 핵심 개념을 병기합니다."
          : "Every core concept is paired across Korean and English so learners can understand locally while reading official source terms."}
      </p>
      <div className="mt-8 grid gap-4">
        {glossaryTerms.map((term) => (
          <section
            key={term.id}
            className="rounded-lg border border-line bg-white/75 p-5 shadow-sm"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-ink">
                  {term.term[locale]}
                </h2>
                <p className="mt-1 font-mono text-sm text-microsoft">
                  {term.term[locale === "ko" ? "en" : "ko"]}
                </p>
              </div>
              <a
                href={`#${term.id}`}
                id={term.id}
                className="font-mono text-xs text-muted hover:text-microsoft"
              >
                #{term.id}
              </a>
            </div>
            <p className="mt-4 text-sm leading-6 text-ink">
              {term.definition[locale]}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">
              {term.learnerNotes[locale]}
            </p>
            <div className="mt-4 grid gap-3 border-t border-line pt-4 sm:grid-cols-[1fr_1fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {locale === "ko" ? "관련 개념" : "Related concepts"}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {term.related.map((relatedId) => {
                    const relatedTerm = termById.get(relatedId);

                    return (
                      <span
                        key={relatedId}
                        className="rounded-full border border-line bg-paper px-3 py-1 text-xs text-ink"
                      >
                        {relatedTerm?.term[locale] ?? relatedId}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {locale === "ko" ? "검색 키워드" : "Search keywords"}
                </p>
                <p className="mt-2 font-mono text-xs leading-6 text-muted">
                  {term.keywords.join(" · ")}
                </p>
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
