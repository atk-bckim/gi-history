"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";

type LocalizedText = Record<Locale, string>;

const incident: {
  title: LocalizedText;
  summary: LocalizedText;
} = {
  title: {
    ko: "체크아웃 중복 제출 사고",
    en: "Checkout duplicate submit incident"
  },
  summary: {
    ko: "학습자는 결제 직전 제출 버튼이 두 번 눌리며 주문 생성 요청이 중복되는 상황을 Copilot과 함께 조사, 수정, 검증합니다.",
    en: "Practice moving from incident intake to reviewed PR for a checkout flow that can create two order submissions from one rapid click."
  }
};

const artifacts: Array<{
  label: LocalizedText;
  detail: LocalizedText;
}> = [
  {
    label: {
      ko: "이슈 브리프",
      en: "Issue brief"
    },
    detail: {
      ko: "증상, 고객 영향, 재현 조건, 제외할 변경 범위를 한 화면에 고정합니다.",
      en: "Pin the symptom, customer impact, reproduction trigger, and out-of-scope changes before prompting."
    }
  },
  {
    label: {
      ko: "컨텍스트 팩",
      en: "Context pack"
    },
    detail: {
      ko: "관련 컴포넌트, 결제 API 계약, 최근 회귀 테스트, 로그 조각을 함께 제공합니다.",
      en: "Bundle the target component, payment API contract, recent regression tests, and a short log excerpt."
    }
  },
  {
    label: {
      ko: "에이전트 모드 드라이런",
      en: "agent-mode dry run"
    },
    detail: {
      ko: "파일 쓰기 전에 Copilot이 계획, 후보 파일, 검증 명령을 말하게 합니다.",
      en: "Ask Copilot to state the plan, likely files, and verification command before any write happens."
    }
  },
  {
    label: {
      ko: "쓰기 금지 조사",
      en: "No-write investigation"
    },
    detail: {
      ko: "버튼 상태, 요청 중복 방지, idempotency 키 흐름만 읽기 전용으로 추적합니다.",
      en: "Trace button state, request de-duping, and idempotency key flow in read-only mode."
    }
  },
  {
    label: {
      ko: "승인 게이트",
      en: "Approval gate"
    },
    detail: {
      ko: "수정 범위, 테스트 이름, 되돌림 기준이 맞을 때만 쓰기 권한을 허용합니다.",
      en: "Allow edits only after scope, test name, and rollback criteria match the brief."
    }
  },
  {
    label: {
      ko: "검증 증거",
      en: "Verification evidence"
    },
    detail: {
      ko: "최종 응답에는 `npm test checkout-submit` 결과와 수동 재현 메모를 남깁니다.",
      en: "Close with `npm test checkout-submit` output plus a short manual reproduction note."
    }
  }
];

