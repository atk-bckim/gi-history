import type { Locale } from "@/lib/i18n/config";

export type QuizOption = {
  id: string;
  label: string;
  correct: boolean;
  explanation: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
};

export type QuizFeedback = {
  isCorrect: boolean;
  selectedLabel: string;
  correctLabel: string;
  statusText: "Correct" | "Review" | "정답" | "복습 필요";
  message: string;
};

export const DEFAULT_QUESTIONS: Record<Locale, QuizQuestion[]> = {
  ko: [
    {
      id: "context-quality",
      prompt: "Copilot 답변 품질을 가장 안정적으로 높이는 요청은 무엇인가요?",
      options: [
        {
          id: "grounded",
          label: "관련 파일, 실패 테스트, 기대 출력까지 함께 제공한다.",
          correct: true,
          explanation:
            "구체적인 컨텍스트와 검증 기준은 모델이 추측하는 범위를 줄입니다."
        },
        {
          id: "polite",
          label: "친절하고 전문적으로 답해달라고만 요청한다.",
          correct: false,
          explanation:
            "표현 톤은 도움이 될 수 있지만 작업 맥락과 검증 기준을 대체하지 못합니다."
        },
        {
          id: "broad",
          label: "전체 코드베이스를 알아서 분석하라고 요청한다.",
          correct: false,
          explanation:
            "범위가 넓으면 중요한 파일과 제약이 묻혀 답변이 불안정해질 수 있습니다."
        }
      ]
    },
    {
      id: "agent-loop",
      prompt: "에이전트 루프에서 observe 단계의 핵심 역할은 무엇인가요?",
      options: [
        {
          id: "observe",
          label: "도구 실행 결과와 실패 신호를 다음 판단에 반영한다.",
          correct: true,
          explanation:
            "observe는 실행 결과를 읽고 다음 plan 또는 revise 단계에 연결합니다."
        },
        {
          id: "decorate",
          label: "응답을 더 보기 좋게 꾸민다.",
          correct: false,
          explanation:
            "표현 개선은 출력 단계의 일부일 수 있지만 observe의 핵심은 실행 결과 해석입니다."
        }
      ]
    }
  ],
  en: [
    {
      id: "context-quality",
      prompt: "Which request improves Copilot answer quality most reliably?",
      options: [
        {
          id: "grounded",
          label: "Attach the relevant file, failing test, and expected output.",
          correct: true,
          explanation:
            "Concrete context and verification criteria reduce ambiguity."
        },
        {
          id: "polite",
          label: "Only ask for a friendly and professional answer.",
          correct: false,
          explanation:
            "Tone can help, but it does not replace task context or verification criteria."
        },
        {
          id: "broad",
          label: "Ask Copilot to inspect the whole codebase without guidance.",
          correct: false,
          explanation:
            "A broad scope can hide the important files and constraints."
        }
      ]
    },
    {
      id: "agent-loop",
      prompt: "What is the main role of observe in an agent loop?",
      options: [
        {
          id: "observe",
          label: "Feed tool results and failure signals into the next decision.",
          correct: true,
          explanation:
            "Observe reads execution results and connects them to planning or revision."
        },
        {
          id: "decorate",
          label: "Make the final answer look more polished.",
          correct: false,
          explanation:
            "Presentation can matter, but observe is about interpreting execution results."
        }
      ]
    }
  ]
};

export function evaluateQuizAnswer(
  question: QuizQuestion,
  selectedOptionId: string,
  locale: Locale = "en"
): QuizFeedback {
  const selected = question.options.find((option) => option.id === selectedOptionId);
  const correct = question.options.find((option) => option.correct);

  if (!selected || !correct) {
    throw new Error(`Invalid quiz answer for question "${question.id}".`);
  }

  if (selected.correct) {
    const statusText = locale === "ko" ? "정답" : "Correct";

    return {
      isCorrect: true,
      selectedLabel: selected.label,
      correctLabel: correct.label,
      statusText,
      message: `${statusText}: ${selected.explanation}`
    };
  }

  const statusText = locale === "ko" ? "복습 필요" : "Review";
  const correctAnswerLabel = locale === "ko" ? "정답" : "Correct answer";

  return {
    isCorrect: false,
    selectedLabel: selected.label,
    correctLabel: correct.label,
    statusText,
    message: `${statusText}: ${selected.explanation} ${correctAnswerLabel}: ${correct.label}`
  };
}
