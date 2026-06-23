import { resourceSections, sourceRefs } from "@/lib/content/registry";
import type { Locale } from "@/lib/i18n/config";
import { StaticSearch } from "@/components/search/static-search";

export default async function ResourcesPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const sourceById = new Map(sourceRefs.map((source) => [source.id, source]));

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-semibold text-ink">
        {locale === "ko" ? "자료실과 공식 출처" : "Resources and primary sources"}
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-muted">
        {locale === "ko"
          ? "빠르게 변하는 Copilot, MCP, agent 기능은 공식 문서와 조사 기준일을 함께 확인해야 합니다."
          : "Fast-changing Copilot, MCP, and agent features should be checked against primary docs and an explicit investigation date."}
      </p>
      <div className="mt-8">
        <StaticSearch locale={locale} />
      </div>
      <div className="mt-8 space-y-8">
        {resourceSections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-24 border-t border-line pt-6"
          >
            <div className="max-w-3xl">
              <p className="font-mono text-xs text-microsoft">#{section.id}</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">
                {section.title[locale]}
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                {section.summary[locale]}
              </p>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {section.items.map((item) => (
                <article
                  key={`${section.id}-${item.title.en}`}
                  className="rounded-lg border border-line bg-white/75 p-5 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-ink">
                    {item.title[locale]}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {item.description[locale]}
                  </p>
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      {locale === "ko" ? "실행 기준" : "Action criteria"}
                    </p>
                    <ul className="mt-2 space-y-2 text-sm leading-6 text-ink">
                      {item.actions.map((action) => (
                        <li key={action.en} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-microsoft" />
                          <span>{action[locale]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {item.sourceRefIds ? (
                    <div className="mt-4 border-t border-line pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                        {locale === "ko" ? "공식 출처" : "Primary sources"}
                      </p>
                      <div className="mt-2 space-y-2">
                        {item.sourceRefIds.map((sourceId) => {
                          const source = sourceById.get(sourceId);

                          if (!source) {
                            return null;
                          }

                          return (
                            <a
                              key={source.id}
                              href={source.url}
                              target="_blank"
                              rel="noreferrer"
                              className="block rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink transition hover:border-microsoft"
                            >
                              <span className="font-semibold text-microsoft">
                                {source.publisher}
                              </span>
                              <span className="mt-1 block">{source.title}</span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
      <section className="mt-10 rounded-lg border border-line bg-paper p-5">
        <h2 className="text-lg font-semibold text-ink">
          {locale === "ko" ? "전체 공식 링크 색인" : "Complete primary-source index"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          {locale === "ko"
            ? "위 체크리스트에서 인용한 공식 문서를 한곳에서 다시 확인할 수 있습니다."
            : "Review every official source cited by the checklists above in one place."}
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {sourceRefs.map((source) => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-line bg-white/75 p-4 transition hover:border-microsoft"
            >
              <p className="text-xs font-semibold text-microsoft">
                {source.publisher}
              </p>
              <h3 className="mt-1 text-sm font-semibold text-ink">
                {source.title}
              </h3>
              <p className="mt-2 break-all font-mono text-xs text-muted">
                {source.url}
              </p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