const steps = [
  {
    ko: "요구사항",
    en: "Requirement",
    feedback: {
      ko: "코드를 요청하기 전에 수용 기준, 제약, 검증 명령을 먼저 정리합니다.",
      en: "Capture acceptance criteria before asking for code, including constraints and verification commands."
    },
    practice: {
      ko: "중복 주문을 막는 기준을 먼저 정합니다: 한 클릭은 한 주문, 실패 시 재시도는 명시적으로만 허용, 기존 결제 완료 흐름은 그대로 유지.",
      en: "Define the guardrails first: one click creates one order, retries are explicit, and the successful payment path remains unchanged."
    }
  },
  {
    ko: "코드 제안",
    en: "Code proposal",
    feedback: {
      ko: "변경 범위를 좁히고 기존 패턴을 따르도록 요청해 불필요한 수정을 줄입니다.",
      en: "Constrain the change scope and ask Copilot to follow existing patterns."
    },
    practice: {
      ko: "Copilot에게 후보 변경 파일, 쓰지 않을 파일, 기존 상태 관리 패턴을 먼저 설명하게 합니다.",
      en: "Have Copilot name candidate files, files it will avoid, and the existing state-management pattern before proposing edits."
    }
  },
  {
    ko: "테스트 생성",
    en: "Test generation",
    feedback: {
      ko: "수용 기준을 회귀 테스트로 바꿔 구현 전에 실패 신호를 확인합니다.",
      en: "Turn acceptance criteria into regression tests before relying on implementation."
    },
    practice: {
      ko: "빠른 두 번 클릭, 네트워크 지연, 요청 실패 후 재시도 흐름을 별도 회귀 테스트로 분리합니다.",
      en: "Split fast double-click, slow network, and retry-after-failure paths into focused regression tests."
    }
  },
  {
    ko: "PR 리뷰",
    en: "PR review",
    feedback: {
      ko: "동작 변화, 누락된 테스트, 위험한 가정을 중심으로 리뷰를 요청합니다.",
      en: "Ask for review around behavior changes, missing tests, and risky assumptions."
    },
    practice: {
      ko: "리뷰어가 확인할 동작 계약, 테스트 증거, 남은 위험을 PR 설명에 고정합니다.",
      en: "Pin the behavior contract, evidence, and remaining risks in the PR description."
    },
    review: {
      title: {
        ko: "리뷰 계약",
        en: "Review contract"
      },
      detail: {
        ko: "Copilot은 초안과 증거를 준비하지만, human reviewer owns merge approval 및 출시 위험 판단을 맡습니다.",
        en: "Copilot prepares the draft and evidence, but the human reviewer owns merge approval and release-risk judgment."
      }
    }
  },
  {
    ko: "보안 점검",
    en: "Security check",
    feedback: {
      ko: "권한, 비밀정보, 입력 검증, 외부 호출을 명시적으로 점검합니다.",
      en: "Check permissions, secrets, input validation, and external calls explicitly."
    },
    practice: {
      ko: "결제 토큰, 로그 마스킹, 서버 측 중복 방지, 클라이언트 입력 신뢰 여부를 최종 점검합니다.",
      en: "Re-check payment tokens, log redaction, server-side de-duping, and whether any client input was trusted."
    }
  }
];

export function CopilotWorkflowSimulator({ locale = "ko" }: { locale?: Locale }) {
  const [activeStep, setActiveStep] = useState(0);
  const step = steps[activeStep];

  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-semibold text-ink">
        {locale === "ko" ? "Copilot Workflow Simulator" : "Copilot Workflow Simulator"}
      </h2>
      <div className="mt-4 rounded-md border border-line bg-canvas p-4">
        <p className="font-mono text-xs font-semibold uppercase tracking-wide text-muted">
          {locale === "ko" ? "실습 시나리오" : "Practice run"}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-ink">
          {incident.title[locale]}
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted">
          {incident.summary[locale]}
        </p>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-5">
        {steps.map((step, index) => (
          <button
            key={step.en}
            type="button"
            onClick={() => setActiveStep(index)}
            aria-pressed={activeStep === index}
            className={
              activeStep === index
                ? "rounded-md bg-github p-4 text-left text-white"
                : "rounded-md border border-line bg-canvas p-4 text-left text-muted"
            }
          >
            <span className="font-mono text-xs">{index + 1}</span>
            <span className="mt-2 block text-sm font-semibold">
              {step[locale]}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {artifacts.map((artifact) => (
          <div
            key={artifact.label.en}
            className="rounded-md border border-line bg-white p-4"
          >
            <p className="text-sm font-semibold text-ink">
              {artifact.label[locale]}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              {artifact.detail[locale]}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-md border border-line bg-canvas p-4">
        <p className="text-sm font-semibold text-ink">
          {locale === "ko"
            ? `활성 단계: ${step[locale]}`
            : `Active stage: ${step[locale]}`}
        </p>
        <p className="mt-2 text-sm leading-6 text-muted">
          {step.feedback[locale]}
        </p>
        <p className="mt-3 text-sm leading-6 text-ink">
          {step.practice[locale]}
        </p>
        {step.review ? (
          <div className="mt-4 border-t border-line pt-4">
            <p className="text-sm font-semibold text-ink">
              {step.review.title[locale]}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              {step.review.detail[locale]}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
