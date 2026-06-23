"use client";

import {
  Activity,
  AlertTriangle,
  Bot,
  Boxes,
  BrainCircuit,
  CheckCircle2,
  CircuitBoard,
  Cpu,
  Database,
  GitBranch,
  Layers3,
  Map,
  Play,
  Route,
  ShieldCheck,
  SlidersHorizontal,
  Thermometer,
  Zap
} from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import type { ShowcaseLocale } from "@/components/showcase/showcase-data";
import type {
  SemiconductorLayerId,
  SemiconductorNetId
} from "@/components/showcase/SemiconductorThreeScene";

const SemiconductorThreeScene = lazy(() =>
  import("@/components/showcase/SemiconductorThreeScene").then((module) => ({
    default: module.SemiconductorThreeScene
  }))
);

type SemiconductorDesignExplorerProps = {
  locale?: ShowcaseLocale;
};

type LayerOption = {
  id: SemiconductorLayerId;
  label: Record<ShowcaseLocale, string>;
  helper: Record<ShowcaseLocale, string>;
  icon: typeof Activity;
};

type NetFinding = {
  id: SemiconductorNetId;
  title: Record<ShowcaseLocale, string>;
  layer: string;
  type: string;
  slack: string;
  length: string;
  utilization: number;
  risk: number;
  criticality: Record<ShowcaseLocale, string>;
  reasons: Record<ShowcaseLocale, string[]>;
  actions: Record<ShowcaseLocale, string[]>;
};

const copy = {
  en: {
    lab: "AI Web Design Lab",
    title: "3D Semiconductor Design Explorer",
    project: "Project",
    designOk: "Design OK",
    layers: "LAYERS",
    inspector: "INSPECTOR",
    selection: "SELECTION",
    selectedNet: "Finding",
    selectedLayer: "Region",
    length: "Span",
    type: "Type",
    criticality: "Criticality",
    slack: "Delta",
    utilization: "Exposure",
    aiReview: "AI PACKAGE REVIEW",
    riskScore: "Risk Score",
    suggested: "Suggested Actions",
    mcpContext: "MCP PACKAGE CONTEXT",
    simulation: "PACKAGE / THERMAL CORNERS",
    frame: "Frame",
    pvt: "PVT",
    scenario: "Scenario",
    activity: "Activity",
    allChecks: "All checks passed",
    environment: "EDA Cloud",
    autosave: "Auto-save",
    buildBreakdown: "BUILD BREAKDOWN",
    defectsHidden: "Defects hidden",
    defectsVisible: "Defects visible",
    canvasFallback:
      "Advanced package fallback is active. Controls and inspector remain interactive.",
    architecture: "AI Package Architecture",
    architectureBody:
      "Copilot organized chiplet placement, HBM stacks, interposer routes, and package inspection context.",
    engine: "Photoreal Package Engine",
    engineBody:
      "React Three Fiber renders the mold compound, substrate, interposer, chiplets, HBM, micro-bumps, and BGA array.",
    reviewLoop: "Copilot Package Review",
    reviewBody:
      "Local state simulates thermal, warpage, and signal-integrity triage for selected package findings.",
    context: "MCP Package Context",
    contextBody:
      "Assembly rules, bump maps, substrate notes, historical issues, and team review notes are connected as context.",
    selectedPath: "Selected package path",
    inspectionMarkers: "Inspection markers"
  },
  ko: {
    lab: "AI Web Design Lab",
    title: "3D 반도체 설계 탐색기",
    project: "프로젝트",
    designOk: "설계 정상",
    layers: "레이어",
    inspector: "인스펙터",
    selection: "선택",
    selectedNet: "검토 항목",
    selectedLayer: "영역",
    length: "범위",
    type: "유형",
    criticality: "중요도",
    slack: "편차",
    utilization: "노출도",
    aiReview: "AI 패키지 리뷰",
    riskScore: "위험 점수",
    suggested: "제안 작업",
    mcpContext: "MCP 패키지 컨텍스트",
    simulation: "패키지 / 열 코너",
    frame: "프레임",
    pvt: "PVT",
    scenario: "시나리오",
    activity: "활동",
    allChecks: "모든 검사 통과",
    environment: "EDA 클라우드",
    autosave: "자동 저장",
    buildBreakdown: "빌드 구성",
    defectsHidden: "결함 숨김",
    defectsVisible: "결함 표시",
    canvasFallback:
      "고급 패키지 대체 보기가 활성화되었습니다. 컨트롤과 인스펙터는 계속 동작합니다.",
    architecture: "AI 패키지 아키텍처",
    architectureBody:
      "Copilot이 칩렛 배치, HBM 스택, 인터포저 경로, 패키지 검사 컨텍스트를 정리했습니다.",
    engine: "사실적 패키지 엔진",
    engineBody:
      "React Three Fiber가 몰드, 기판, 인터포저, 칩렛, HBM, 마이크로 범프, BGA 배열을 렌더링합니다.",
    reviewLoop: "Copilot 패키지 리뷰",
    reviewBody:
      "선택한 패키지 항목의 열, 휨, 신호 무결성 위험 분류와 수정 제안을 로컬 상태로 시뮬레이션합니다.",
    context: "MCP 패키지 컨텍스트",
    contextBody:
      "조립 규칙, 범프 맵, 기판 노트, 과거 이슈, 팀 리뷰 노트를 컨텍스트로 연결합니다.",
    selectedPath: "선택 패키지 경로",
    inspectionMarkers: "검사 마커"
  }
} satisfies Record<ShowcaseLocale, Record<string, string>>;

