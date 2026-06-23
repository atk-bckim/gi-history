"use client";

import { useMemo, useState } from "react";
import {
  PROMPT_CRITERIA,
  scorePromptDraft,
  type PromptCriterionId,
  type PromptDraft
} from "@/components/learning/prompt-scoring";
import type { Locale } from "@/lib/i18n/config";

export { PROMPT_CRITERIA, scorePromptDraft };

const EMPTY_DRAFT: PromptDraft = {
  goal: "",
  context: "",
  constraints: "",
  output: "",
  verification: ""
};

const STARTER_DRAFTS: Record<Locale, PromptDraft> = {
  ko: {
    goal: "체크아웃 폼의 게스트 사용자 검증 버그를 줄이도록 리팩터링해줘.",
    context:
      "app/checkout/Form.tsx, Zod 스키마, checkout-validation.test.ts 실패 로그를 참고해줘.",
    constraints:
      "결제 제공자는 바꾸지 말고, 키보드 접근성과 strict TypeScript 타입을 유지해줘.",
    output: "변경 요약, 수정한 테스트 이름, 남은 리스크를 목록으로 알려줘.",
    verification:
      "npm test checkout-validation을 실행하고 어떤 엣지 케이스를 확인했는지 설명해줘."
  },
  en: {
    goal: "Refactor the checkout form to reduce validation bugs for guest users.",
    context:
      "Use app/checkout/Form.tsx, the Zod schema, and the failing test log from checkout-validation.test.ts.",
    constraints:
      "Do not change the payment provider, keep keyboard accessibility, and preserve strict TypeScript types.",
    output:
      "Return a patch summary, updated test names, and any residual risks in bullet form.",
    verification:
      "Run npm test checkout-validation and explain which edge cases were verified."
  }
};

const copy = {
  score: { ko: "점수", en: "Score" },
  strong: { ko: "강함", en: "Strong" },
  developing: { ko: "보강 필요", en: "Developing" },
  missing: { ko: "비어 있음", en: "Missing" },
  useStarter: { ko: "예시 채우기", en: "Use sample" },
  clear: { ko: "비우기", en: "Clear" },
  preview: { ko: "조립된 프롬프트", en: "Assembled prompt" },
  koTab: { ko: "한국어", en: "Korean" },
  enTab: { ko: "영어", en: "English" }
} as const;

type PromptBuilderProps = {
  locale?: Locale;
};

