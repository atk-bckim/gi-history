import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getLocalizedPath, type Locale } from "@/lib/i18n/config";

type TrackStep = {
  title: string;
  detail: string;
  href: string;
};

type TrackLink = {
  label: string;
  href: string;
};

type LearnerTrack = {
  title: string;
  audience: string;
  focus: string;
  sequence: TrackStep[];
  recommended: TrackLink[];
  artifactTitle: string;
  artifact: string;
  evidence: string[];
};

type PathsCopy = {
  title: string;
  description: string;
  overviewEyebrow: string;
  overviewTitle: string;
  overviewBody: string;
  sharedSteps: TrackStep[];
  labels: {
    sharedSequence: string;
    roleFocus: string;
    sequence: string;
    recommended: string;
    artifact: string;
    evidence: string;
    open: string;
  };
  tracks: LearnerTrack[];
};

const copy: Record<Locale, PathsCopy> = {
  ko: {
    title: "역할별 학습 경로",
    description:
      "같은 AI Copilot 기초를 공유하되, 개발자, 기술 리더, 업무 사용자, 교육자가 각자 필요한 산출물과 검증 방식까지 이어서 학습합니다.",
    overviewEyebrow: "Role-based curriculum",
    overviewTitle: "역할을 고른 뒤 공통 기초, 역할별 실습, 완료 증거 순서로 진행합니다.",
    overviewBody:
      "각 경로는 읽을 강의, 실습실에서 확인할 행동, 만들어야 할 산출물, 완료를 판단할 증거를 함께 제시합니다.",
    sharedSteps: [
      {
        title: "GitHub Copilot 개요에서 시작",
        detail:
          "Copilot 표면, 실행 위치, 정책, 학습 순서를 먼저 맞춰 역할별 용어 차이를 줄입니다.",
        href: "/github-copilot"
      },
      {
        title: "역할별 핵심 강의로 확장",
        detail:
          "개발자는 IDE/CLI, 리더는 운영 정책, 업무 사용자는 Microsoft Copilot, 교육자는 설명과 평가 흐름을 중심으로 이동합니다.",
        href: "/resources"
      },
      {
        title: "AI Copilot Labs에서 마무리",
        detail:
          "프롬프트, 컨텍스트, 워크플로, 에이전트 루프, 퀴즈 피드백을 직접 조작하며 완료 증거를 남깁니다.",
        href: "/labs"
      }
    ],
    labels: {
      sharedSequence: "공통 진행 순서",
      roleFocus: "역할 초점",
      sequence: "학습 순서",
      recommended: "추천 강의와 실습",
      artifact: "예상 산출물",
      evidence: "완료 증거",
      open: "열기"
    },
    tracks: [
      {
        title: "개발자 경로",
        audience: "코드 작성, 리팩터링, 테스트, 리뷰 루프를 Copilot과 함께 운영하는 개발자",
        focus:
          "IDE 컨텍스트 지정, CLI 승인 루프, 에이전트 작업 분해, 코드 리뷰 보조를 하나의 개발 흐름으로 연결합니다.",
        sequence: [
          {
            title: "GitHub Copilot 개요에서 시작",
            detail:
              "inline suggestion, Chat, agent mode, CLI, cloud agent가 언제 필요한지 먼저 구분합니다.",
            href: "/github-copilot"
          },
          {
            title: "VS Code와 CLI 루프 실습",
            detail:
              "작업 전 컨텍스트를 고정하고 터미널 명령, 승인, 검증 결과를 남기는 습관을 만듭니다.",
            href: "/github-copilot/cli"
          },
          {
            title: "리뷰와 보안 기준 연결",
            detail:
              "AI 리뷰를 사람 리뷰 앞의 보조 검토로 배치하고 정책 확인 항목을 정리합니다.",
            href: "/github-copilot/review"
          },
          {
            title: "AI Copilot Labs에서 마무리",
            detail:
              "프롬프트와 컨텍스트 실습 결과를 실제 변경 요청 템플릿으로 정리합니다.",
            href: "/labs"
          }
        ],
        recommended: [
          { label: "GitHub Copilot 전체 지도", href: "/github-copilot" },
          { label: "VS Code Copilot 기본기", href: "/github-copilot/vscode" },
          { label: "Copilot CLI", href: "/github-copilot/cli" },
          { label: "코드 리뷰와 보안", href: "/github-copilot/review" },
          { label: "AI Copilot Labs", href: "/labs" }
        ],
        artifactTitle: "개발 변경 산출물",
        artifact:
          "작업 설명, 선택한 Copilot 표면, 참조 파일, 테스트 명령, 리뷰 요청을 포함한 작은 변경 계획 또는 PR 초안",
        evidence: [
          "컨텍스트 지정 전후의 응답 차이를 설명할 수 있음",
          "테스트 또는 검증 명령 결과를 변경 기록에 남김",
          "AI 리뷰 제안 중 채택/보류 항목을 근거와 함께 분류함"
        ]
      },
      {
        title: "기술 리더 경로",
        audience: "팀 표준, 보안 정책, 리뷰 품질, 에이전트 도입 범위를 결정하는 리더",
        focus:
          "개별 사용법보다 팀 운영 기준, 권한 경계, 승인 흐름, 재사용 가능한 작업 지침을 설계합니다.",
        sequence: [
          {
            title: "GitHub Copilot 개요에서 시작",
            detail:
              "플랜, 실행 위치, 데이터 보호, 조직 정책의 차이를 공통 언어로 정리합니다.",
            href: "/github-copilot"
          },
          {
            title: "Agentic AI 운영 모델 확인",
            detail:
              "프롬프트에서 하네스, 도구, 평가, 루프 엔지니어링으로 확장되는 책임 경계를 봅니다.",
            href: "/agentic-ai"
          },
          {
            title: "리뷰, 보안, 관리자 정책 수립",
            detail:
              "content exclusion, public code matching, 자동 리뷰 사용 기준을 팀 표준에 반영합니다.",
            href: "/github-copilot/review"
          },
          {
            title: "AI Copilot Labs에서 마무리",
            detail:
              "워크플로 시뮬레이터와 에이전트 루프 실습을 팀 운영 체크리스트로 변환합니다.",
            href: "/labs"
          }
        ],
        recommended: [
          { label: "GitHub Copilot 전체 지도", href: "/github-copilot" },
          { label: "Agentic AI", href: "/agentic-ai" },
          { label: "에이전트와 MCP", href: "/github-copilot/agents" },
          { label: "리뷰와 보안 정책", href: "/github-copilot/review" },
          { label: "거버넌스 자료실", href: "/resources" }
        ],
        artifactTitle: "팀 운영 산출물",
        artifact:
          "역할별 Copilot 사용 허용 범위, 승인 기준, 금지 데이터, 리뷰 책임, 완료 체크를 담은 1페이지 운영 규칙",
        evidence: [
          "팀 작업 유형별 권장 Copilot 표면을 설명함",
          "민감 데이터와 정책 예외 처리 기준을 문서화함",
          "운영 규칙을 실제 작업 예시 하나에 적용해 검증함"
        ]
      },
      {
        title: "업무 사용자 경로",
        audience: "문서, 회의, 분석, 사내 지식 검색에 Microsoft Copilot을 적용하는 실무자",
        focus:
          "개발 도구보다 업무 컨텍스트, Microsoft Graph 기반 응답, 검토 가능한 산출물 작성에 집중합니다.",
        sequence: [
          {
            title: "GitHub Copilot 개요에서 시작",
            detail:
              "Copilot이라는 이름이 제품별로 다른 표면과 데이터 경계를 가진다는 점을 먼저 구분합니다.",
            href: "/github-copilot"
          },
          {
            title: "Microsoft Copilot 업무 활용 학습",
            detail:
              "문서, 회의, 메일, 사내 데이터 활용 시 확인해야 할 권한과 근거를 정리합니다.",
            href: "/microsoft-copilot"
          },
          {
            title: "프롬프트와 컨텍스트 템플릿 적용",
            detail:
              "목표, 제약, 출처, 검토 기준을 포함한 요청 형식으로 업무 결과물을 안정화합니다.",
            href: "/resources"
          },
          {
            title: "AI Copilot Labs에서 마무리",
            detail:
              "프롬프트 빌더와 컨텍스트 스택 실습으로 재사용 가능한 업무 요청 템플릿을 만듭니다.",
            href: "/labs"
          }
        ],
        recommended: [
          { label: "Microsoft Copilot", href: "/microsoft-copilot" },
          { label: "프롬프트 템플릿", href: "/resources" },
          { label: "한영 AI 용어집", href: "/glossary" },
          { label: "AI Copilot Labs", href: "/labs" }
        ],
        artifactTitle: "업무 자동화 산출물",
        artifact:
          "반복 업무 하나를 대상으로 한 프롬프트 템플릿, 필요한 자료 목록, 검토 기준, 최종 결과물 예시",
        evidence: [
          "결과물에 사용된 근거와 검토할 위험을 표시함",
          "동일 템플릿으로 두 번째 업무 요청을 재현함",
          "사내 공유 전 사람 검토 항목을 통과함"
        ]
      },
      {
        title: "교육자 경로",
        audience: "AI Copilot 개념을 강의, 워크숍, 온보딩 자료로 전달해야 하는 교육자",
        focus:
          "도구 사용법을 역할별 언어로 번역하고 실습, 퀴즈, 완료 증거를 포함한 수업 흐름을 설계합니다.",
        sequence: [
          {
            title: "GitHub Copilot 개요에서 시작",
            detail:
              "학습자가 혼동하기 쉬운 Copilot 표면, 에이전트, 정책 용어를 먼저 정렬합니다.",
            href: "/github-copilot"
          },
          {
            title: "용어와 출처 기준 확립",
            detail:
              "한영 용어집과 공식 출처를 활용해 교육 자료의 표현과 근거를 통일합니다.",
            href: "/glossary"
          },
          {
            title: "Agentic AI 흐름으로 개념 연결",
            detail:
              "프롬프트, 컨텍스트, 도구, 루프, 평가의 관계를 수업 순서로 재구성합니다.",
            href: "/agentic-ai"
          },
          {
            title: "AI Copilot Labs에서 마무리",
            detail:
              "퀴즈와 실습을 조합해 수강자가 무엇을 증명해야 하는지 명확히 합니다.",
            href: "/labs"
          }
        ],
        recommended: [
          { label: "한영 AI 용어집", href: "/glossary" },
          { label: "GitHub Copilot 전체 지도", href: "/github-copilot" },
          { label: "Agentic AI", href: "/agentic-ai" },
          { label: "AI Copilot Labs", href: "/labs" }
        ],
        artifactTitle: "수업 운영 산출물",
        artifact:
          "역할별 학습 목표, 30-60분 실습 흐름, 평가 질문, 완료 증거를 포함한 강의안 또는 워크숍 안내문",
        evidence: [
          "학습자 역할별로 다른 실습 지시문을 제공함",
          "퀴즈 또는 토론 질문이 공식 출처와 연결됨",
          "완료 증거가 관찰 가능한 행동과 산출물로 표현됨"
        ]
      }
    ]
  },
  en: {
    title: "Role-based learning paths",
    description:
      "Use the same AI Copilot foundation, then move developers, technical leaders, business users, and educators toward the artifacts and evidence their work requires.",
    overviewEyebrow: "Role-based curriculum",
    overviewTitle:
      "Choose a role, follow the sequence, and leave with evidence instead of a loose reading list.",
    overviewBody:
      "Each track names the lessons and labs to use, the artifact to produce, and the Evidence of completion a learner or manager can inspect.",
    sharedSteps: [
      {
        title: "Start with GitHub Copilot overview",
        detail:
          "Align on Copilot surfaces, runtimes, policies, and learning order before the role-specific work begins.",
        href: "/github-copilot"
      },
      {
        title: "Move into the role-specific core",
        detail:
          "Developers go deeper on IDE and CLI loops, leaders on operating policy, business users on Microsoft Copilot, and educators on explanation and assessment.",
        href: "/resources"
      },
      {
        title: "Finish in AI Copilot Labs",
        detail:
          "Practice prompts, context, workflow, agent loops, and quiz feedback so the track ends with observable behavior.",
        href: "/labs"
      }
    ],
    labels: {
      sharedSequence: "Shared sequence",
      roleFocus: "Role focus",
      sequence: "Sequence",
      recommended: "Recommended lessons and labs",
      artifact: "Expected artifact",
      evidence: "Completion evidence",
      open: "Open"
    },
    tracks: [
      {
        title: "Developer path",
        audience:
          "Developers using Copilot for code changes, refactoring, tests, reviews, and terminal work.",
        focus:
          "Connect IDE context, CLI approval loops, agent task breakdown, and code review support into one disciplined development workflow.",
        sequence: [
          {
            title: "Use the GitHub Copilot overview first",
            detail:
              "Separate inline suggestions, Chat, agent mode, CLI, cloud agent, and code review by task type.",
            href: "/github-copilot"
          },
          {
            title: "Practice VS Code and CLI loops",
            detail:
              "Pin context before asking, record command approval, and keep verification output with the work.",
            href: "/github-copilot/cli"
          },
          {
            title: "Connect review and security",
            detail:
              "Use AI review as support before human approval, with policy checks attached to the workflow.",
            href: "/github-copilot/review"
          },
          {
            title: "Complete the track in AI Copilot Labs",
            detail:
              "Turn prompt and context practice into a reusable code-change request template.",
            href: "/labs"
          }
        ],
        recommended: [
          { label: "GitHub Copilot overview", href: "/github-copilot" },
          { label: "VS Code Copilot fundamentals", href: "/github-copilot/vscode" },
          { label: "Copilot CLI", href: "/github-copilot/cli" },
          { label: "Code review and security", href: "/github-copilot/review" },
          { label: "AI Copilot Labs", href: "/labs" }
        ],
        artifactTitle: "Developer workflow artifact",
        artifact:
          "A small change plan or PR draft that includes the task, selected Copilot surface, context files, verification command, and review request.",
        evidence: [
          "Explains how targeted context changed the answer quality.",
          "Records a test or verification command with the change.",
          "Classifies AI review suggestions as accepted or deferred with reasons."
        ]
      },
      {
        title: "Technical leader path",
        audience:
          "Engineering managers, staff engineers, architects, and platform owners setting team standards.",
        focus:
          "Move from individual tool use to team operating rules, permission boundaries, approval gates, and reusable work instructions.",
        sequence: [
          {
            title: "Use the GitHub Copilot overview first",
            detail:
              "Align plan differences, execution locations, data protection, and organization policy in one shared vocabulary.",
            href: "/github-copilot"
          },
          {
            title: "Map the Agentic AI operating model",
            detail:
              "Trace how prompts extend into harnesses, tools, evaluation, and repeatable loops with clear ownership.",
            href: "/agentic-ai"
          },
          {
            title: "Set review, security, and admin policy",
            detail:
              "Turn content exclusion, public code matching, and automatic review choices into team standards.",
            href: "/github-copilot/review"
          },
          {
            title: "Complete the track in AI Copilot Labs",
            detail:
              "Translate workflow simulator and agent loop practice into an operating checklist for the team.",
            href: "/labs"
          }
        ],
        recommended: [
          { label: "GitHub Copilot overview", href: "/github-copilot" },
          { label: "Agentic AI", href: "/agentic-ai" },
          { label: "Agents and MCP", href: "/github-copilot/agents" },
          { label: "Review and security policy", href: "/github-copilot/review" },
          { label: "Governance resources", href: "/resources" }
        ],
        artifactTitle: "Team operating artifact",
        artifact:
          "A one-page team rule covering allowed Copilot use by role, approval gates, prohibited data, review ownership, and done criteria.",
        evidence: [
          "Maps recommended Copilot surfaces to common team work types.",
          "Documents sensitive-data handling and policy exceptions.",
          "Applies the operating rule to one real or realistic team task."
        ]
      },
      {
        title: "Business user path",
        audience:
          "Knowledge workers applying Copilot to documents, meetings, analysis, and internal knowledge work.",
        focus:
          "Center the learning on business context, Microsoft Graph grounded responses, and reviewable work products instead of developer tooling.",
        sequence: [
          {
            title: "Use the GitHub Copilot overview first",
            detail:
              "Use the overview to distinguish product surfaces and data boundaries that share the Copilot name.",
            href: "/github-copilot"
          },
          {
            title: "Learn Microsoft Copilot for work",
            detail:
              "Practice how permissions, files, meetings, mail, and internal sources affect business outputs.",
            href: "/microsoft-copilot"
          },
          {
            title: "Apply prompt and context templates",
            detail:
              "Stabilize requests by naming the goal, constraints, source material, and review criteria.",
            href: "/resources"
          },
          {
            title: "Complete the track in AI Copilot Labs",
            detail:
              "Use the prompt builder and context stack to create a reusable template for a recurring business task.",
            href: "/labs"
          }
        ],
        recommended: [
          { label: "Microsoft Copilot", href: "/microsoft-copilot" },
          { label: "Prompt templates", href: "/resources" },
          { label: "Bilingual AI glossary", href: "/glossary" },
          { label: "AI Copilot Labs", href: "/labs" }
        ],
        artifactTitle: "Business workflow artifact",
        artifact:
          "A prompt template for one recurring workflow, with required source material, review criteria, and a sample final output.",
        evidence: [
          "Marks sources used by the output and risks that need human review.",
          "Reuses the template successfully on a second business request.",
          "Passes a human review checklist before sharing the output."
        ]
      },
      {
        title: "Educator path",
        audience:
          "Instructors, enablement leads, and trainers turning AI Copilot concepts into courses or workshops.",
        focus:
          "Translate tool behavior into role-aware explanations, labs, quiz prompts, and completion evidence learners can demonstrate.",
        sequence: [
          {
            title: "Use the GitHub Copilot overview first",
            detail:
              "Align the Copilot surfaces, agent terms, and policy language learners are most likely to confuse.",
            href: "/github-copilot"
          },
          {
            title: "Ground terminology and sources",
            detail:
              "Use the bilingual glossary and primary-source resource page to keep teaching language consistent.",
            href: "/glossary"
          },
          {
            title: "Connect concepts through Agentic AI",
            detail:
              "Reframe prompts, context, tools, loops, and evaluation as a teachable progression.",
            href: "/agentic-ai"
          },
          {
            title: "Complete the track in AI Copilot Labs",
            detail:
              "Pair quiz feedback with hands-on labs so each learner knows what they must prove.",
            href: "/labs"
          }
        ],
        recommended: [
          { label: "Bilingual AI glossary", href: "/glossary" },
          { label: "GitHub Copilot overview", href: "/github-copilot" },
          { label: "Agentic AI", href: "/agentic-ai" },
          { label: "AI Copilot Labs", href: "/labs" }
        ],
        artifactTitle: "Teaching plan artifact",
        artifact:
          "A lesson or workshop guide with role-specific learning objectives, a 30-60 minute lab flow, assessment questions, and completion evidence.",
        evidence: [
          "Provides different lab prompts for different learner roles.",
          "Connects quiz or discussion questions to primary sources.",
          "Defines completion evidence as observable behavior and artifacts."
        ]
      }
    ]
  }
};