const layerOptions: LayerOption[] = [
  {
    id: "package",
    label: { en: "Package body", ko: "패키지 바디" },
    helper: { en: "Mold + lid", ko: "몰드 + 리드" },
    icon: Layers3
  },
  {
    id: "substrate",
    label: { en: "Organic substrate", ko: "유기 기판" },
    helper: { en: "Trace + vias", ko: "배선 + 비아" },
    icon: Map
  },
  {
    id: "interposer",
    label: { en: "Interposer / RDL", ko: "인터포저 / RDL" },
    helper: { en: "Silicon bridge", ko: "실리콘 브리지" },
    icon: Route
  },
  {
    id: "chiplets",
    label: { en: "Logic chiplet", ko: "로직 칩렛" },
    helper: { en: "Compute die", ko: "컴퓨트 다이" },
    icon: Cpu
  },
  {
    id: "hbm",
    label: { en: "HBM stacks", ko: "HBM 스택" },
    helper: { en: "3D memory", ko: "3D 메모리" },
    icon: Boxes
  },
  {
    id: "bumps",
    label: { en: "Bumps / BGA", ko: "범프 / BGA" },
    helper: { en: "Micro + solder", ko: "마이크로 + 솔더" },
    icon: CircuitBoard
  },
  {
    id: "thermal",
    label: { en: "Thermal", ko: "열 분포" },
    helper: { en: "Lid path", ko: "리드 경로" },
    icon: Thermometer
  },
  {
    id: "defects",
    label: { en: "Defects", ko: "결함" },
    helper: { en: "X-ray findings", ko: "X-ray 발견" },
    icon: AlertTriangle
  },
  {
    id: "cutaway",
    label: { en: "Cutaway", ko: "컷어웨이" },
    helper: { en: "Open package", ko: "내부 보기" },
    icon: Zap
  }
];

const defaultActiveLayers: SemiconductorLayerId[] = [
  "package",
  "substrate",
  "interposer",
  "chiplets",
  "hbm",
  "bumps",
  "thermal",
  "defects",
  "cutaway"
];

