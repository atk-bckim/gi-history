import { AgentLoopVisualizer } from "@/components/learning/agent-loop-visualizer";
import { ContextStack } from "@/components/learning/context-stack";
import { CopilotWorkflowSimulator } from "@/components/learning/copilot-workflow-simulator";
import { PromptBuilder } from "@/components/learning/prompt-builder";
import { QuizEngine } from "@/components/learning/quiz-engine";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";

type LabsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

const pageCopy: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    intro: string;
  }
> = {
  ko: {
    eyebrow: "Interactive Labs",
    title: "AI Copilot 실습실",
    intro:
      "외부 AI API 없이 프롬프트, 컨텍스트, 워크플로, 에이전트 루프, 퀴즈 피드백을 결정적 규칙으로 연습합니다."
  },
  en: {
    eyebrow: "Interactive Labs",
    title: "AI Copilot Labs",
    intro:
      "Practice prompts, context, workflow, agent loops, and quiz feedback with deterministic rules and no external AI API calls."
  }
};

export function generateStaticParams() {
  return [{ locale: "ko" }, { locale: "en" }];
}

export default async function LabsPage({ params }: LabsPageProps) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const copy = pageCopy[locale];

  return (
    <main className="min-h-screen bg-canvas px-4 py-8 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-microsoft">
            {copy.eyebrow}
          </p>
          <h1 className="mt-2 max-w-4xl text-4xl font-semibold text-ink md:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            {copy.intro}
          </p>
        </header>

        <div className="space-y-6">
          <PromptBuilder locale={locale} />
          <ContextStack locale={locale} />
          <CopilotWorkflowSimulator locale={locale} />
          <AgentLoopVisualizer locale={locale} />
          <QuizEngine locale={locale} />
        </div>
      </div>
    </main>
  );
}

