import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  CheckCircle2,
  CircuitBoard,
  GitPullRequest,
  Layers3,
  TerminalSquare
} from "lucide-react";
import { lessons } from "@/lib/content/registry";
import { getLocalizedPath, type Locale } from "@/lib/i18n/config";

const conceptStages = [
  { id: "prompt", ko: "프롬프트", en: "Prompt" },
  { id: "context", ko: "컨텍스트", en: "Context" },
  { id: "mcp", ko: "MCP", en: "MCP" },
  { id: "agent", ko: "에이전트", en: "Agent" },
  { id: "harness", ko: "하네스", en: "Harness" },
  { id: "loop", ko: "루프", en: "Loop" }
];

const stats = [
  { value: "7", ko: "핵심 학습 모듈", en: "Core learning modules" },
  { value: "3", ko: "인터랙티브 실습", en: "Interactive labs" },
  { value: "2", ko: "언어 학습 모드", en: "Language modes" }
];

export function LearningDashboard({ locale }: { locale: Locale }) {
  const featuredLessons = lessons.slice(0, 3);

  return (
    <main className="min-h-screen">
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)_300px] lg:px-8 lg:py-10">
        <aside className="hidden rounded-lg border border-line bg-white/60 p-4 shadow-sm lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            {locale === "ko" ? "학습 경로" : "Learning path"}
          </p>
          <div className="mt-5 space-y-3">
            {[
              {
                icon: BookOpen,
                title: locale === "ko" ? "AI 리터러시" : "AI literacy",
                active: false
              },
              {
                icon: TerminalSquare,
                title: "GitHub Copilot",
                active: true
              },
              {
                icon: Boxes,
                title: locale === "ko" ? "Agentic AI" : "Agentic AI",
                active: false
              },
              {
                icon: CircuitBoard,
                title: locale === "ko" ? "AI Web Lab" : "AI Web Lab",
                active: false
              }
            ].map((item) => (
              <div
                key={item.title}
                className={
                  item.active
                    ? "flex items-center gap-3 rounded-md bg-github px-3 py-3 text-white"
                    : "flex items-center gap-3 rounded-md px-3 py-3 text-muted"
                }
              >
                <item.icon aria-hidden className="h-4 w-4" />
                <span className="text-sm font-semibold">{item.title}</span>
              </div>
            ))}
          </div>
        </aside>

        <div className="min-w-0">
          <div className="rounded-lg border border-line bg-white/70 p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold text-microsoft">
              {locale === "ko"
                ? "조사 기준 2026-06-22"
                : "Research baseline 2026-06-22"}
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-ink sm:text-5xl">
              {locale === "ko" ? (
                <>
                  <span className="block">AI 활용부터</span>
                  <span className="block">작업환경 설계까지</span>
                </>
              ) : (
                "From using AI tools to designing the environment where AI works"
              )}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              {locale === "ko"
                ? "GitHub Copilot을 중심으로 프롬프트, 컨텍스트, MCP, 에이전트, 하네스 엔지니어링을 실습 중심으로 배웁니다."
                : "Learn prompts, context, MCP, agents, and harness engineering through practical GitHub Copilot-centered workflows."}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={getLocalizedPath(locale, "/github-copilot")}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-github px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-microsoft"
              >
                {locale === "ko" ? "GitHub Copilot 시작" : "Start GitHub Copilot"}
                <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
              <Link
                href={getLocalizedPath(locale, "/showcase")}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:border-microsoft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-microsoft"
              >
                {locale === "ko" ? "AI 웹 쇼케이스 보기" : "View AI web showcase"}
              </Link>
            </div>
          </div>

          <section className="mt-6 grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.ko}
                className="rounded-lg border border-line bg-white/60 p-5 shadow-sm"
              >
                <div className="text-3xl font-semibold text-ink">{stat.value}</div>
                <p className="mt-2 text-sm font-medium text-muted">
                  {stat[locale]}
                </p>
              </div>
            ))}
          </section>

          <section className="mt-6 rounded-lg border border-line bg-white/60 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-ink">
                  {locale === "ko" ? "핵심 개념 흐름" : "Core concept flow"}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {locale === "ko"
                    ? "프롬프트 중심 사고에서 에이전트 운영 설계로 확장합니다."
                    : "Move from prompt-first thinking to operational agent design."}
                </p>
              </div>
              <Layers3 aria-hidden className="h-5 w-5 text-microsoft" />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
              {conceptStages.map((stage, index) => (
                <div
                  key={stage.id}
                  className="relative rounded-md border border-line bg-canvas px-3 py-4"
                >
                  <span className="font-mono text-xs text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-2 text-sm font-semibold text-ink">
                    {stage[locale]}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-lg border border-line bg-github p-5 text-white shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 aria-hidden className="h-5 w-5 text-emerald-300" />
              <h2 className="text-lg font-semibold">
                {locale === "ko" ? "추천 다음 학습" : "Recommended next"}
              </h2>
            </div>
            <div className="mt-5 space-y-4">
              {featuredLessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={getLocalizedPath(locale, lesson.slug)}
                  className="block rounded-md border border-white/10 bg-white/5 p-3 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <p className="text-sm font-semibold">{lesson.title[locale]}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/68">
                    {lesson.summary[locale]}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-line bg-white/70 p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <GitPullRequest aria-hidden className="h-5 w-5 text-microsoft" />
              <h2 className="text-lg font-semibold text-ink">
                {locale === "ko" ? "실습 준비도" : "Practice readiness"}
              </h2>
            </div>
            <div className="mt-5 space-y-3 text-sm text-muted">
              {[
                locale === "ko" ? "VS Code Copilot 설치" : "Install VS Code Copilot",
                locale === "ko" ? "작은 저장소 준비" : "Prepare a small repository",
                locale === "ko" ? "PR 리뷰 흐름 이해" : "Understand PR review flow"
              ].map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-canvas font-mono text-xs text-muted">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}
