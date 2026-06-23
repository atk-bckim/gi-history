"use client";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  BookOpenCheck,
  Bot,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Code2,
  FileSearch,
  GitBranch,
  LayoutList,
  ListChecks,
  Pause,
  Play,
  RefreshCw,
  ShieldCheck,
  TestTube2,
  UserCheck
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import type { ShowcaseLocale } from "@/components/showcase/showcase-data";

type AgentId =
  | "research"
  | "planner"
  | "implementer"
  | "reviewer"
  | "test-runner"
  | "security"
  | "docs";

type StageId =
  | "intake"
  | "research"
  | "plan"
  | "implementation"
  | "tests"
  | "review"
  | "approval"
  | "merge";

type Status = "running" | "waiting" | "blocked" | "complete";

type Agent = {
  id: AgentId;
  label: string;
  status: Status;
  queue: string;
  eta: string;
  progress: number;
  task: string;
  model: string;
  toolCalls: string[];
  context: string[];
  mcp: string[];
  risk: string;
};

type Stage = {
  id: StageId;
  label: string;
  status: Status;
  agentId: AgentId;
  time: string;
  description: string;
};

type Copy = {
  title: string;
  subtitle: string;
  runStatus: string;
  branch: string;
  budget: string;
  modelPolicy: string;
  toolPolicy: string;
  agentRoster: string;
  workflowGraph: string;
  traceReplay: string;
  scoreTrend: string;
  inspector: string;
  selected: string;
  currentTask: string;
  toolCalls: string;
  contextPack: string;
  mcpSources: string;
  approval: string;
  risks: string;
  buildBreakdown: string;
  replaySpeed: string;
  replayPosition: string;
  replayReadout: string;
  selectedTrace: string;
  humanGate: string;
  loopTests: string;
  loopChanges: string;
  live: string;
  queue: string;
  eta: string;
  approveTests: string;
  approveSecurity: string;
  approveDocs: string;
  approveReviewer: string;
  breakdown: {
    title: string;
    body: string;
  }[];
};

const copy = {
  en: {
    title: "Agentic Workflow Control Room",
    subtitle: "Subagent-driven development - Harness engineering - Loop replay",
    runStatus: "Run #1427",
    branch: "Branch",
    budget: "Budget",
    modelPolicy: "Model Policy",
    toolPolicy: "Tool Policy",
    agentRoster: "AGENT ROSTER",
    workflowGraph: "WORKFLOW GRAPH",
    traceReplay: "Trace Replay",
    scoreTrend: "Eval Score Trend",
    inspector: "Inspector",
    selected: "Selected",
    currentTask: "Current Task",
    toolCalls: "Tool Calls",
    contextPack: "Context Pack",
    mcpSources: "MCP Sources",
    approval: "APPROVAL GATE",
    risks: "Risk Notes",
    buildBreakdown: "Build Breakdown",
    replaySpeed: "Replay speed",
    replayPosition: "Replay position",
    replayReadout: "Replay readout",
    selectedTrace: "Selected trace",
    humanGate: "Human Gate",
    loopTests: "Loop: Tests Failed",
    loopChanges: "Loop: Changes Requested",
    live: "Live",
    queue: "Queue",
    eta: "ETA",
    approveTests: "Tests must pass",
    approveSecurity: "Security scan clean",
    approveDocs: "Docs updated",
    approveReviewer: "Reviewer sign-off",
    breakdown: [
      {
        title: "Subagent-driven development",
        body: "Specialized agents share a plan while keeping role, context pack, and tool scope explicit."
      },
      {
        title: "Harness gates",
        body: "Automated tests, type checks, and approval policy protect main before high-risk actions."
      },
      {
        title: "Loop replay",
        body: "Failures and review comments replay with bounded retries so teams can reproduce decisions."
      },
      {
        title: "Evals and observability",
        body: "Quality, reliability, security, and pass-rate trends expose regressions before merge."
      }
    ]
  },
  ko: {
    title: "에이전틱 워크플로우 컨트롤 룸",
    subtitle: "하위 에이전트 기반 개발 - 하네스 엔지니어링 - 루프 리플레이",
    runStatus: "실행 #1427",
    branch: "브랜치",
    budget: "예산",
    modelPolicy: "모델 정책",
    toolPolicy: "도구 정책",
    agentRoster: "에이전트 명단",
    workflowGraph: "워크플로우 그래프",
    traceReplay: "트레이스 리플레이",
    scoreTrend: "평가 점수 추세",
    inspector: "인스펙터",
    selected: "선택됨",
    currentTask: "현재 작업",
    toolCalls: "도구 호출",
    contextPack: "컨텍스트 팩",
    mcpSources: "MCP 소스",
    approval: "승인 게이트",
    risks: "위험 메모",
    buildBreakdown: "빌드 분석",
    replaySpeed: "리플레이 속도",
    replayPosition: "리플레이 위치",
    replayReadout: "리플레이 표시",
    selectedTrace: "선택된 트레이스",
    humanGate: "휴먼 게이트",
    loopTests: "루프: 테스트 실패",
    loopChanges: "루프: 변경 요청",
    live: "라이브",
    queue: "큐",
    eta: "예상",
    approveTests: "테스트 통과",
    approveSecurity: "보안 스캔 정상",
    approveDocs: "문서 업데이트",
    approveReviewer: "리뷰어 승인",
    breakdown: [
      {
        title: "하위 에이전트 기반 개발",
        body: "전문화된 에이전트가 역할, 컨텍스트 팩, 도구 범위를 분리한 채 같은 계획을 공유합니다."
      },
      {
        title: "하네스 게이트",
        body: "테스트, 타입 검사, 승인 정책이 위험한 작업과 메인 병합을 보호합니다."
      },
      {
        title: "루프 리플레이",
        body: "실패와 리뷰 코멘트를 제한된 재시도로 재생해 의사결정을 재현합니다."
      },
      {
        title: "평가와 관측성",
        body: "품질, 신뢰도, 보안, 통과율 추세로 병합 전 회귀를 드러냅니다."
      }
    ]
  }
} satisfies Record<ShowcaseLocale, Copy>;