const findings: NetFinding[] = [
  {
    id: "PKG_THERMAL_01",
    title: {
      en: "Heat spreader contact risk near logic die",
      ko: "로직 다이 인근 히트스프레더 접촉 위험"
    },
    layer: "Lid / TIM",
    type: "Thermal",
    slack: "+11.8 C",
    length: "18.6 mm2",
    utilization: 83,
    risk: 78,
    criticality: { en: "High", ko: "높음" },
    reasons: {
      en: [
        "Thermal path crosses the central logic hot zone",
        "TIM bondline is thin near the lid cutout",
        "HBM exhaust heat overlaps the package center"
      ],
      ko: ["열 경로가 중앙 로직 핫존을 통과", "리드 컷아웃 인근 TIM bondline이 얇음", "HBM 배출 열이 패키지 중앙과 겹침"]
    },
    actions: {
      en: [
        "Increase lid pressure window by 4%",
        "Add local TIM keepout around the hot zone",
        "Re-run thermal soak at TT / 0.80V"
      ],
      ko: [
        "리드 압력 윈도우를 4% 확대",
        "핫존 주변 TIM keepout 추가",
        "TT / 0.80V 열 soak 재실행"
      ]
    }
  },
  {
    id: "HBM_SIGNAL_07",
    title: { en: "HBM escape routing congestion", ko: "HBM escape 배선 혼잡" },
    layer: "Interposer",
    type: "Signal",
    slack: "-0.9 dB",
    length: "7.4 mm",
    utilization: 91,
    risk: 84,
    criticality: { en: "Critical", ko: "치명" },
    reasons: {
      en: [
        "HBM channel shares a narrow interposer corridor",
        "Micro-bump pitch leaves limited escape room",
        "Reference shield density is below target"
      ],
      ko: ["HBM 채널이 좁은 인터포저 통로를 공유", "마이크로 범프 피치로 escape 공간 제한", "기준 차폐 밀도가 목표 미달"]
    },
    actions: {
      en: [
        "Promote escape segment to upper RDL",
        "Relax bump assignment near HBM-B",
        "Run signal integrity sweep at FF / 125C"
      ],
      ko: ["escape 구간을 상위 RDL로 승격", "HBM-B 인근 범프 할당 완화", "FF / 125C 신호 무결성 sweep 실행"]
    }
  },
  {
    id: "BGA_POWER_A3",
    title: { en: "BGA power island warpage watch", ko: "BGA 전원 아일랜드 휨 주의" },
    layer: "BGA",
    type: "Power",
    slack: "+31 um",
    length: "21 balls",
    utilization: 68,
    risk: 49,
    criticality: { en: "Medium", ko: "중간" },
    reasons: {
      en: [
        "Local solder ball group carries high current",
        "Substrate copper balance is asymmetric",
        "Similar package history matched warpage pattern"
      ],
      ko: ["국부 솔더볼 그룹에 높은 전류 집중", "기판 구리 밸런스가 비대칭", "유사 패키지 이력의 휨 패턴과 일치"]
    },
    actions: {
      en: [
        "Rebalance copper fill near A3 island",
        "Add redundant BGA balls to the power net",
        "Attach package warpage history note"
      ],
      ko: ["A3 아일랜드 주변 구리 fill 재균형", "전원 넷에 중복 BGA ball 추가", "패키지 휨 이력 노트 첨부"]
    }
  }
];

const pvtCorners = ["SS / -40C", "FF / 125C", "TT / 0.80V / 25C", "SF / 0C"];

