"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  DEFAULT_QUESTIONS,
  evaluateQuizAnswer,
  type QuizFeedback,
  type QuizQuestion
} from "@/components/learning/quiz-model";
import type { Locale } from "@/lib/i18n/config";

export { evaluateQuizAnswer, type QuizQuestion };

const copy = {
  score: { ko: "점수", en: "Score" },
  checkAnswer: { ko: "정답 확인", en: "Check answer" },
  nextQuestion: { ko: "다음 문제", en: "Next question" },
  complete: { ko: "퀴즈 완료", en: "Quiz complete" },
  retry: { ko: "다시 풀기", en: "Retry quiz" },
  optionsLegend: { ko: "답변 선택지", en: "Answer options" }
} as const;

export function QuizEngine({
  questions,
  locale = "ko"
}: {
  questions?: QuizQuestion[];
  locale?: Locale;
}) {
  const quizQuestions = questions ?? DEFAULT_QUESTIONS[locale];
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string>("");
  const [feedback, setFeedback] = useState<QuizFeedback | null>(null);
  const [checkedAnswers, setCheckedAnswers] = useState<Record<string, QuizFeedback>>(
    {}
  );
  const formRef = useRef<HTMLFormElement>(null);
  const question = quizQuestions[questionIndex];

  if (!question) {
    return null;
  }

  const score = Object.values(checkedAnswers).filter((answer) => answer.isCorrect).length;
  const isLastQuestion = questionIndex === quizQuestions.length - 1;

  function checkAnswer() {
    const selectedFromForm = formRef.current
      ? String(new FormData(formRef.current).get(question.id) ?? "")
      : "";
    const selected = selectedFromForm || selectedOptionId;

    if (!selected) {
      return;
    }

    const nextFeedback = evaluateQuizAnswer(question, selected, locale);

    flushSync(() => {
      setFeedback(nextFeedback);
      setCheckedAnswers((current) => ({
        ...current,
        [question.id]: nextFeedback
      }));
    });
  }

  function nextQuestion() {
    if (!feedback) {
      return;
    }

    setQuestionIndex((current) => Math.min(current + 1, quizQuestions.length - 1));
    setSelectedOptionId("");
    setFeedback(null);
  }

  function resetCurrentAnswer() {
    setFeedback(null);
    setCheckedAnswers((current) => {
      if (!current[question.id]) {
        return current;
      }

      const next = { ...current };
      delete next[question.id];
      return next;
    });
  }

  function retryQuiz() {
    setQuestionIndex(0);
    setSelectedOptionId("");
    setFeedback(null);
    setCheckedAnswers({});
  }

  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-microsoft">
            {locale === "ko" ? "개념 퀴즈" : "Concept quiz"}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">{question.prompt}</h2>
        </div>
        <div className="space-y-2 text-right">
          <span className="inline-flex rounded-md bg-canvas px-3 py-2 font-mono text-xs text-muted">
            {questionIndex + 1}/{quizQuestions.length}
          </span>
          <p className="text-sm font-semibold text-ink">
            {copy.score[locale]}: {score}/{quizQuestions.length}
          </p>
        </div>
      </div>

      <form ref={formRef}>
        <fieldset className="mt-5 space-y-3">
          <legend className="sr-only">{copy.optionsLegend[locale]}</legend>
          {question.options.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-start gap-3 rounded-md border border-line bg-canvas p-4 transition hover:border-microsoft"
            >
              <input
                type="radio"
                name={question.id}
                value={option.id}
                checked={selectedOptionId === option.id}
                onClick={() => {
                  setSelectedOptionId(option.id);
                  resetCurrentAnswer();
                }}
                onChange={() => {
                  setSelectedOptionId(option.id);
                  resetCurrentAnswer();
                }}
                className="mt-1 h-4 w-4 accent-microsoft"
              />
              <span className="text-sm leading-6 text-ink">{option.label}</span>
            </label>
          ))}
        </fieldset>
      </form>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={checkAnswer}
          disabled={!selectedOptionId}
          className="rounded-md bg-github px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-45"
        >
          {copy.checkAnswer[locale]}
        </button>
        {quizQuestions.length > 1 && questionIndex < quizQuestions.length - 1 ? (
          <button
            type="button"
            onClick={nextQuestion}
            disabled={!feedback}
            className="rounded-md border border-line px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-45"
          >
            {copy.nextQuestion[locale]}
          </button>
        ) : null}
      </div>

      {feedback ? (
        <div
          role="status"
          className={
            feedback.isCorrect
              ? "mt-5 rounded-md border border-success/30 bg-success/10 p-4 text-sm leading-6 text-ink"
              : "mt-5 rounded-md border border-warning/30 bg-warning/10 p-4 text-sm leading-6 text-ink"
          }
        >
          <strong>{feedback.statusText}:</strong>{" "}
          {feedback.message.replace(`${feedback.statusText}: `, "")}
        </div>
      ) : null}

      {feedback && isLastQuestion ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-line bg-canvas p-4">
          <p className="text-sm font-semibold text-ink">
            {copy.complete[locale]}
          </p>
          <button
            type="button"
            onClick={retryQuiz}
            className="rounded-md border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-canvas"
          >
            {copy.retry[locale]}
          </button>
        </div>
      ) : null}
    </section>
  );
}