const agentIcons: Record<AgentId, typeof Bot> = {
  research: FileSearch,
  planner: LayoutList,
  implementer: Code2,
  reviewer: CheckCircle2,
  "test-runner": TestTube2,
  security: ShieldCheck,
  docs: BookOpenCheck
};

const agents: Agent[] = [
  {
    id: "research",
    label: "Research Agent",
    status: "complete",
    queue: "2/4",
    eta: "2m 10s",
    progress: 83,
    task: "Map source contracts and search fallback behavior",
    model: "GPT-4.1",
    toolCalls: ["search_codebase", "read_file", "summarize_requirements"],
    context: ["requirements.md", "api/contracts/search.yaml", "src/search/semantic.ts"],
    mcp: ["Codebase", "Docs Server"],
    risk: "Search scope can drift if fallback contracts are stale."
  },
  {
    id: "planner",
    label: "Planner Agent",
    status: "complete",
    queue: "1/3",
    eta: "1m 20s",
    progress: 67,
    task: "Sequence implementation, validation, and review gates",
    model: "GPT-4.1",
    toolCalls: ["write_plan", "dependency_scan", "assign_subtasks"],
    context: ["plan-v3.md", "risk-register.md", "test-matrix.md"],
    mcp: ["Docs Server", "Package Registry"],
    risk: "Plan updates must preserve existing branch ownership."
  },
  {
    id: "implementer",
    label: "Implementer Agent",
    status: "running",
    queue: "3/5",
    eta: "4m 05s",
    progress: 72,
    task: "Implement semantic search integration with vector store fallback",
    model: "GPT-4.1 (128k context)",
    toolCalls: ["search_codebase", "read_file", "write_file", "lint", "typecheck"],
    context: ["requirements.md", "api/contracts/search.yaml", "src/search/semantic.ts"],
    mcp: ["Codebase", "Vector DB", "Package Registry"],
    risk: "API rate limit approaching 80% during replay."
  },
  {
    id: "reviewer",
    label: "Reviewer Agent",
    status: "waiting",
    queue: "0/2",
    eta: "after tests",
    progress: 38,
    task: "Review patch for regression risk and missing assertions",
    model: "Claude-3.5",
    toolCalls: ["diff_review", "comment_threads", "policy_check"],
    context: ["diff.patch", "test-results.json", "plan-v3.md"],
    mcp: ["Codebase", "GitHub"],
    risk: "Reviewer gate blocks merge until trace replay is clean."
  },
  {
    id: "test-runner",
    label: "Test Runner",
    status: "running",
    queue: "2/6",
    eta: "3m 40s",
    progress: 58,
    task: "Run focused suites, typecheck, and smoke replay",
    model: "Harness",
    toolCalls: ["npm_test", "typecheck", "playwright_smoke"],
    context: ["vitest.config.ts", "smoke.spec.ts", "coverage-summary.json"],
    mcp: ["CI Harness", "Browser"],
    risk: "Two flaky tests detected in the last three runs."
  },
  {
    id: "security",
    label: "Security Agent",
    status: "waiting",
    queue: "0/2",
    eta: "gate 7",
    progress: 45,
    task: "Sandbox policy escalation review",
    model: "GPT-4.1",
    toolCalls: ["secret_scan", "dependency_audit", "permission_review"],
    context: ["permissions.json", "npm-audit.json", "tool-policy.md"],
    mcp: ["Codebase", "Package Registry"],
    risk: "Network tools are allowed, but write scope must remain scoped."
  },
  {
    id: "docs",
    label: "Docs Agent",
    status: "waiting",
    queue: "0/1",
    eta: "5m ago",
    progress: 24,
    task: "Update implementation notes after approval",
    model: "GPT-4.1 mini",
    toolCalls: ["read_docs", "write_summary", "link_check"],
    context: ["release-notes.md", "operator-guide.md"],
    mcp: ["Docs Server"],
    risk: "Docs must reflect final gate outcome, not interim run state."
  }
];