export function SemiconductorDesignExplorer({
  locale = "en"
}: SemiconductorDesignExplorerProps) {
  const t = copy[locale];
  const [activeLayers, setActiveLayers] =
    useState<SemiconductorLayerId[]>(defaultActiveLayers);
  const [selectedNetId, setSelectedNetId] =
    useState<SemiconductorNetId>("PKG_THERMAL_01");
  const [frame, setFrame] = useState(245);
  const [pvtIndex, setPvtIndex] = useState(2);
  const canRenderCanvas = useHasWebGL();

  const selectedFinding =
    findings.find((finding) => finding.id === selectedNetId) ?? findings[0];
  const defectsEnabled = activeLayers.includes("defects");
  const activeLayerLabel = useMemo(
    () =>
      layerOptions
        .filter((layer) => activeLayers.includes(layer.id))
        .map((layer) => layer.label[locale])
        .join(" / "),
    [activeLayers, locale]
  );

  const toggleLayer = (layerId: SemiconductorLayerId) => {
    setActiveLayers((current) =>
      current.includes(layerId)
        ? current.filter((item) => item !== layerId)
        : [...current, layerId]
    );
  };

  return (
    <main className="min-h-screen bg-[#05080c] text-slate-100">
      <section className="border-b border-white/10 bg-[#071019]">
        <div className="mx-auto max-w-[1580px] px-3 py-3 sm:px-4">
          <header className="mb-3 flex flex-col gap-3 border-b border-white/10 pb-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded border border-white/15 bg-white/[0.04] text-sky-200">
                <Boxes className="h-4 w-4" aria-hidden />
              </div>
              <span className="text-sm font-semibold text-white">{t.lab}</span>
              <span className="text-slate-600">/</span>
              <h1 className="text-xl font-semibold leading-tight text-white sm:text-2xl">
                {t.title}
              </h1>
              <span className="rounded border border-sky-300/20 bg-sky-300/10 px-2 py-1 text-xs text-sky-200">
                v1.8.3
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="rounded border border-white/10 bg-white/[0.035] px-3 py-2">
                {t.project} <strong className="ml-1 text-white">Orion-7nm</strong>
              </span>
              <span className="inline-flex items-center gap-2 rounded border border-emerald-300/25 bg-emerald-400/10 px-3 py-2 text-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                {t.designOk}
              </span>
              <span className="rounded border border-white/10 bg-white/[0.035] px-3 py-2">
                {t.pvt} {pvtCorners[pvtIndex]}
              </span>
              <span className="rounded border border-white/10 bg-white/[0.035] px-3 py-2">
                {t.scenario} Nominal
              </span>
            </div>
          </header>

          <div className="grid gap-3 lg:grid-cols-[240px_minmax(0,1fr)_380px]">
            <LayerPanel
              locale={locale}
              activeLayers={activeLayers}
              onToggleLayer={toggleLayer}
            />

            <section className="min-w-0 overflow-hidden rounded border border-white/10 bg-[#08111a] shadow-2xl shadow-black/40">
              <SceneToolbar />
              <div className="relative min-h-[430px] overflow-hidden bg-[radial-gradient(circle_at_52%_42%,rgba(14,165,233,0.16),transparent_34%),linear-gradient(180deg,#071019,#050b12)] lg:min-h-[590px]">
                {canRenderCanvas ? (
                  <div className="absolute inset-0 hidden lg:block">
                    <Suspense fallback={<SceneFallback locale={locale} />}>
                      <SemiconductorThreeScene
                        activeLayers={activeLayers}
                        selectedNetId={selectedNetId}
                        frame={frame}
                      />
                    </Suspense>
                  </div>
                ) : (
                  <SceneFallback locale={locale} />
                )}
                {canRenderCanvas ? (
                  <div className="absolute inset-0 lg:hidden">
                    <SceneFallback locale={locale} />
                  </div>
                ) : null}
                <SceneOverlay
                  locale={locale}
                  activeLayerLabel={activeLayerLabel}
                  defectsEnabled={defectsEnabled}
                  selectedFinding={selectedFinding}
                  onSelectNet={setSelectedNetId}
                />
              </div>
              <SimulationControls
                locale={locale}
                frame={frame}
                pvtIndex={pvtIndex}
                onFrameChange={setFrame}
                onPvtChange={setPvtIndex}
              />
            </section>

            <InspectorPanel locale={locale} selectedFinding={selectedFinding} />
          </div>
        </div>
      </section>

      <BuildBreakdown locale={locale} />
      <footer className="border-t border-white/10 bg-[#060d13] px-4 py-2 text-xs text-slate-400">
        <div className="mx-auto flex max-w-[1580px] flex-wrap items-center justify-between gap-2">
          <span>
            {t.activity} <span className="ml-2 text-emerald-300">{t.allChecks}</span>
          </span>
          <span>
            {t.environment} <span className="ml-2 text-emerald-300">EDA Cloud</span>
          </span>
          <span>
            {t.autosave} <span className="ml-2 text-emerald-300">On</span>
          </span>
        </div>
      </footer>
    </main>
  );
}

