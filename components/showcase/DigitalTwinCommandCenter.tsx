"use client";

import {
  Activity,
  AlertTriangle,
  Box,
  ChevronRight,
  Cpu,
  Database,
  Factory,
  Gauge,
  Layers3,
  LineChart,
  Maximize2,
  Pause,
  RadioTower,
  RotateCcw,
  ScanLine,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Thermometer,
  Wrench,
  Zap,
  ZoomIn
} from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import {
  defaultActiveLayers,
  equipmentTelemetry,
  layerOptions,
  mcpContextSources,
  timelineFrames
} from "@/components/showcase/showcase-data";
import type {
  Equipment,
  EquipmentStatus,
  LayerId,
  ShowcaseLocale
} from "@/components/showcase/showcase-data";

const DigitalTwinThreeScene = lazy(() =>
  import("@/components/showcase/DigitalTwinThreeScene").then((module) => ({
    default: module.DigitalTwinThreeScene
  }))
);

type DigitalTwinCommandCenterProps = {
  locale?: ShowcaseLocale;
};

const copy = {
  ko: {
    lab: "AI Web Design Lab",
    title: "3D Semiconductor Test Line Twin",
    subtitle: "OSAT Test Floor - Line T7",
    live: "Live",
    shadowMode: "Shadow Mode",
    layers: "LAYERS",
    collapse: "Collapse",
    layerOpacity: "Layer Opacity",
    time: "TIME",
    timePosition: "Time position",
    analysis: "AI COPILOT ANALYSIS",
    selected: "SELECTED EQUIPMENT",
    status: "Status",
    type: "Type",
    area: "Area",
    uptime: "Uptime",
    riskScore: "RISK SCORE",
    trend: "Trend",
    suggested: "AI SUGGESTED ACTION",
    recommended: "Recommended Action",
    workOrder: "Generate Work Order",
    logs: "RELATED LOGS",
    viewAll: "View All",
    sources: "MCP CONTEXT SOURCES",
    lastSync: "Last Sync: 14:32:10",
    manageMcp: "Manage MCP Connections",
    systemStatus: "SYSTEM STATUS",
    operational: "All Systems Operational",
    throughput: "THROUGHPUT",
    oee: "OEE",
    defectRate: "DEFECT RATE",
    activeAlarms: "ACTIVE ALARMS",
    reducedMotion: "Reduced motion",
    fallbackTitle: "Test line telemetry map",
    floor: "1F",
    builtTitle: "Built with AI. Shippable by Devs.",
    builtBody:
      "AI Web Design Lab demonstrates a dense semiconductor TEST floor: 10 repeated cells, 30 equipment instances, and three tool classes rebuilt from real equipment references.",
    breakdown: "Explore the Build Breakdown",
    canvasUnavailable:
      "WebGL view is unavailable in this runtime. The telemetry map remains fully interactive.",
    unitsPerHour: "tested devices / hr",
    high: "High",
    total: "Total"
  },
  en: {
    lab: "AI Web Design Lab",
    title: "3D Semiconductor Test Line Twin",
    subtitle: "OSAT Test Floor - Line T7",
    live: "Live",
    shadowMode: "Shadow Mode",
    layers: "LAYERS",
    collapse: "Collapse",
    layerOpacity: "Layer Opacity",
    time: "TIME",
    timePosition: "Time position",
    analysis: "AI COPILOT ANALYSIS",
    selected: "SELECTED EQUIPMENT",
    status: "Status",
    type: "Type",
    area: "Area",
    uptime: "Uptime",
    riskScore: "RISK SCORE",
    trend: "Trend",
    suggested: "AI SUGGESTED ACTION",
    recommended: "Recommended Action",
    workOrder: "Generate Work Order",
    logs: "RELATED LOGS",
    viewAll: "View All",
    sources: "MCP CONTEXT SOURCES",
    lastSync: "Last Sync: 14:32:10",
    manageMcp: "Manage MCP Connections",
    systemStatus: "SYSTEM STATUS",
    operational: "All Systems Operational",
    throughput: "THROUGHPUT",
    oee: "OEE",
    defectRate: "DEFECT RATE",
    activeAlarms: "ACTIVE ALARMS",
    reducedMotion: "Reduced motion",
    fallbackTitle: "Test line telemetry map",
    floor: "1F",
    builtTitle: "Built with AI. Shippable by Devs.",
    builtBody:
      "AI Web Design Lab demonstrates a dense semiconductor TEST floor: 10 repeated cells, 30 equipment instances, and three tool classes rebuilt from real equipment references.",
    breakdown: "Explore the Build Breakdown",
    canvasUnavailable:
      "WebGL view is unavailable in this runtime. The telemetry map remains fully interactive.",
    unitsPerHour: "tested devices / hr",
    high: "High",
    total: "Total"
  }
} satisfies Record<ShowcaseLocale, Record<string, string>>;