const stages: Stage[] = [
  {
    id: "intake",
    label: "Intake",
    status: "complete",
    agentId: "planner",
    time: "2m 12s",
    description: "Requirement packet accepted and scoped."
  },
  {
    id: "research",
    label: "Research",
    status: "complete",
    agentId: "research",
    time: "6m 45s",
    description: "Codebase and MCP sources mapped."
  },
  {
    id: "plan",
    label: "Plan",
    status: "complete",
    agentId: "planner",
    time: "4m 18s",
    description: "Subtasks and harness gates sequenced."
  },
  {
    id: "implementation",
    label: "Implementation",
    status: "running",
    agentId: "implementer",
    time: "12m 33s",
    description: "Patch is being applied with scoped tools."
  },
  {
    id: "tests",
    label: "Tests",
    status: "running",
    agentId: "test-runner",
    time: "3m 40s",
    description: "Focused tests and typecheck are in progress."
  },
  {
    id: "review",
    label: "Review",
    status: "waiting",
    agentId: "reviewer",
    time: "queued",
    description: "Review waits for green harness output."
  },
  {
    id: "approval",
    label: "Approval",
    status: "waiting",
    agentId: "security",
    time: "gate 7",
    description: "Human sign-off required before merge."
  },
  {
    id: "merge",
    label: "Merge",
    status: "blocked",
    agentId: "docs",
    time: "pending",
    description: "Merge remains locked until approval closes."
  }
];

const statusTone: Record<Status, string> = {
  running: "border-sky-300/45 bg-sky-400/10 text-sky-200",
  waiting: "border-amber-300/35 bg-amber-400/10 text-amber-200",
  blocked: "border-red-300/35 bg-red-400/10 text-red-200",
  complete: "border-emerald-300/35 bg-emerald-400/10 text-emerald-200"
};

const statusDot: Record<Status, string> = {
  running: "bg-sky-300",
  waiting: "bg-amber-300",
  blocked: "bg-red-300",
  complete: "bg-emerald-300"
};

