import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  CircuitBoard,
  Clock3,
  Code2,
  Cuboid,
  GitBranch,
  Layers3,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow
} from "lucide-react";
import {
  previewShowcases,
  type PreviewShowcaseId,
  type ShowcaseLocale
} from "@/components/showcase/showcase-data";

type ShowcasePreviewPageProps = {
  locale?: ShowcaseLocale;
  showcaseId: PreviewShowcaseId;
};

const previewCopy = {
  ko: {
    lab: "AI Web Design Lab",
    status: "Build Preview",
    back: "Back to Showcase",
    experience: "Experience",
    aiHelped: "How AI Helped",
    breakdown: "Build Breakdown",
    next: "Prototype next",
    roadmap: "Preview roadmap",
    constraints: "Implementation focus"
  },
  en: {
    lab: "AI Web Design Lab",
    status: "Build Preview",
    back: "Back to Showcase",
    experience: "Experience",
    aiHelped: "How AI Helped",
    breakdown: "Build Breakdown",
    next: "Prototype next",
    roadmap: "Preview roadmap",
    constraints: "Implementation focus"
  }
} satisfies Record<ShowcaseLocale, Record<string, string>>;

const previewIcons: Record<PreviewShowcaseId, typeof CircuitBoard> = {
  "semiconductor-design-explorer": CircuitBoard,
  "agentic-workflow-control-room": Workflow
};

export function ShowcasePreviewPage({
  locale = "en",
  showcaseId
}: ShowcasePreviewPageProps) {
  const showcase = previewShowcases[showcaseId];
  const t = previewCopy[locale];
  const Icon = previewIcons[showcaseId];

  return (
    <main className="min-h-screen bg-[#f6f4ee] text-[#171717]">
      <section className="border-b border-[#d8d1c4] bg-[#f6f4ee]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <a
            href={`/${locale}/showcase`}
            className="inline-flex items-center gap-2 text-sm text-[#5d6874] transition hover:text-[#171717]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {t.back}
          </a>
        </div>
      </section>

      <section className="border-b border-[#d8d1c4]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8">
          <div>
            <p className="text-sm text-[#68717c]">{t.lab}</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-tight text-[#111111] sm:text-5xl">
              {showcase.title[locale]}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#4b5560]">
              {showcase.subtitle[locale]}
            </p>
            <p className="mt-4 max-w-3xl leading-7 text-[#59636e]">
              {showcase.description[locale]}
            </p>
          </div>

          <div className="rounded border border-[#d8d1c4] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="rounded bg-[#171717] px-3 py-1.5 text-sm text-white">
                {showcase.status[locale]}
              </span>
              <Icon className="h-8 w-8 text-[#2563eb]" aria-hidden />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {showcase.metrics.map((metric) => (
                <div
                  key={metric.label.en}
                  className="rounded border border-[#ded8cc] bg-[#faf9f5] p-3"
                >
                  <p className="text-xs text-[#6f6b63]">{metric.label[locale]}</p>
                  <p className="mt-1 text-2xl font-semibold">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#111820] text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-8">
          <div>
            <p className="text-sm text-sky-300">{t.experience}</p>
            <h2 className="mt-3 text-2xl font-semibold">{t.roadmap}</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {showcase.features.map((feature, index) => (
              <article
                key={feature.title.en}
                className="rounded border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded bg-sky-400/15 text-sky-200">
                  {showcaseId === "semiconductor-design-explorer" ? (
                    <SemiconductorFeatureIcon index={index} />
                  ) : (
                    <WorkflowFeatureIcon index={index} />
                  )}
                </div>
                <h3 className="mt-5 font-semibold">{feature.title[locale]}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {feature.body[locale]}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#d8d1c4]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded border border-[#d8d1c4] bg-white p-6">
            <div className="flex items-center gap-3">
              <BrainCircuit className="h-6 w-6 text-[#2563eb]" aria-hidden />
              <h2 className="text-xl font-semibold">{t.aiHelped}</h2>
            </div>
            <div className="mt-5 space-y-4">
              {showcase.buildNotes.map((note) => (
                <div key={note.en} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2e7d4f]" aria-hidden />
                  <p className="leading-7 text-[#4b5560]">{note[locale]}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded border border-[#d8d1c4] bg-white p-6">
            <div className="flex items-center gap-3">
              <Code2 className="h-6 w-6 text-[#2563eb]" aria-hidden />
              <h2 className="text-xl font-semibold">{t.breakdown}</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {[
                {
                  icon: ShieldCheck,
                  label: "Typed mock data",
                  body: "Telemetry and trace data are deterministic for stable demos."
                },
                {
                  icon: Clock3,
                  label: "Timeline state",
                  body: "Time controls can later drive real streaming snapshots."
                },
                {
                  icon: LockKeyhole,
                  label: "Operator gates",
                  body: "Approval and review states are modeled before automation."
                }
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex gap-3 rounded border border-[#ded8cc] bg-[#faf9f5] p-4"
                >
                  <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-[#2563eb]" aria-hidden />
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="mt-1 text-sm leading-6 text-[#59636e]">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f4ee]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-sm text-[#6f6b63]">{t.constraints}</p>
            <p className="mt-1 max-w-2xl text-[#38414a]">
              {showcaseId === "semiconductor-design-explorer"
                ? "Next phase adds package cross-section zoom, HBM selection, and assembly-specific AI review notes."
                : "Next phase adds live trace filtering, approval resolution, and test output correlation."}
            </p>
          </div>
          <a
            href={`/${locale}${showcase.route}`}
            className="inline-flex items-center justify-center gap-2 rounded bg-[#171717] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#2a2a2a]"
          >
            {t.next}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </section>
    </main>
  );
}

function SemiconductorFeatureIcon({ index }: { index: number }) {
  const icons = [Cuboid, Layers3, Sparkles];
  const Icon = icons[index] ?? CircuitBoard;
  return <Icon className="h-5 w-5" aria-hidden />;
}

function WorkflowFeatureIcon({ index }: { index: number }) {
  const icons = [Search, GitBranch, Workflow];
  const Icon = icons[index] ?? Workflow;
  return <Icon className="h-5 w-5" aria-hidden />;
}
