"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";

const loop = [
  {
    ko: "계획",
    en: "Plan",
    feedback: {
      ko: "다음에 실행할 가장 작은 행동과 확인할 증거를 정합니다.",
      en: "Define the next smallest action and the evidence needed to trust it."
    }
  },
  {
    ko: "도구 실행",
    en: "Act",
    feedback: {
      ko: "파일 읽기, 테스트 실행, 브라우저 확인처럼 관찰 가능한 행동을 수행합니다.",
      en: "Run an observable action such as reading files, testing, or checking the browser."
    }
  },
  {
    ko: "관찰",
    en: "Observe",
    feedback: {
      ko: "도구 출력, 오류, diff, 사용자 피드백을 읽어 다음 판단에 반영합니다.",
      en: "Read tool output, errors, diffs, and user feedback before deciding what changed."
    }
  },
  {
    ko: "평가",
    en: "Evaluate",
    feedback: {
      ko: "결과가 목표와 검증 기준을 만족하는지 확인하고 빠진 부분을 찾습니다.",
      en: "Compare the result with the goal and verification criteria to find gaps."
    }
  },
  {
    ko: "수정",
    en: "Revise",
    feedback: {
      ko: "관찰과 평가에서 발견한 차이를 반영해 계획이나 구현을 좁혀 다시 시도합니다.",
      en: "Narrow the plan or implementation based on the gaps found in evaluation."
    }
  }
];

export function AgentLoopVisualizer({ locale = "ko" }: { locale?: Locale }) {
  const [activeStep, setActiveStep] = useState(0);
  const step = loop[activeStep];

  return (
    <section className="rounded-lg border border-line bg-github p-5 text-white shadow-sm">
      <h2 className="text-2xl font-semibold">Agent Loop Visualizer</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-5">
        {loop.map((step, index) => (
          <button
            key={step.en}
            type="button"
            onClick={() => setActiveStep(index)}
            aria-label={
              locale === "ko" ? `${step[locale]} 선택` : `Select ${step[locale]}`
            }
            aria-pressed={activeStep === index}
            className={
              activeStep === index
                ? "rounded-md border border-white bg-white p-4 text-left text-github"
                : "rounded-md border border-white/10 bg-white/8 p-4 text-left text-white"
            }
          >
            <span
              className={
                activeStep === index
                  ? "font-mono text-xs text-github/60"
                  : "font-mono text-xs text-white/60"
              }
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="mt-2 text-sm font-semibold">{step[locale]}</p>
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-md border border-white/10 bg-white/8 p-4">
        <p className="text-sm font-semibold">
          {locale === "ko"
            ? `선택된 루프 단계: ${step[locale]}`
            : `Selected loop step: ${step[locale]}`}
        </p>
        <p className="mt-2 text-sm leading-6 text-white/75">
          {step.feedback[locale]}
        </p>
      </div>
    </section>
  );
}