export function AgenticWorkflowControlRoom({
  locale = "en"
}: {
  locale?: ShowcaseLocale;
}) {
  const t = copy[locale];
  const [selectedAgentId, setSelectedAgentId] =
    useState<AgentId>("implementer");
  const [selectedStageId, setSelectedStageId] =
    useState<StageId>("implementation");
  const [replayPosition, setReplayPosition] = useState(6);
  const [replaySpeed, setReplaySpeed] = useState("1.0");
  const [approvals, setApprovals] = useState({
    tests: false,
    security: false,
    docs: false,
    reviewer: false
  });

  const selectedAgent =
    agents.find((agent) => agent.id === selectedAgentId) ?? agents[0];
  const selectedStage =
    stages.find((stage) => stage.id === selectedStageId) ?? stages[0];
  const selectedStageAgent =
    agents.find((agent) => agent.id === selectedStage.agentId) ?? selectedAgent;

  const replayEvent = useMemo(() => {
    const events = [
      "Start: Implementer Agent",
      "Checkout branch",
      "Read files",
      "Tool call: search_codebase",
      "Write: src/search/semantic.ts",
      "Tool call: lint",
      "Tool call: typecheck",
      "Commit: 9f3c2e1",
      "Push branch",
      "Tests triggered"
    ];
    return events[replayPosition] ?? events[0];
  }, [replayPosition]);

  return (
    <main className="min-h-screen bg-[#05080c] text-slate-100">
      <section className="border-b border-white/10 bg-[linear-gradient(180deg,#071018_0%,#08121b_58%,#05080c_100%)]">
        <div className="mx-auto flex max-w-[1680px] flex-col gap-3 px-3 py-3 sm:px-4 lg:px-5">
          <header className="grid gap-3 rounded border border-white/10 bg-[#0a141e]/95 p-3 shadow-2xl shadow-black/35 xl:grid-cols-[minmax(320px,1.1fr)_2.2fr_auto]">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded border border-sky-300/35 bg-sky-400/10 text-sky-300">
                <Bot className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <h1 className="text-xl font-semibold leading-tight text-white sm:text-2xl">
                  {t.title}
                </h1>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                  {t.subtitle}
                </p>
              </div>
            </div>

            <div className="grid gap-2 text-xs text-slate-400 sm:grid-cols-2 xl:grid-cols-4">
              <StatusMetric
                label={t.runStatus}
                value="RUNNING 00:23:47"
                tone="text-emerald-200"
              />
              <StatusMetric
                label={t.branch}
                value="feat/ai-search-improvements"
                icon={GitBranch}
              />
              <StatusMetric label={t.budget} value="$1.72 / $5.00 (34%)" />
              <StatusMetric label={t.modelPolicy} value="GPT-4.1 + Claude-3.5" />
            </div>

            <div className="flex items-center justify-between gap-2 xl:justify-end">
              <div className="hidden max-w-[190px] text-xs text-slate-400 sm:block">
                <span className="block text-slate-300">{t.toolPolicy}</span>
                Read: All / Write: Scoped / Network: Allowlist
              </div>
              <button className="inline-flex items-center gap-2 rounded border border-sky-300/35 bg-sky-500/15 px-3 py-2 text-xs font-medium text-sky-100">
                <Pause className="h-3.5 w-3.5" aria-hidden />
                Pause Run
              </button>
            </div>
          </header>

          <div className="grid gap-3 xl:grid-cols-[250px_minmax(0,1fr)_320px]">
            <AgentRoster
              t={t}
              selectedAgentId={selectedAgentId}
              onSelectAgent={setSelectedAgentId}
            />

            <section className="min-w-0 space-y-3">
              <WorkflowPanel
                t={t}
                selectedStageId={selectedStageId}
                onSelectStage={(stage) => {
                  setSelectedStageId(stage);
                  const next = stages.find((item) => item.id === stage);
                  if (next) {
                    setSelectedAgentId(next.agentId);
                  }
                }}
              />

              <div className="grid gap-3 lg:grid-cols-[1fr_1.15fr]">
                <TraceReplay
                  t={t}
                  replayPosition={replayPosition}
                  replaySpeed={replaySpeed}
                  replayEvent={replayEvent}
                  onReplayPosition={setReplayPosition}
                  onReplaySpeed={setReplaySpeed}
                />
                <ScoreTrend t={t} />
              </div>
            </section>

            <Inspector
              t={t}
              selectedAgent={selectedAgent}
              selectedStage={selectedStage}
              selectedStageAgent={selectedStageAgent}
              approvals={approvals}
              onToggleApproval={(key) =>
                setApprovals((current) => ({
                  ...current,
                  [key]: !current[key]
                }))
              }
            />
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#071017]">
        <div className="mx-auto max-w-[1680px] px-3 py-4 sm:px-4 lg:px-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            {t.buildBreakdown}
          </h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {t.breakdown.map((item, index) => {
              const Icon = [Boxes, ShieldCheck, RefreshCw, BarChart3][index];
              return (
                <article
                  key={item.title}
                  className="rounded border border-white/10 bg-[#0a141d]/90 p-4"
                >
                  <Icon className="h-5 w-5 text-sky-300" aria-hidden />
                  <h3 className="mt-3 font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {item.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

function StatusMetric({
  label,
  value,
  tone = "text-slate-200",
  icon: Icon
}: {
  label: string;
  value: string;
  tone?: string;
  icon?: typeof Activity;
}) {
  return (
    <div className="rounded border border-white/10 bg-white/[0.03] px-3 py-2">
      <div className="flex items-center gap-2">
        {Icon ? <Icon className="h-3.5 w-3.5 text-slate-500" aria-hidden /> : null}
        <span>{label}</span>
      </div>
      <p className={`mt-1 truncate font-mono text-[11px] ${tone}`}>{value}</p>
    </div>
  );
}

function AgentRoster({
  t,
  selectedAgentId,
  onSelectAgent
}: {
  t: Copy;
  selectedAgentId: AgentId;
  onSelectAgent: (agentId: AgentId) => void;
}) {
  return (
    <aside className="rounded border border-white/10 bg-[#0a141d]/92 p-3">
      <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-400">
        <span>{t.agentRoster}</span>
        <ListChecks className="h-4 w-4" aria-hidden />
      </div>
      <div className="space-y-2">
        {agents.map((agent) => {
          const Icon = agentIcons[agent.id];
          const isSelected = selectedAgentId === agent.id;

          return (
            <button
              key={agent.id}
              type="button"
              aria-label={`Select ${agent.label}`}
              onClick={() => onSelectAgent(agent.id)}
              className={`w-full rounded border p-3 text-left transition ${
                isSelected
                  ? "border-sky-300/70 bg-sky-400/15"
                  : "border-white/10 bg-white/[0.03] hover:border-sky-300/35"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded border border-white/10 bg-black/20 text-sky-300">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-white">
                      {agent.label}
                    </span>
                    <span className="text-xs text-slate-400">{agent.queue}</span>
                  </span>
                  <span className="mt-1 flex items-center gap-2 text-[11px] uppercase text-slate-500">
                    <span className={`h-1.5 w-1.5 rounded-full ${statusDot[agent.status]}`} />
                    {agent.status}
                  </span>
                  <span className="mt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>
                      {t.eta} {agent.eta}
                    </span>
                    <span>{agent.progress}%</span>
                  </span>
                  <span className="mt-2 block h-1 rounded-full bg-white/10">
                    <span
                      className="block h-full rounded-full bg-emerald-300"
                      style={{ width: `${agent.progress}%` }}
                    />
                  </span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function WorkflowPanel({
  t,
  selectedStageId,
  onSelectStage
}: {
  t: Copy;
  selectedStageId: StageId;
  onSelectStage: (stageId: StageId) => void;
}) {
  return (
    <section className="rounded border border-white/10 bg-[#08121b]/95">
      <div className="flex flex-col gap-2 border-b border-white/10 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-200">
          {t.workflowGraph}
        </h2>
        <div className="flex flex-wrap gap-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            Completed
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
            Running
          </span>
          <span className="inline-flex items-center gap-1">
            <UserCheck className="h-3.5 w-3.5 text-amber-300" aria-hidden />
            {t.humanGate}
          </span>
        </div>
      </div>

      <div className="relative overflow-x-auto p-4">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.055)_1px,transparent_1px)] bg-[size:28px_28px]" />
        <div className="relative min-w-[920px]">
          <div className="grid grid-cols-8 items-center gap-3">
            {stages.map((stage, index) => {
              const isSelected = selectedStageId === stage.id;
              return (
                <div key={stage.id} className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label={`Select ${stage.label} stage`}
                    onClick={() => onSelectStage(stage.id)}
                    className={`min-h-[104px] w-full rounded border p-3 text-left transition ${
                      isSelected
                        ? "border-sky-300 bg-sky-400/15 shadow-[0_0_0_1px_rgba(56,189,248,0.35)]"
                        : `${statusTone[stage.status]} hover:border-sky-300/60`
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-white">
                        {stage.label}
                      </span>
                      {stage.id === "approval" ? (
                        <UserCheck className="h-4 w-4 text-amber-300" aria-hidden />
                      ) : (
                        <span className={`h-2 w-2 rounded-full ${statusDot[stage.status]}`} />
                      )}
                    </span>
                    <span className="mt-2 block font-mono text-xs text-slate-400">
                      #{index + 1} {stage.time}
                    </span>
                    <span className="mt-2 block text-xs leading-5 text-slate-400">
                      {stage.description}
                    </span>
                  </button>
                  {index < stages.length - 1 ? (
                    <ChevronRight className="h-5 w-5 shrink-0 text-slate-500" aria-hidden />
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
            <div className="rounded border border-sky-300/35 bg-sky-400/10 px-3 py-2 text-sky-200">
              {t.loopTests} - 2 retries
            </div>
            <div className="rounded border border-sky-300/35 bg-sky-400/10 px-3 py-2 text-sky-200">
              {t.loopChanges} - 1 retry
            </div>
            <div className="rounded border border-amber-300/35 bg-amber-400/10 px-3 py-2 text-amber-200">
              {t.humanGate}: Approval
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-300">
            {t.selectedTrace}: {stages.find((stage) => stage.id === selectedStageId)?.label}
          </p>
        </div>
      </div>
    </section>
  );
}

function TraceReplay({
  t,
  replayPosition,
  replaySpeed,
  replayEvent,
  onReplayPosition,
  onReplaySpeed
}: {
  t: Copy;
  replayPosition: number;
  replaySpeed: string;
  replayEvent: string;
  onReplayPosition: (position: number) => void;
  onReplaySpeed: (speed: string) => void;
}) {
  return (
    <section className="rounded border border-white/10 bg-[#0a141d]/92 p-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          {t.traceReplay}
        </h2>
        <Play className="h-4 w-4 text-slate-400" aria-hidden />
      </div>
      <div className="mt-3 rounded border border-white/10 bg-black/20 p-3 font-mono text-xs text-slate-400">
        {[
          "12:11:02 Start: Implementer Agent",
          "12:11:03 Checkout branch",
          "12:11:08 Read files",
          "12:11:12 Tool call: search_codebase",
          "12:11:18 Write: src/search/semantic.ts",
          "12:11:24 Tool call: lint",
          "12:11:30 Tool call: typecheck",
          "12:11:35 Commit: 9f3c2e1",
          "12:11:36 Tests triggered"
        ].map((line, index) => (
          <div
            key={line}
            className={`rounded px-2 py-1 ${
              replayPosition === index ? "bg-sky-400/15 text-sky-100" : ""
            }`}
          >
            {line}
          </div>
        ))}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_110px]">
        <label className="text-xs text-slate-400">
          {t.replayPosition}
          <input
            aria-label={t.replayPosition}
            className="mt-2 w-full accent-sky-400"
            type="range"
            min={0}
            max={8}
            value={replayPosition}
            onChange={(event) => onReplayPosition(Number(event.target.value))}
          />
        </label>
        <label className="text-xs text-slate-400">
          {t.replaySpeed}
          <select
            aria-label={t.replaySpeed}
            className="mt-2 w-full rounded border border-white/10 bg-[#08121b] px-2 py-2 text-slate-100"
            value={replaySpeed}
            onChange={(event) => onReplaySpeed(event.target.value)}
          >
            <option value="0.5">0.5x</option>
            <option value="1.0">1.0x</option>
            <option value="1.5">1.5x</option>
            <option value="2.0">2.0x</option>
          </select>
        </label>
      </div>
      <p className="mt-2 text-sm text-slate-300">
        {t.replayReadout}: {replaySpeed}x - {replayEvent}
      </p>
    </section>
  );
}

function ScoreTrend({ t }: { t: Copy }) {
  const points = [44, 51, 62, 58, 69, 74, 78, 86, 82, 91];
  return (
    <section className="rounded border border-white/10 bg-[#0a141d]/92 p-3">
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {t.scoreTrend}
      </h2>
      <div className="mt-3 grid grid-cols-4 gap-2 text-sm">
        {[
          ["Overall", "87", "+6 pts"],
          ["Pass Rate", "88.7%", "+4.3%"],
          ["Reliability", "91%", "+5%"],
          ["Security", "95%", "+5%"]
        ].map(([label, value, delta]) => (
          <div key={label} className="border-r border-white/10 last:border-r-0">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 text-lg font-semibold text-white">{value}</p>
            <p className="text-xs text-emerald-300">{delta}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex h-28 items-end gap-1 border-l border-b border-white/10 px-2">
        {points.map((point, index) => (
          <span
            key={`${point}-${index}`}
            className="flex-1 rounded-t bg-sky-400/70"
            style={{ height: `${point}%` }}
          />
        ))}
      </div>
    </section>
  );
}

function Inspector({
  t,
  selectedAgent,
  selectedStage,
  selectedStageAgent,
  approvals,
  onToggleApproval
}: {
  t: Copy;
  selectedAgent: Agent;
  selectedStage: Stage;
  selectedStageAgent: Agent;
  approvals: Record<"tests" | "security" | "docs" | "reviewer", boolean>;
  onToggleApproval: (key: "tests" | "security" | "docs" | "reviewer") => void;
}) {
  const Icon = agentIcons[selectedAgent.id];
  return (
    <aside className="rounded border border-white/10 bg-[#0a141d]/95 p-3">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          {t.inspector}
        </h2>
        <span className="text-xs text-sky-200">
          {t.selected}: {selectedAgent.label}
        </span>
      </div>

      <div className="mt-4 flex items-start gap-3">
        <span className="grid h-10 w-10 place-items-center rounded border border-sky-300/35 bg-sky-400/10 text-sky-300">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-white">{selectedAgent.label}</h3>
          <p className="mt-1 text-xs text-slate-400">
            {selectedAgent.model} - {selectedAgent.progress}%
          </p>
          <div className="mt-2 h-1 rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-300"
              style={{ width: `${selectedAgent.progress}%` }}
            />
          </div>
        </div>
      </div>

      <InspectorBlock title={t.currentTask}>
        <p className="text-sm leading-6 text-slate-300">{selectedAgent.task}</p>
        <p className="mt-2 text-xs text-slate-500">
          Stage: {selectedStage.label} / Owner: {selectedStageAgent.label}
        </p>
      </InspectorBlock>

      <InspectorBlock title={`${t.toolCalls} (${selectedAgent.toolCalls.length})`}>
        <div className="space-y-1">
          {selectedAgent.toolCalls.map((call) => (
            <div
              key={call}
              className="flex items-center justify-between rounded border border-white/10 bg-white/[0.03] px-2 py-1.5 font-mono text-xs text-slate-300"
            >
              {call}
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" aria-hidden />
            </div>
          ))}
        </div>
      </InspectorBlock>

      <InspectorBlock title={t.contextPack}>
        <div className="rounded border border-white/10 bg-white/[0.03] p-2 font-mono text-xs leading-6 text-slate-400">
          {selectedAgent.context.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </InspectorBlock>

      <InspectorBlock title={t.mcpSources}>
        <div className="grid gap-1">
          {selectedAgent.mcp.map((source) => (
            <div
              key={source}
              className="flex items-center justify-between rounded border border-white/10 bg-white/[0.03] px-2 py-1.5 text-xs text-slate-300"
            >
              {source}
              <span className="text-emerald-300">Connected</span>
            </div>
          ))}
        </div>
      </InspectorBlock>

      <InspectorBlock title={t.approval}>
        <div className="space-y-2">
          {[
            ["tests", t.approveTests],
            ["security", t.approveSecurity],
            ["docs", t.approveDocs],
            ["reviewer", t.approveReviewer]
          ].map(([key, label]) => (
            <label
              key={key}
              className="flex items-center gap-2 text-sm text-slate-300"
            >
              <input
                type="checkbox"
                className="h-4 w-4 accent-amber-300"
                checked={approvals[key as keyof typeof approvals]}
                onChange={() => onToggleApproval(key as keyof typeof approvals)}
              />
              {label}
            </label>
          ))}
        </div>
      </InspectorBlock>

      <InspectorBlock title={t.risks}>
        <div className="rounded border border-amber-300/35 bg-amber-400/10 p-2 text-sm leading-6 text-amber-100">
          <AlertTriangle className="mr-2 inline h-4 w-4" aria-hidden />
          {selectedAgent.risk}
        </div>
      </InspectorBlock>
    </aside>
  );
}

function InspectorBlock({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-4 border-t border-white/10 pt-3">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {title}
      </h3>
      {children}
    </section>
  );
}