export default async function PathsPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const page = copy[locale];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-normal text-ink">
          {page.title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted">{page.description}</p>
      </header>

      <section className="mt-10 rounded-lg border border-line bg-white/75 p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-microsoft">
          {page.overviewEyebrow}
        </p>
        <div className="mt-3 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <h2 className="text-2xl font-semibold leading-tight text-ink">
              {page.overviewTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-muted">
              {page.overviewBody}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
              {page.labels.sharedSequence}
            </h2>
            <ol className="mt-4 space-y-4">
              {page.sharedSteps.map((step, index) => (
                <li
                  key={step.title}
                  className="grid gap-3 rounded-lg border border-line bg-canvas p-4 sm:grid-cols-[2.5rem_minmax(0,1fr)]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-github text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <Link
                      href={getLocalizedPath(locale, step.href)}
                      className="group inline-flex items-center gap-2 font-semibold text-ink hover:text-microsoft"
                    >
                      {step.title}
                      <ArrowRight
                        aria-hidden
                        className="h-4 w-4 transition group-hover:translate-x-0.5"
                      />
                    </Link>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {step.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mt-8 space-y-6">
        {page.tracks.map((track, trackIndex) => (
          <article
            key={track.title}
            className="rounded-lg border border-line bg-white/75 p-6 shadow-sm sm:p-8"
          >
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                  {String(trackIndex + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-ink">
                  {track.title}
                </h2>
                <p className="mt-4 text-sm font-semibold text-ink">
                  {track.audience}
                </p>
                <div className="mt-5 rounded-lg border border-line bg-canvas p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    {page.labels.roleFocus}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {track.focus}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
                    {page.labels.sequence}
                  </h3>
                  <ol className="mt-4 space-y-3">
                    {track.sequence.map((step, index) => (
                      <li
                        key={`${track.title}-${step.title}`}
                        className="grid gap-3 sm:grid-cols-[2.25rem_minmax(0,1fr)]"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white text-sm font-semibold text-ink">
                          {index + 1}
                        </span>
                        <div>
                          <Link
                            href={getLocalizedPath(locale, step.href)}
                            className="group inline-flex items-center gap-2 font-semibold text-ink hover:text-microsoft"
                          >
                            {step.title}
                            <ArrowRight
                              aria-hidden
                              className="h-4 w-4 transition group-hover:translate-x-0.5"
                            />
                          </Link>
                          <p className="mt-1 text-sm leading-6 text-muted">
                            {step.detail}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>

                <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  <div className="rounded-lg border border-line bg-canvas p-4">
                    <h3 className="text-sm font-semibold text-ink">
                      {page.labels.recommended}
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {track.recommended.map((item) => (
                        <Link
                          key={`${track.title}-${item.label}`}
                          href={getLocalizedPath(locale, item.href)}
                          className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-muted transition hover:border-microsoft hover:text-ink"
                        >
                          {item.label}
                          <ArrowRight aria-hidden className="h-3.5 w-3.5" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border border-line bg-canvas p-4">
                    <h3 className="text-sm font-semibold text-ink">
                      {track.artifactTitle}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted">
                      {track.artifact}
                    </p>
                  </div>
                </section>

                <section className="rounded-lg border border-line bg-canvas p-4">
                  <h3 className="text-sm font-semibold text-ink">
                    {page.labels.evidence}
                  </h3>
                  <ul className="mt-4 grid gap-3 md:grid-cols-3">
                    {track.evidence.map((item) => (
                      <li
                        key={`${track.title}-${item}`}
                        className="flex gap-3 text-sm leading-6 text-muted"
                      >
                        <CheckCircle2
                          aria-hidden
                          className="mt-0.5 h-4 w-4 shrink-0 text-success"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
