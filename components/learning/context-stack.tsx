"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";

const layers = [
  {
    id: "selection",
    ko: "선택 코드",
    en: "Selected code",
    feedback: {
      ko: "바꿀 함수나 컴포넌트의 정확한 위치에 모델을 집중시킵니다.",
      en: "Focus the model on the exact function or component that should change."
    }
  },
  {
    id: "file",
    ko: "관련 파일",
    en: "Related file",
    feedback: {
      ko: "호출자, 타입, 테스트처럼 함께 바뀌는 파일을 연결해 누락을 줄입니다.",
      en: "Connect callers, types, and tests that change together to reduce omissions."
    }
  },
  {
    id: "issue",
    ko: "이슈/요구사항",
    en: "Issue/request",
    feedback: {
      ko: "사용자 문제, 수용 기준, 제외 범위를 함께 제공해 작업 목표를 고정합니다.",
      en: "Provide the user problem, acceptance criteria, and out-of-scope work."
    }
  },
  {
    id: "docs",
    ko: "공식 문서",
    en: "Official docs",
    feedback: {
      ko: "버전에 민감한 API 세부 사항을 공식 출처로 고정한 뒤 구현을 요청합니다.",
      en: "Anchor version-sensitive API details before asking for implementation."
    }
  },
  {
    id: "mcp",
    ko: "MCP 도구",
    en: "MCP tool",
    feedback: {
      ko: "파일, 이슈, 브라우저, 배포 상태처럼 모델 밖의 실제 상태를 확인합니다.",
      en: "Use real external state such as files, issues, browser output, or deploy status."
    }
  }
];

export function ContextStack({ locale = "ko" }: { locale?: Locale }) {
  const [active, setActive] = useState("selection");
  const activeLayer = layers.find((layer) => layer.id === active) ?? layers[0];

  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-semibold text-ink">
        {locale === "ko" ? "Context Stack" : "Context Stack"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        {locale === "ko"
          ? "Copilot 응답 품질은 프롬프트보다 어떤 컨텍스트를 넣는지에 크게 좌우됩니다."
          : "Copilot answer quality depends heavily on which context you provide, not just on the prompt."}
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-5">
        {layers.map((layer, index) => (
          <button
            key={layer.id}
            type="button"
            onClick={() => setActive(layer.id)}
            aria-pressed={active === layer.id}
            className={
              active === layer.id
                ? "rounded-md border border-microsoft bg-microsoft px-3 py-4 text-left text-white"
                : "rounded-md border border-line bg-canvas px-3 py-4 text-left text-ink"
            }
          >
            <span className="font-mono text-xs opacity-75">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="mt-2 block text-sm font-semibold">
              {layer[locale]}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-md border border-line bg-canvas p-4">
        <p className="text-sm font-semibold text-ink">
          {locale === "ko"
            ? `선택된 컨텍스트: ${activeLayer[locale]}`
            : `Selected context: ${activeLayer[locale]}`}
        </p>
        <p className="mt-2 text-sm leading-6 text-muted">
          {activeLayer.feedback[locale]}
        </p>
      </div>
    </section>
  );
}
