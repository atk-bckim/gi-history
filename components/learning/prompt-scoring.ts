import type { Locale } from "@/lib/i18n/config";

export type PromptCriterionId =
  | "goal"
  | "context"
  | "constraints"
  | "output"
  | "verification";

export type PromptDraft = Record<PromptCriterionId, string>;

export type PromptScoreStatus = "missing" | "developing" | "strong";

export type PromptCriterion = {
  id: PromptCriterionId;
  label: Record<Locale, string>;
  helper: Record<Locale, string>;
  strongWordCount: number;
};

export type PromptScoreItem = {
  id: PromptCriterionId;
  label: string;
  points: number;
  status: PromptScoreStatus;
  feedback: string;
};

export type PromptScore = {
  total: number;
  items: PromptScoreItem[];
};

export const PROMPT_CRITERIA: readonly PromptCriterion[] = [
  {
    id: "goal",
    label: { ko: "목표", en: "Goal" },
    helper: {
      ko: "AI가 끝내야 할 구체적인 작업과 성공 상태를 적습니다.",
      en: "State the concrete task and the desired end state."
    },
    strongWordCount: 6
  },
  {
    id: "context",
    label: { ko: "맥락", en: "Context" },
    helper: {
      ko: "관련 파일, 선택 영역, 이슈, 로그, 문서를 지정합니다.",
      en: "Name the relevant files, selection, issue, logs, or docs."
    },
    strongWordCount: 9
  },
  {
    id: "constraints",
    label: { ko: "제약", en: "Constraints" },
    helper: {
      ko: "바꾸면 안 되는 것, 접근성, 보안, 성능 조건을 둡니다.",
      en: "Add limits such as no-go areas, accessibility, security, or performance."
    },
    strongWordCount: 9
  },
  {
    id: "output",
    label: { ko: "출력 형식", en: "Output format" },
    helper: {
      ko: "패치, 표, 체크리스트처럼 받을 결과의 형태를 정합니다.",
      en: "Specify the expected shape, such as a patch, table, or checklist."
    },
    strongWordCount: 8
  },
  {
    id: "verification",
    label: { ko: "검증", en: "Verification" },
    helper: {
      ko: "실행할 테스트, 리뷰 기준, 확인할 엣지 케이스를 요구합니다.",
      en: "Ask for tests, review criteria, or edge cases to verify."
    },
    strongWordCount: 8
  }
];

function countWords(value: string): number {
  return value
    .trim()
    .split(/[\s,.;:!?()[\]{}"']+/)
    .filter(Boolean).length;
}

function getFeedback(
  criterion: PromptCriterion,
  points: number,
  locale: Locale
): string {
  const label = criterion.label[locale].toLowerCase();

  if (points === 20) {
    return locale === "ko"
      ? `${criterion.label.ko} 기준이 명확합니다.`
      : `${criterion.label.en} is specific enough to guide Copilot.`;
  }

  if (points === 10) {
    return locale === "ko"
      ? `${criterion.label.ko}을 더 구체적인 대상, 범위, 조건으로 보강하세요.`
      : `Add more concrete detail to the ${label} section.`;
  }

  return locale === "ko"
    ? `${criterion.label.ko} 항목이 비어 있습니다.`
    : `The ${criterion.id} section is missing.`;
}

export function scorePromptDraft(
  draft: PromptDraft,
  locale: Locale = "en"
): PromptScore {
  const items = PROMPT_CRITERIA.map((criterion) => {
    const value = draft[criterion.id].trim();
    const words = countWords(value);
    const points = value.length === 0 ? 0 : words >= criterion.strongWordCount ? 20 : 10;
    const status: PromptScoreStatus =
      points === 20 ? "strong" : points === 10 ? "developing" : "missing";

    return {
      id: criterion.id,
      label: criterion.label[locale],
      points,
      status,
      feedback: getFeedback(criterion, points, locale)
    };
  });

  return {
    total: items.reduce((sum, item) => sum + item.points, 0),
    items
  };
}