export function PromptBuilder({ locale = "ko" }: PromptBuilderProps) {
  const [activeLocale, setActiveLocale] = useState<Locale>(locale);
  const [drafts, setDrafts] = useState<Record<Locale, PromptDraft>>({
    ko: { ...EMPTY_DRAFT },
    en: { ...EMPTY_DRAFT }
  });

  const draft = drafts[activeLocale];
  const score = useMemo(
    () => scorePromptDraft(draft, activeLocale),
    [activeLocale, draft]
  );

  const assembledPrompt = PROMPT_CRITERIA.map((criterion) => draft[criterion.id].trim())
    .filter(Boolean)
    .join("\n\n");

  function updateField(id: PromptCriterionId, value: string) {
    setDrafts((current) => ({
      ...current,
      [activeLocale]: {
        ...current[activeLocale],
        [id]: value
      }
    }));
  }

  function setDraft(nextDraft: PromptDraft) {
    setDrafts((current) => ({
      ...current,
      [activeLocale]: nextDraft
    }));
  }

  return (
    <section
      aria-labelledby="prompt-builder-title"
      className="rounded-lg border border-line bg-white p-5 shadow-sm"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-microsoft">
            Prompt Builder
          </p>
          <h2 id="prompt-builder-title" className="mt-1 text-2xl font-semibold text-ink">
            {activeLocale === "ko" ? "프롬프트 구조 실습" : "Prompt structure practice"}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            {activeLocale === "ko"
              ? "목표, 맥락, 제약, 출력 형식, 검증 기준을 나누어 작성하고 결정적 규칙으로 품질을 확인합니다."
              : "Write goal, context, constraints, output format, and verification criteria, then check quality with deterministic rules."}
          </p>
        </div>

        <div className="min-w-32 rounded-md border border-line bg-canvas p-3 text-center">
          <div className="text-xs font-medium uppercase text-muted">
            {copy.score[activeLocale]}
          </div>
          <div className="mt-1 text-3xl font-semibold text-ink">{score.total}</div>
          <div className="text-xs text-muted">/ 100</div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <div
          aria-label={activeLocale === "ko" ? "프롬프트 언어" : "Prompt language"}
          className="inline-flex rounded-md border border-line bg-canvas p-1"
          role="tablist"
        >
          {(["ko", "en"] as const).map((tabLocale) => (
            <button
              aria-selected={activeLocale === tabLocale}
              className={`rounded px-3 py-2 text-sm font-medium ${
                activeLocale === tabLocale
                  ? "bg-ink text-white"
                  : "text-muted hover:bg-white hover:text-ink focus:bg-white"
              }`}
              key={tabLocale}
              onClick={() => setActiveLocale(tabLocale)}
              role="tab"
              type="button"
            >
              {tabLocale === "ko" ? copy.koTab[activeLocale] : copy.enTab[activeLocale]}
            </button>
          ))}
        </div>

        <button
          className="rounded-md border border-line px-3 py-2 text-sm font-medium text-ink hover:bg-canvas focus:bg-canvas"
          onClick={() => setDraft(STARTER_DRAFTS[activeLocale])}
          type="button"
        >
          {copy.useStarter[activeLocale]}
        </button>
        <button
          className="rounded-md border border-line px-3 py-2 text-sm font-medium text-ink hover:bg-canvas focus:bg-canvas"
          onClick={() => setDraft(EMPTY_DRAFT)}
          type="button"
        >
          {copy.clear[activeLocale]}
        </button>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          {PROMPT_CRITERIA.map((criterion) => (
            <label className="block" key={criterion.id}>
              <span className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-ink">
                  {criterion.label[activeLocale]}
                </span>
                <span className="text-xs text-muted">
                  {score.items.find((item) => item.id === criterion.id)?.points ?? 0}/20
                </span>
              </span>
              <span className="mt-1 block text-sm text-muted">
                {criterion.helper[activeLocale]}
              </span>
              <textarea
                className="mt-2 min-h-24 w-full resize-y rounded-md border border-line bg-white p-3 font-mono text-sm leading-6 text-ink outline-none focus:border-microsoft focus:ring-2 focus:ring-microsoft/20"
                onChange={(event) => updateField(criterion.id, event.target.value)}
                value={draft[criterion.id]}
              />
            </label>
          ))}
        </div>

        <aside className="space-y-4" aria-label={copy.score[activeLocale]}>
          <div className="rounded-md border border-line bg-canvas p-4">
            <h3 className="font-semibold text-ink">
              {activeLocale === "ko" ? "품질 피드백" : "Quality feedback"}
            </h3>
            <ul className="mt-3 space-y-3">
              {score.items.map((item) => (
                <li className="rounded-md bg-white p-3" key={item.id}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-ink">{item.label}</span>
                    <span className="text-sm font-semibold text-ink">{item.points}/20</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    <span className="font-medium text-ink">
                      {copy[item.status][activeLocale]}:
                    </span>{" "}
                    {item.feedback}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md border border-line bg-github p-4 text-white">
            <h3 className="font-semibold">{copy.preview[activeLocale]}</h3>
            <pre className="mt-3 whitespace-pre-wrap break-words font-mono text-xs leading-5 text-slate-100">
              {assembledPrompt ||
                (activeLocale === "ko"
                  ? "필드를 채우면 조립된 프롬프트가 여기에 표시됩니다."
                  : "Fill the fields to preview the assembled prompt.")}
            </pre>
          </div>
        </aside>
      </div>
    </section>
  );
}
