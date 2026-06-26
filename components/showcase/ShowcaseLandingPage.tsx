import {
  ArrowRight,
  BrainCircuit,
  CircuitBoard,
  Factory,
  Layers3,
  RadioTower,
  Workflow
} from "lucide-react";
import {
  previewShowcases,
  type ShowcaseLocale
} from "@/components/showcase/showcase-data";

type ShowcaseLandingPageProps = {
  locale?: ShowcaseLocale;
};

const landingCopy = {
  ko: {
    lab: "AI Web Design Lab",
    title: "AI로 구현하는 고난도 웹 쇼케이스",
    body: "교육 콘텐츠와 연결된 산업형 인터랙티브 웹 예제입니다. 반도체 TEST 라인, 반도체 설계 탐색, agentic workflow 관제를 모두 실제 조작 가능한 쇼케이스로 제공합니다.",
    primary: "Open Test Line",
    flagship: "Flagship Experience",
    previews: "Advanced Surfaces",
    build: "Build Pattern",
    twinTitle: "3D Semiconductor Test Line Twin",
    twinBody:
      "웨이퍼 프로버, ATE 메인프레임, 패키지 테스트 핸들러 3종 장비를 10개 셀, 총 30대 구성으로 조작합니다."
  },
  en: {
    lab: "AI Web Design Lab",
    title: "High-complexity web showcases built with AI",
    body: "Industrial interactive web examples connected to the learning content. Semiconductor TEST line, semiconductor design, and agentic workflow control are all live, code-native showcases.",
    primary: "Open Test Line",
    flagship: "Flagship Experience",
    previews: "Advanced Surfaces",
    build: "Build Pattern",
    twinTitle: "3D Semiconductor Test Line Twin",
    twinBody:
      "Operate three equipment classes across 10 repeated cells and 30 total tools: wafer probers, ATE mainframes, and package test handlers."
  }
} satisfies Record<ShowcaseLocale, Record<string, string>>;

export function ShowcaseLandingPage({ locale = "en" }: ShowcaseLandingPageProps) {
  const t = landingCopy[locale];
  const previews = Object.values(previewShowcases);

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#171717]">
      <section className="border-b border-[#ded8cc]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:px-8">
          <div>
            <p className="text-sm text-[#6f6b63]">{t.lab}</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl">
              {t.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#555f69]">
              {t.body}
            </p>
            <a
              href={`/${locale}/showcase/digital-twin`}
              className="mt-8 inline-flex items-center gap-2 rounded bg-[#171717] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2b2b2b]"
            >
              {t.primary}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>

          <div className="rounded border border-[#d8d1c4] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6f6b63]">{t.flagship}</span>
              <Factory className="h-8 w-8 text-[#2563eb]" aria-hidden />
            </div>
            <h2 className="mt-5 text-2xl font-semibold">{t.twinTitle}</h2>
            <p className="mt-3 leading-7 text-[#59636e]">{t.twinBody}</p>
            <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
              {[
                { icon: RadioTower, label: "Telemetry" },
                { icon: Layers3, label: "ATE cell" },
                { icon: BrainCircuit, label: "Bin analysis" }
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded border border-[#ded8cc] bg-[#faf9f5] p-3"
                >
                  <item.icon className="h-5 w-5 text-[#2563eb]" aria-hidden />
                  <p className="mt-3 text-[#38414a]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#111820] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-sky-300">{t.previews}</p>
              <h2 className="mt-2 text-3xl font-semibold">{t.build}</h2>
            </div>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {previews.map((preview) => (
              <a
                key={preview.id}
                href={`/${locale}${preview.route}`}
                className="group rounded border border-white/10 bg-white/[0.04] p-6 transition hover:border-sky-300/45 hover:bg-white/[0.07]"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded bg-white/10 px-3 py-1 text-sm text-slate-200">
                    {preview.status[locale]}
                  </span>
                  {preview.id === "semiconductor-design-explorer" ? (
                    <CircuitBoard className="h-7 w-7 text-sky-300" aria-hidden />
                  ) : (
                    <Workflow className="h-7 w-7 text-sky-300" aria-hidden />
                  )}
                </div>
                <h3 className="mt-6 text-2xl font-semibold">
                  {preview.title[locale]}
                </h3>
                <p className="mt-3 leading-7 text-slate-300">
                  {preview.subtitle[locale]}
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm text-sky-300">
                  Open showcase
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