const layerIcons: Record<LayerId, typeof Activity> = {
  sensors: Activity,
  heatmap: Thermometer,
  throughput: LineChart,
  defects: AlertTriangle,
  maintenance: Wrench,
  facility: Box
};

const statusStyles: Record<
  EquipmentStatus,
  {
    dot: string;
    text: string;
    bg: string;
    border: string;
  }
> = {
  nominal: {
    dot: "bg-emerald-300",
    text: "text-emerald-200",
    bg: "bg-emerald-400/10",
    border: "border-emerald-300/30"
  },
  warning: {
    dot: "bg-amber-300",
    text: "text-amber-200",
    bg: "bg-amber-400/10",
    border: "border-amber-300/35"
  },
  alarm: {
    dot: "bg-red-300",
    text: "text-red-200",
    bg: "bg-red-400/10",
    border: "border-red-300/40"
  }
};

export function DigitalTwinCommandCenter({
  locale = "en"
}: DigitalTwinCommandCenterProps) {
  const t = copy[locale];
  const [activeLayers, setActiveLayers] =
    useState<LayerId[]>(defaultActiveLayers);
  const [selectedId, setSelectedId] = useState("HDL-07");
  const [timeIndex, setTimeIndex] = useState(4);
  const [reducedMotion, setReducedMotion] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const canRenderCanvas = useHasWebGL();

  const selectedEquipment =
    equipmentTelemetry.find((item) => item.id === selectedId) ??
    equipmentTelemetry[0];
  const frame = timelineFrames[timeIndex] ?? timelineFrames[0];
  const motionPaused = reducedMotion || prefersReducedMotion;

  const layerOpacity = useMemo(() => {
    const heatmapWeight = activeLayers.includes("heatmap") ? 20 : 0;
    return Math.min(95, 62 + activeLayers.length * 4 + heatmapWeight);
  }, [activeLayers]);

  const toggleLayer = (layerId: LayerId) => {
    setActiveLayers((current) =>
      current.includes(layerId)
        ? current.filter((item) => item !== layerId)
        : [...current, layerId]
    );
  };

  return (
    <main className="min-h-screen bg-[#05080c] text-slate-100">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_58%_18%,rgba(47,128,237,0.22),transparent_32%),linear-gradient(180deg,#05080c_0%,#091018_58%,#071017_100%)]">
        <div className="mx-auto flex w-full max-w-[1540px] flex-col gap-4 px-4 pb-7 pt-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm text-slate-400">{t.lab}</p>
              <h1 className="mt-1 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                {t.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                <span>{t.subtitle}</span>
                <span className="inline-flex items-center gap-2 rounded border border-emerald-300/30 bg-emerald-400/10 px-2.5 py-1 text-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  {t.live}
                </span>
                <span>UTC sync active</span>
                <span className="inline-flex items-center gap-1">
                  {t.shadowMode}
                  <ScanLine className="h-3.5 w-3.5 text-slate-500" aria-hidden />
                </span>
              </div>
            </div>

            <label className="inline-flex items-center gap-2 rounded border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
              <input
                type="checkbox"
                className="h-4 w-4 accent-sky-400"
                checked={reducedMotion}
                onChange={(event) => setReducedMotion(event.target.checked)}
                aria-label={t.reducedMotion}
              />
              {t.reducedMotion}
            </label>
          </div>

          <div className="grid gap-4 lg:grid-cols-[230px_minmax(0,1fr)_320px]">
            <LayerPanel
              locale={locale}
              activeLayers={activeLayers}
              layerOpacity={layerOpacity}
              onToggleLayer={toggleLayer}
            />

            <section className="order-1 min-w-0 overflow-hidden rounded border border-white/10 bg-[#08111a]/88 shadow-2xl shadow-black/35 lg:order-none">
              <SceneToolbar />
              <SceneFrame
                locale={locale}
                equipment={equipmentTelemetry}
                selectedId={selectedId}
                activeLayers={activeLayers}
                timeIndex={timeIndex}
                motionPaused={motionPaused}
                canRenderCanvas={canRenderCanvas}
                onSelect={setSelectedId}
              />
              <TimelineControl
                locale={locale}
                timeIndex={timeIndex}
                onTimeChange={setTimeIndex}
              />
              <KpiStrip locale={locale} frame={frame} />
            </section>

            <AnalysisPanel
              locale={locale}
              equipment={selectedEquipment}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#071017]">
        <div className="mx-auto grid max-w-[1540px] gap-8 px-4 py-9 sm:px-6 lg:grid-cols-[1.2fr_3fr] lg:px-8">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold text-white">{t.builtTitle}</h2>
            <p className="mt-4 leading-7 text-slate-300">{t.builtBody}</p>
            <a
              href="#build-breakdown"
              className="mt-6 inline-flex items-center gap-2 rounded border border-sky-300/35 px-4 py-2.5 text-sm font-medium text-sky-200 transition hover:border-sky-200 hover:bg-sky-300/10"
            >
              {t.breakdown}
              <ChevronRight className="h-4 w-4" aria-hidden />
            </a>
          </div>

          <div
            id="build-breakdown"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            <BuildBreakdownCard
              icon={Cpu}
              title="AI-Generated Architecture"
              body="From requirements to component-driven systems, the interface is structured as reusable React modules."
            />
            <BuildBreakdownCard
              icon={Factory}
              title="3D Test Line Engine"
              body="React Three Fiber powers 30 dense tool instances across wafer probers, ATE mainframes, and package test handlers."
            />
            <BuildBreakdownCard
              icon={Database}
              title="Data & AI Integration"
              body="Telemetry, alarms, and suggested actions are mocked as deterministic MCP-style context streams."
            />
            <BuildBreakdownCard
              icon={ShieldCheck}
              title="Production-Ready Code"
              body="Responsive fallbacks, reduced-motion behavior, and tests keep the showcase shippable."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function LayerPanel({
  locale,
  activeLayers,
  layerOpacity,
  onToggleLayer
}: {
  locale: ShowcaseLocale;
  activeLayers: LayerId[];
  layerOpacity: number;
  onToggleLayer: (layerId: LayerId) => void;
}) {
  const t = copy[locale];

  return (
    <aside className="order-2 rounded border border-white/10 bg-[#0a141d]/92 p-3 lg:order-none">
      <div className="mb-4 flex items-center justify-between px-1 text-xs text-slate-400">
        <span>{t.layers}</span>
        <button className="inline-flex items-center gap-1 text-slate-500 transition hover:text-slate-200">
          {t.collapse}
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>

      <div className="space-y-2">
        {layerOptions.map((layer) => {
          const Icon = layerIcons[layer.id];
          const isActive = activeLayers.includes(layer.id);

          return (
            <label
              key={layer.id}
              className="flex cursor-pointer items-center gap-3 rounded border border-white/10 bg-white/[0.03] px-3 py-3 transition hover:border-sky-300/40 hover:bg-sky-300/10"
            >
              <input
                type="checkbox"
                className="h-4 w-4 accent-blue-400"
                checked={isActive}
                onChange={() => onToggleLayer(layer.id)}
                aria-label={layer.label[locale]}
              />
              <Icon
                className={isActive ? "h-5 w-5 text-sky-300" : "h-5 w-5 text-slate-600"}
                aria-hidden
              />
              <span className="min-w-0">
                <span className="block text-sm text-slate-100">
                  {layer.label[locale]}
                </span>
                <span className="block text-xs text-slate-500">
                  {layer.helper[locale]}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      <div className="mt-5 px-1">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{t.layerOpacity}</span>
          <span>{layerOpacity}%</span>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-sky-400"
            style={{ width: `${layerOpacity}%` }}
          />
        </div>
      </div>
    </aside>
  );
}

function SceneToolbar() {
  return (
    <div className="flex items-center justify-end border-b border-white/10 bg-black/18 px-3 py-2">
      <div className="inline-flex overflow-hidden rounded border border-white/10">
        {[Gauge, Layers3, SlidersHorizontal, Maximize2, ZoomIn].map((Icon, index) => (
          <button
            key={index}
            className="border-r border-white/10 p-2 text-slate-300 last:border-r-0 transition hover:bg-white/10 hover:text-white"
            aria-label={`Scene tool ${index + 1}`}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </button>
        ))}
      </div>
    </div>
  );
}

function SceneFrame({
  locale,
  equipment,
  selectedId,
  activeLayers,
  timeIndex,
  motionPaused,
  canRenderCanvas,
  onSelect
}: {
  locale: ShowcaseLocale;
  equipment: Equipment[];
  selectedId: string;
  activeLayers: LayerId[];
  timeIndex: number;
  motionPaused: boolean;
  canRenderCanvas: boolean;
  onSelect: (equipmentId: string) => void;
}) {
  const t = copy[locale];
  const hasHeatmap = activeLayers.includes("heatmap");
  const hasSensors = activeLayers.includes("sensors");
  const hasDefects = activeLayers.includes("defects");
  const labeledEquipment = equipment.filter(
    (item) => item.id === selectedId || item.status !== "nominal"
  );
  const equipmentTypeCount = new Set(equipment.map((item) => item.type.en)).size;
  const testCellCount = Math.round(equipment.length / equipmentTypeCount);

  return (
    <div className="relative min-h-[520px] overflow-hidden bg-[#08121b]">
      <div className="absolute inset-0 hidden lg:block">
        {canRenderCanvas ? (
          <Suspense fallback={<SceneFallbackGrid />}>
            <DigitalTwinThreeScene
              equipment={equipment}
              activeLayers={activeLayers}
              selectedId={selectedId}
              reducedMotion={motionPaused}
              timeIndex={timeIndex}
              onSelect={onSelect}
            />
          </Suspense>
        ) : (
          <SceneFallbackGrid />
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(120deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(30deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px] opacity-70 lg:block" />

      {hasHeatmap ? (
        <div className="pointer-events-none absolute left-[48%] top-[37%] hidden h-[34%] w-[42%] -rotate-12 rounded-full bg-[linear-gradient(90deg,rgba(26,209,150,0.16),rgba(237,220,48,0.42),rgba(255,62,62,0.5),rgba(64,179,255,0.12))] blur-sm lg:block" />
      ) : null}

      <div
        data-testid="mobile-fallback-panel"
        className="relative z-10 grid min-h-[520px] gap-3 p-4 lg:hidden"
      >
        <div className="rounded border border-white/10 bg-[#0b1620]/95 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">{t.fallbackTitle}</h2>
            <span className="rounded bg-blue-500/20 px-2 py-1 text-xs text-blue-200">
              {t.floor}
            </span>
          </div>
          <div className="mt-4 grid gap-3">
            {equipment.map((item) => (
              <button
                key={item.id}
                className={`flex items-center justify-between rounded border px-3 py-3 text-left transition ${
                  item.id === selectedId
                    ? "border-sky-300/70 bg-sky-300/15"
                    : "border-white/10 bg-white/[0.03]"
                }`}
                onClick={() => onSelect(item.id)}
                aria-label={`Select ${item.id}`}
              >
                <span>
                  <span className="block font-medium text-white">
                    {item.label}
                  </span>
                  <span className="text-xs text-slate-400">
                    {item.type[locale]} / {item.temperatureC.toFixed(1)} C / {item.statusText[locale]}
                  </span>
                </span>
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    statusStyles[item.status].dot
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
        <div className="absolute left-5 top-5 rounded border border-white/10 bg-black/35 px-3 py-2 text-xs text-slate-200 backdrop-blur">
          {equipment.length} tools / {testCellCount} test cells / {equipmentTypeCount} equipment classes
        </div>

        {labeledEquipment.map((item) => (
          <button
            key={item.id}
            className={`pointer-events-auto absolute min-w-[92px] rounded border px-2.5 py-2 text-left shadow-xl transition ${
              selectedId === item.id
                ? "border-sky-300 bg-[#102437]/95 text-white"
                : "border-sky-300/40 bg-[#0b1b28]/88 text-slate-200 hover:border-sky-200"
            } ${motionPaused ? "" : "motion-safe:hover:-translate-y-0.5"}`}
            style={{ left: item.hotspot.left, top: item.hotspot.top }}
            onClick={() => onSelect(item.id)}
            aria-label={`Open map hotspot ${item.id}`}
          >
            <span className="block text-xs font-semibold">{item.label}</span>
            <span className={statusStyles[item.status].text}>
              {item.status === "alarm"
                ? `${item.temperatureC.toFixed(1)} C`
                : item.statusText[locale]}
            </span>
          </button>
        ))}

        {hasSensors
          ? equipment.map((item) => (
              <span
                key={`${item.id}-sensor`}
                className={`absolute h-2 w-2 rounded-full border border-sky-200 bg-sky-300 shadow-[0_0_14px_rgba(56,189,248,0.85)] ${
                  motionPaused ? "" : "motion-safe:animate-pulse"
                }`}
                style={{
                  left: `calc(${item.hotspot.left} + 46px)`,
                  top: `calc(${item.hotspot.top} + 44px)`
                }}
              />
            ))
          : null}

        {hasDefects ? (
          <div className="absolute bottom-8 right-8 rounded border border-red-300/35 bg-red-500/10 px-3 py-2 text-sm text-red-100">
            Retest bin cluster +17%
          </div>
        ) : null}

        <div className="absolute bottom-5 left-5 flex overflow-hidden rounded border border-white/10 bg-black/35 text-xs text-slate-300 backdrop-blur">
          {["Orbit", "Pan", "Zoom", "Reset View", "Focus", "Deselect"].map(
            (item) => (
              <span key={item} className="border-r border-white/10 px-3 py-2 last:border-r-0">
                {item}
              </span>
            )
          )}
        </div>

        {!canRenderCanvas ? (
          <div className="absolute right-5 top-5 max-w-sm rounded border border-amber-300/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-100">
            {t.canvasUnavailable}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SceneFallbackGrid() {
  return (
    <div className="h-full w-full bg-[linear-gradient(115deg,rgba(20,34,44,0.9),rgba(7,16,24,0.96)),linear-gradient(120deg,rgba(81,106,122,0.18)_1px,transparent_1px),linear-gradient(30deg,rgba(81,106,122,0.14)_1px,transparent_1px)] bg-[size:auto,52px_52px,52px_52px]">
      <div className="grid h-full grid-cols-5 grid-rows-4 gap-5 p-10 opacity-85">
        {Array.from({ length: 15 }).map((_, index) => (
          <span
            key={index}
            className="rounded border border-slate-500/30 bg-slate-400/10 shadow-lg shadow-black/30"
          />
        ))}
      </div>
    </div>
  );
}

function TimelineControl({
  locale,
  timeIndex,
  onTimeChange
}: {
  locale: ShowcaseLocale;
  timeIndex: number;
  onTimeChange: (index: number) => void;
}) {
  const t = copy[locale];

  return (
    <div className="border-t border-white/10 bg-[#08121b] px-4 py-3">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="min-w-10">{t.time}</span>
          <button className="inline-flex items-center gap-2 rounded border border-emerald-300/30 bg-emerald-400/10 px-3 py-2 text-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            {t.live}
          </button>
          <Pause className="h-4 w-4 text-slate-400" aria-hidden />
        </div>

        <div className="min-w-0 flex-1">
          <input
            aria-label={t.timePosition}
            type="range"
            min={0}
            max={timelineFrames.length - 1}
            step={1}
            value={timeIndex}
            onChange={(event) => onTimeChange(Number(event.target.value))}
            className="h-1.5 w-full accent-blue-400"
          />
          <div className="mt-2 grid grid-cols-6 text-xs text-slate-500">
            {timelineFrames.map((frame) => (
              <span key={frame.time}>{frame.time}</span>
            ))}
          </div>
        </div>

        <div className="flex rounded border border-white/10 text-xs">
          {["1H", "6H", "12H", "24H"].map((item, index) => (
            <button
              key={item}
              className={`px-3 py-2 ${
                index === 0
                  ? "bg-blue-500 text-white"
                  : "text-slate-400 transition hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiStrip({
  locale,
  frame
}: {
  locale: ShowcaseLocale;
  frame: (typeof timelineFrames)[number];
}) {
  const t = copy[locale];

  return (
    <div className="grid gap-px border-t border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCell
        label={t.systemStatus}
        value={t.operational}
        icon={<ShieldCheck className="h-4 w-4 text-emerald-300" aria-hidden />}
        tone="text-emerald-200"
      />
      <KpiCell
        label={t.throughput}
        value={frame.throughput.toLocaleString()}
        suffix={t.unitsPerHour}
        spark="up"
      />
      <KpiCell label={t.oee} value={`${frame.oee.toFixed(1)}%`} spark="up" />
      <KpiCell
        label={t.defectRate}
        value={`${frame.defectRate.toFixed(2)}%`}
        spark="risk"
      />
    </div>
  );
}

function KpiCell({
  label,
  value,
  suffix,
  icon,
  spark,
  tone = "text-white"
}: {
  label: string;
  value: string;
  suffix?: string;
  icon?: React.ReactNode;
  spark?: "up" | "risk";
  tone?: string;
}) {
  return (
    <div className="flex min-h-16 items-center justify-between bg-[#0b1620] px-4 py-3">
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className={`mt-1 text-xl font-semibold ${tone}`}>
          {value}
          {suffix ? (
            <span className="ml-2 text-xs font-normal text-slate-500">{suffix}</span>
          ) : null}
        </p>
      </div>
      {icon ?? <Sparkline tone={spark ?? "up"} />}
    </div>
  );
}

function Sparkline({ tone }: { tone: "up" | "risk" }) {
  const color = tone === "risk" ? "#ff6b6b" : "#52d992";

  return (
    <svg width="74" height="28" viewBox="0 0 74 28" aria-hidden>
      <path
        d={
          tone === "risk"
            ? "M2 22 L10 21 L16 19 L23 20 L30 15 L37 17 L44 10 L51 14 L58 7 L64 11 L72 8"
            : "M2 23 L10 20 L16 21 L23 16 L30 18 L37 13 L44 12 L51 9 L58 11 L64 7 L72 6"
        }
        fill="none"
        stroke={color}
        strokeWidth="1.8"
      />
    </svg>
  );
}

function AnalysisPanel({
  locale,
  equipment
}: {
  locale: ShowcaseLocale;
  equipment: Equipment;
}) {
  const t = copy[locale];
  const style = statusStyles[equipment.status];

  return (
    <aside className="order-3 rounded border border-white/10 bg-[#0a141d]/92 p-3 lg:order-none">
      <div className="flex items-center justify-between border-b border-white/10 px-1 pb-3">
        <h2 className="text-xs font-semibold text-slate-300">{t.analysis}</h2>
        <Settings2 className="h-4 w-4 text-slate-500" aria-hidden />
      </div>

      <div className="mt-4 rounded border border-white/10 bg-white/[0.03] p-3">
        <p className="text-xs text-slate-500">{t.selected}</p>
        <div className="mt-3 flex gap-3">
          <div className="flex h-20 w-20 items-center justify-center rounded border border-white/10 bg-[#172331]">
            <Factory className="h-10 w-10 text-slate-300" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-white">{equipment.label}</h3>
              <span
                className={`rounded px-2 py-1 text-xs ${style.bg} ${style.text}`}
              >
                {equipment.riskScore > 70 ? "High Risk" : equipment.statusText[locale]}
              </span>
            </div>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
              <dt className="text-slate-500">{t.type}</dt>
              <dd className="text-slate-300">{equipment.type[locale]}</dd>
              <dt className="text-slate-500">{t.area}</dt>
              <dd className="text-slate-300">{equipment.area[locale]}</dd>
              <dt className="text-slate-500">{t.status}</dt>
              <dd className={style.text}>{equipment.statusText[locale]}</dd>
              <dt className="text-slate-500">{t.uptime}</dt>
              <dd className="text-slate-300">{equipment.uptime}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded border border-white/10 bg-white/[0.03] p-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-500">{t.riskScore}</p>
            <p className="mt-1 text-3xl font-semibold text-red-300">
              {equipment.riskScore}
              <span className="text-sm font-normal text-slate-500"> / 100</span>
            </p>
          </div>
          <div className="text-right text-xs">
            <p className="text-slate-500">{t.trend}</p>
            <p
              className={
                equipment.trend >= 0 ? "text-emerald-300" : "text-sky-300"
              }
            >
              {equipment.trend >= 0 ? "+" : ""}
              {equipment.trend} vs 1h ago
            </p>
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-red-400"
            style={{ width: `${equipment.riskScore}%` }}
          />
        </div>
      </div>

      <div className="mt-3 rounded border border-white/10 bg-white/[0.03] p-3">
        <p className="text-xs text-slate-500">{t.suggested}</p>
        <div className="mt-3 flex gap-2 text-sm text-slate-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden />
          <div>
            <p>{equipment.analysis.title[locale]}</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              {equipment.analysis.summary[locale]}
            </p>
            <p className="mt-3 text-xs text-slate-500">{t.recommended}</p>
            <ol className="mt-1 space-y-1 text-xs leading-5 text-slate-300">
              {equipment.analysis.recommendedActions.map((action, index) => (
                <li key={action[locale]}>
                  {index + 1}. {action[locale]}
                </li>
              ))}
            </ol>
          </div>
        </div>
        <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded bg-blue-500 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-blue-400">
          {t.workOrder}
          <Zap className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="mt-3 rounded border border-white/10 bg-white/[0.03] p-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">{t.logs}</p>
          <button className="text-xs text-sky-300">{t.viewAll}</button>
        </div>
        <div className="mt-3 space-y-2">
          {equipment.logs.map((log) => (
            <div key={`${log.time}-${log.text.en}`} className="flex items-center gap-2 text-xs">
              <span className={`h-2 w-2 rounded-full ${statusStyles[log.severity].dot}`} />
              <span className="text-slate-500">{log.time}</span>
              <span className="text-slate-300">{log.text[locale]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded border border-white/10 bg-white/[0.03] p-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">{t.sources}</p>
          <p className="text-xs text-slate-500">{t.lastSync}</p>
        </div>
        <div className="mt-3 space-y-2">
          {mcpContextSources.map((source) => (
            <div key={source} className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-2 text-slate-300">
                <RadioTower className="h-3.5 w-3.5 text-slate-500" aria-hidden />
                {source}
              </span>
              <span className="text-emerald-300">Live</span>
            </div>
          ))}
        </div>
        <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:border-sky-300/40 hover:text-white">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          {t.manageMcp}
        </button>
      </div>

      <button className="mt-3 rounded border border-white/10 px-3 py-2 text-xs text-slate-400">
        View current alarms
      </button>
    </aside>
  );
}

function BuildBreakdownCard({
  icon: Icon,
  title,
  body
}: {
  icon: typeof Cpu;
  title: string;
  body: string;
}) {
  return (
    <article className="border-l border-white/10 pl-6">
      <Icon className="h-7 w-7 text-slate-200" aria-hidden />
      <h3 className="mt-5 font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>
      <a
        href="#build-breakdown"
        className="mt-5 inline-flex items-center gap-2 text-sm text-sky-300"
      >
        View details
        <ChevronRight className="h-4 w-4" aria-hidden />
      </a>
    </article>
  );
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(query.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    query.addEventListener("change", handleChange);

    return () => query.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

function useHasWebGL() {
  const [hasWebGL, setHasWebGL] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    if (window.navigator.userAgent.toLowerCase().includes("jsdom")) {
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      const context =
        canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");
      setHasWebGL(Boolean(context));
    } catch {
      setHasWebGL(false);
    }
  }, []);

  return hasWebGL;
}