function LayerPanel({
  locale,
  activeLayers,
  onToggleLayer
}: {
  locale: ShowcaseLocale;
  activeLayers: SemiconductorLayerId[];
  onToggleLayer: (layerId: SemiconductorLayerId) => void;
}) {
  const t = copy[locale];

  return (
    <aside className="rounded border border-white/10 bg-[#0a141d]/95">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-3 text-xs font-semibold uppercase text-slate-300">
        <span>{t.layers}</span>
        <SlidersHorizontal className="h-4 w-4 text-slate-500" aria-hidden />
      </div>
      <div className="divide-y divide-white/10">
        {layerOptions.map((layer) => {
          const Icon = layer.icon;
          const isActive = activeLayers.includes(layer.id);

          return (
            <label
              key={layer.id}
              className={`flex cursor-pointer items-center gap-3 px-3 py-3 transition ${
                isActive ? "bg-sky-400/8" : "bg-transparent"
              } hover:bg-sky-400/10`}
            >
              <Icon
                className={isActive ? "h-5 w-5 text-sky-300" : "h-5 w-5 text-slate-600"}
                aria-hidden
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-slate-100">
                  {layer.label[locale]}
                </span>
                <span className="block text-xs text-slate-500">
                  {layer.helper[locale]}
                </span>
              </span>
              <input
                type="checkbox"
                className="h-4 w-4 accent-blue-400"
                checked={isActive}
                onChange={() => onToggleLayer(layer.id)}
                aria-label={layer.label[locale]}
              />
            </label>
          );
        })}
      </div>
    </aside>
  );
}

function SceneToolbar() {
  return (
    <div className="flex items-center justify-between border-b border-white/10 bg-black/20 px-3 py-2">
      <div className="inline-flex overflow-hidden rounded border border-white/10">
        {[CircuitBoard, Route, GitBranch, Boxes].map((Icon, index) => (
          <button
            key={index}
            className="border-r border-white/10 p-2 text-slate-300 last:border-r-0 transition hover:bg-white/10 hover:text-white"
            aria-label={`Scene tool ${index + 1}`}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </button>
        ))}
      </div>
      <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
        <span className="h-px w-9 bg-slate-500" />
        <span>42 mm</span>
        <span>x0.9</span>
      </div>
    </div>
  );
}

function SceneFallback({ locale }: { locale: ShowcaseLocale }) {
  const t = copy[locale];

  return (
    <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(96,165,250,0.12)_1px,transparent_1px),linear-gradient(30deg,rgba(96,165,250,0.09)_1px,transparent_1px)] bg-[size:42px_42px] p-5">
      <div className="grid h-full grid-rows-[1fr_1fr_1fr] gap-6 opacity-90">
        {[0, 1, 2].map((layer) => (
          <div
            key={layer}
            className="mx-auto w-[82%] -skew-x-12 border border-sky-300/25 bg-sky-400/10 shadow-[0_18px_50px_rgba(14,165,233,0.12)]"
          />
        ))}
      </div>
      <p className="absolute right-4 top-4 max-w-xs rounded border border-amber-300/25 bg-amber-400/10 px-3 py-2 text-xs text-amber-100">
        {t.canvasFallback}
      </p>
    </div>
  );
}

function SceneOverlay({
  locale,
  activeLayerLabel,
  defectsEnabled,
  selectedFinding,
  onSelectNet
}: {
  locale: ShowcaseLocale;
  activeLayerLabel: string;
  defectsEnabled: boolean;
  selectedFinding: NetFinding;
  onSelectNet: (netId: SemiconductorNetId) => void;
}) {
  const t = copy[locale];

  return (
    <div className="pointer-events-none relative z-10 flex min-h-[430px] flex-col justify-between p-4 lg:min-h-[590px]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="rounded border border-white/10 bg-black/35 px-3 py-2 text-xs text-slate-300 backdrop-blur">
          <span className="text-slate-500">Visible:</span> {activeLayerLabel}
        </div>
        <div className="rounded border border-white/10 bg-black/35 px-3 py-2 text-xs text-slate-300 backdrop-blur">
          {defectsEnabled ? t.defectsVisible : t.defectsHidden}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <div className="pointer-events-auto flex flex-wrap gap-2">
          {findings.map((finding) => (
            <button
              key={finding.id}
              onClick={() => onSelectNet(finding.id)}
              className={`rounded border px-3 py-2 text-left text-xs transition ${
                selectedFinding.id === finding.id
                  ? "border-yellow-300/70 bg-yellow-300/15 text-yellow-100"
                  : "border-sky-300/30 bg-[#071522]/80 text-slate-200 hover:border-sky-200"
              }`}
              aria-label={`Select ${finding.id}`}
            >
              <span className="block font-semibold">{finding.id}</span>
              <span className="text-slate-400">{finding.layer}</span>
            </button>
          ))}
        </div>
        <div className="rounded border border-white/10 bg-black/45 p-3 text-xs text-slate-300 backdrop-blur">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-7 rounded bg-yellow-300" />
            {t.selectedPath}
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-400" />
            {t.inspectionMarkers}
          </div>
        </div>
      </div>
    </div>
  );
}

function SimulationControls({
  locale,
  frame,
  pvtIndex,
  onFrameChange,
  onPvtChange
}: {
  locale: ShowcaseLocale;
  frame: number;
  pvtIndex: number;
  onFrameChange: (frame: number) => void;
  onPvtChange: (index: number) => void;
}) {
  const t = copy[locale];

  return (
    <div className="border-t border-white/10 bg-[#071019] px-4 py-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-normal text-slate-200">
          {t.simulation}
        </h2>
        <span className="text-xs text-slate-300">
          {t.frame} {frame} / 600
        </span>
      </div>
      <div className="grid gap-3 lg:grid-cols-[auto_1fr] lg:items-center">
        <div className="flex flex-wrap gap-2">
          {pvtCorners.map((corner, index) => (
            <button
              key={corner}
              onClick={() => onPvtChange(index)}
              className={`rounded border px-3 py-2 text-xs transition ${
                pvtIndex === index
                  ? "border-sky-300/70 bg-sky-400/20 text-sky-100"
                  : "border-white/10 bg-white/[0.035] text-slate-300 hover:border-sky-300/40"
              }`}
            >
              {corner}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded border border-sky-300/40 bg-sky-400/15 p-2 text-sky-100">
            <Play className="h-4 w-4" aria-hidden />
            <span className="sr-only">Play simulation</span>
          </button>
          <input
            aria-label="Simulation frame"
            type="range"
            min={0}
            max={600}
            value={frame}
            onChange={(event) => onFrameChange(Number(event.target.value))}
            className="h-2 min-w-0 flex-1 accent-blue-400"
          />
          <span className="hidden min-w-32 text-right text-xs text-slate-300 sm:block">
            {pvtCorners[pvtIndex]}
          </span>
        </div>
      </div>
    </div>
  );
}

function InspectorPanel({
  locale,
  selectedFinding
}: {
  locale: ShowcaseLocale;
  selectedFinding: NetFinding;
}) {
  const t = copy[locale];

  return (
    <aside className="rounded border border-white/10 bg-[#0a141d]/95">
      <div className="border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase text-slate-200">
        {t.inspector}
      </div>
      <div className="space-y-4 p-4">
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase text-slate-300">
            {t.selection}
          </h2>
          <div className="rounded border border-white/10 bg-white/[0.035] p-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Metric label={t.selectedNet} value={selectedFinding.id} />
              <Metric label={t.selectedLayer} value={selectedFinding.layer} />
              <Metric label={t.length} value={selectedFinding.length} />
              <Metric label={t.type} value={selectedFinding.type} />
              <Metric
                label={t.criticality}
                value={selectedFinding.criticality[locale]}
                tone="text-red-300"
              />
              <Metric label={t.slack} value={selectedFinding.slack} tone="text-red-300" />
            </div>
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                <span>{t.utilization}</span>
                <span>{selectedFinding.utilization}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-sky-400"
                  style={{ width: `${selectedFinding.utilization}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase text-slate-300">
              {t.aiReview}
            </h2>
            <span className="inline-flex items-center gap-1 rounded border border-sky-300/30 bg-sky-400/10 px-2 py-1 text-xs text-sky-200">
              <Bot className="h-3.5 w-3.5" aria-hidden />
              Copilot
            </span>
          </div>
          <div className="rounded border border-white/10 bg-white/[0.035] p-3">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-full border-4 border-red-400/80 text-lg font-semibold text-white">
                {selectedFinding.risk}
              </div>
              <div>
                <p className="text-sm font-semibold text-red-200">{selectedFinding.title[locale]}</p>
                <p className="mt-1 text-xs text-slate-500">{t.riskScore}</p>
              </div>
            </div>
            <ul className="mt-3 space-y-1 text-xs text-slate-300">
              {selectedFinding.reasons[locale].map((reason) => (
                <li key={reason}>- {reason}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded border border-white/10 bg-white/[0.035]">
          <h2 className="border-b border-white/10 px-3 py-3 text-xs font-semibold text-slate-200">
            {t.suggested} ({selectedFinding.actions[locale].length})
          </h2>
          <div className="divide-y divide-white/10">
            {selectedFinding.actions[locale].map((action, index) => (
              <div key={action} className="flex items-center justify-between gap-3 px-3 py-3 text-xs">
                <span className="text-slate-200">{action}</span>
                <span className="text-emerald-300">+{32 - index * 9} ps</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded border border-white/10 bg-white/[0.035]">
          <h2 className="border-b border-white/10 px-3 py-3 text-xs font-semibold text-slate-200">
            {t.mcpContext}
          </h2>
          <div className="divide-y divide-white/10 text-xs">
            {[
              "Assembly Rules (CoWoS-class)",
              "Bump Map: Micro-bump / BGA",
              "Historical Issues (Similar Packages)",
              "Team Notes: Thermal Strategy"
            ].map((source, index) => (
              <div key={source} className="flex items-center justify-between gap-3 px-3 py-3">
                <span className="text-slate-200">{source}</span>
                <span className="inline-flex items-center gap-1 text-emerald-300">
                  {index === 0 ? "v2024.03" : index === 1 ? "v1.4" : index === 2 ? "12 refs" : "Today"}
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}

function Metric({
  label,
  value,
  tone = "text-white"
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div>
      <span className="block text-xs text-slate-500">{label}</span>
      <span className={`mt-1 block font-medium ${tone}`}>{value}</span>
    </div>
  );
}

function BuildBreakdown({ locale }: { locale: ShowcaseLocale }) {
  const t = copy[locale];
  const cards = [
    {
      icon: BrainCircuit,
      title: t.architecture,
      body: t.architectureBody,
      stats: ["1 interposer", "4 HBM", "21 BGA"]
    },
    {
      icon: Layers3,
      title: t.engine,
      body: t.engineBody,
      stats: ["9 layers", "312 bumps", "58 FPS"]
    },
    {
      icon: Cpu,
      title: t.reviewLoop,
      body: t.reviewBody,
      stats: ["4 findings", "3 simulated", "87% reviewed"]
    },
    {
      icon: Database,
      title: t.context,
      body: t.contextBody,
      stats: ["4 sources", "96 notes", "8.2K embeddings"]
    }
  ];

  return (
    <section className="bg-[#071017] px-3 py-3 sm:px-4">
      <div className="mx-auto max-w-[1580px]">
        <h2 className="mb-3 text-xs font-semibold uppercase text-slate-200">
          {t.buildBreakdown}
        </h2>
        <div className="grid gap-3 lg:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="rounded border border-white/10 bg-[#0a141d] p-4 shadow-xl shadow-black/20"
              >
                <div className="mb-3 flex items-start gap-3">
                  <Icon className="mt-1 h-8 w-8 text-sky-300" aria-hidden />
                  <div>
                    <h3 className="text-sm font-semibold uppercase text-white">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {card.body}
                    </p>
                  </div>
                  <ShieldCheck className="ml-auto h-5 w-5 text-emerald-300" aria-hidden />
                </div>
                <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-xs text-slate-300">
                  {card.stats.map((stat) => (
                    <span key={stat}>{stat}</span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function useHasWebGL() {
  const [hasWebGL, setHasWebGL] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    if (window.navigator.userAgent.toLowerCase().includes("jsdom")) {
      return;
    }

    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");

    setHasWebGL(Boolean(gl));
  }, []);

  return hasWebGL;
}
