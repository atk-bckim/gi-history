export type ShowcaseLocale = "ko" | "en";

export type LocalizedText = Record<ShowcaseLocale, string>;

export type LayerId =
  | "sensors"
  | "heatmap"
  | "throughput"
  | "defects"
  | "maintenance"
  | "facility";

export type EquipmentStatus = "nominal" | "warning" | "alarm";

export type Equipment = {
  id: string;
  label: string;
  type: LocalizedText;
  area: LocalizedText;
  status: EquipmentStatus;
  statusText: LocalizedText;
  uptime: string;
  temperatureC: number;
  throughput: number;
  riskScore: number;
  trend: number;
  hotspot: {
    left: string;
    top: string;
  };
  position3d: [number, number, number];
  analysis: {
    title: LocalizedText;
    summary: LocalizedText;
    recommendedActions: LocalizedText[];
  };
  logs: {
    time: string;
    severity: EquipmentStatus;
    text: LocalizedText;
  }[];
};

export const layerOptions: {
  id: LayerId;
  label: LocalizedText;
  helper: LocalizedText;
}[] = [
  {
    id: "sensors",
    label: { ko: "센서", en: "Sensors" },
    helper: { ko: "5,760 활성", en: "5,760 active" }
  },
  {
    id: "heatmap",
    label: { ko: "히트맵", en: "Heatmap" },
    helper: { ko: "온도", en: "Temperature" }
  },
  {
    id: "throughput",
    label: { ko: "처리량", en: "Throughput" },
    helper: { ko: "시간당 단위", en: "Units / hr" }
  },
  {
    id: "defects",
    label: { ko: "결함", en: "Defects" },
    helper: { ko: "오버레이", en: "Overlay" }
  },
  {
    id: "maintenance",
    label: { ko: "정비", en: "Maintenance" },
    helper: { ko: "예측", en: "Predictive" }
  },
  {
    id: "facility",
    label: { ko: "설비", en: "Facility" },
    helper: { ko: "3D 모델", en: "3D Model" }
  }
];

export const defaultActiveLayers: LayerId[] = [
  "sensors",
  "heatmap",
  "throughput",
  "defects",
  "maintenance"
];

export const timelineFrames = [
  {
    time: "12:00",
    throughput: 37200,
    oee: 91.2,
    defectRate: 0.54,
    activeAlarms: 1,
    temperatureDrift: 0.4
  },
  {
    time: "12:30",
    throughput: 38480,
    oee: 91.6,
    defectRate: 0.61,
    activeAlarms: 1,
    temperatureDrift: 0.7
  },
  {
    time: "13:00",
    throughput: 39720,
    oee: 92.1,
    defectRate: 0.58,
    activeAlarms: 2,
    temperatureDrift: 1.2
  },
  {
    time: "13:30",
    throughput: 40560,
    oee: 92.4,
    defectRate: 0.73,
    activeAlarms: 2,
    temperatureDrift: 1.8
  },
  {
    time: "14:30",
    throughput: 39280,
    oee: 91.8,
    defectRate: 0.91,
    activeAlarms: 3,
    temperatureDrift: 2.4
  },
  {
    time: "15:00",
    throughput: 38940,
    oee: 90.2,
    defectRate: 0.86,
    activeAlarms: 3,
    temperatureDrift: 2.1
  }
];

type TestEquipmentKind = "prober" | "ate" | "handler";

const testCellSlots = [
  { x: -7.2, z: -3.3, bay: 0, column: 0 },
  { x: -3.6, z: -3.3, bay: 0, column: 1 },
  { x: 0, z: -3.3, bay: 0, column: 2 },
  { x: 3.6, z: -3.3, bay: 0, column: 3 },
  { x: 7.2, z: -3.3, bay: 0, column: 4 },
  { x: -7.2, z: 3.3, bay: 1, column: 0 },
  { x: -3.6, z: 3.3, bay: 1, column: 1 },
  { x: 0, z: 3.3, bay: 1, column: 2 },
  { x: 3.6, z: 3.3, bay: 1, column: 3 },
  { x: 7.2, z: 3.3, bay: 1, column: 4 }
];

const testEquipmentRows: Record<
  TestEquipmentKind,
  {
    prefix: string;
    zOffset: number;
    type: LocalizedText;
    area: LocalizedText;
    baseTemperature: number;
    baseThroughput: number;
  }
> = {
  prober: {
    prefix: "PB",
    zOffset: -1,
    type: { ko: "웨이퍼 프로버", en: "Wafer prober" },
    area: { ko: "웨이퍼 소트", en: "Wafer Sort" },
    baseTemperature: 40.2,
    baseThroughput: 1220
  },
  ate: {
    prefix: "ATE",
    zOffset: 0,
    type: { ko: "SoC ATE 메인프레임", en: "SoC ATE mainframe" },
    area: { ko: "ATE 테스트", en: "ATE Test" },
    baseTemperature: 36.4,
    baseThroughput: 1380
  },
  handler: {
    prefix: "HDL",
    zOffset: 1,
    type: { ko: "패키지 테스트 핸들러", en: "Package test handler" },
    area: { ko: "파이널 테스트", en: "Final Test" },
    baseTemperature: 56.2,
    baseThroughput: 1450
  }
};

function padCell(cellIndex: number) {
  return String(cellIndex + 1).padStart(2, "0");
}

function statusForCell(kind: TestEquipmentKind, cellIndex: number): EquipmentStatus {
  if (kind === "handler" && cellIndex === 6) {
    return "alarm";
  }

  if (kind === "prober" && [1, 7].includes(cellIndex)) {
    return "warning";
  }

  if (kind === "ate" && [3, 8].includes(cellIndex)) {
    return "warning";
  }

  if (kind === "handler" && [2, 9].includes(cellIndex)) {
    return "warning";
  }

  return "nominal";
}

function statusText(status: EquipmentStatus): LocalizedText {
  return {
    ko: status === "alarm" ? "알람" : status === "warning" ? "주의" : "정상",
    en: status === "alarm" ? "Alarm" : status === "warning" ? "Watch" : "Normal"
  };
}

function riskScoreForStatus(status: EquipmentStatus, cellIndex: number) {
  if (status === "alarm") {
    return 86;
  }

  if (status === "warning") {
    return 48 + ((cellIndex * 7) % 13);
  }

  return 18 + ((cellIndex * 5) % 16);
}

function analysisForEquipment(
  kind: TestEquipmentKind,
  status: EquipmentStatus,
  label: string
): Equipment["analysis"] {
  if (kind === "prober") {
    return {
      title: {
        ko:
          status === "nominal"
            ? `${label} 프로브 접촉 안정`
            : `${label} 프로브 카드 접촉 편차 감지`,
        en:
          status === "nominal"
            ? `${label} probe contact stable`
            : `${label} probe-card contact drift detected`
      },
      summary: {
        ko:
          status === "nominal"
            ? "웨이퍼맵 BIN1, touchdown force, Auto Z 보정이 관리 범위입니다."
            : "에지 다이 재접촉률과 probe mark 편차가 같은 웨이퍼 존에서 증가합니다.",
        en:
          status === "nominal"
            ? "Wafer map BIN1, touchdown force, and Auto Z calibration are inside control range."
            : "Edge-die retouch rate and probe-mark variance are rising in the same wafer zone."
      },
      recommendedActions: [
        {
          ko: "웨이퍼맵과 프로브 마크 이미지를 같은 로트 기준으로 비교합니다.",
          en: "Compare wafer maps and probe-mark images for the same lot."
        },
        {
          ko: "다음 FOUP 투입 전 Auto Z 보정과 카드 클리닝 필요 여부를 확인합니다.",
          en: "Check whether Auto Z calibration or card cleaning is needed before the next FOUP."
        }
      ]
    };
  }

  if (kind === "ate") {
    return {
      title: {
        ko:
          status === "nominal"
            ? `${label} 멀티사이트 효율 안정`
            : `${label} 사이트 효율 편차 감지`,
        en:
          status === "nominal"
            ? `${label} multisite efficiency stable`
            : `${label} site efficiency drift detected`
      },
      summary: {
        ko:
          status === "nominal"
            ? "핀 전원, RF, HSIO 계측 모듈과 DUT 보드 온도가 안정권입니다."
            : "특정 사이트의 pattern retry와 계측 대기 시간이 동시에 증가했습니다.",
        en:
          status === "nominal"
            ? "Pin power, RF, HSIO instruments, and DUT-board temperature are stable."
            : "Pattern retry and instrument wait time are rising on a specific test site."
      },
      recommendedActions: [
        {
          ko: "사이트별 STDF bin, pattern retry, 계측 대기 시간을 비교합니다.",
          en: "Compare STDF bins, pattern retry, and instrument wait time by test site."
        },
        {
          ko: "정상 셀의 패턴을 yield-learning 기준선으로 보존합니다.",
          en: "Preserve healthy-cell patterns as the yield-learning baseline."
        }
      ]
    };
  }

  return {
    title: {
      ko:
        status === "alarm"
          ? `${label} 컨택터 재테스트 클러스터`
          : status === "warning"
            ? `${label} 트레이 핸들링 편차 감지`
            : `${label} 핸들러 이송 안정`,
      en:
        status === "alarm"
          ? `${label} contactor retest cluster`
          : status === "warning"
            ? `${label} tray-handling variance detected`
            : `${label} handler transfer stable`
    },
    summary: {
      ko:
        status === "alarm"
          ? "BGA 패키지 투입 트레이에서 socket A3 접촉 불량과 bin5 증가가 동시에 발생합니다."
          : status === "warning"
            ? "픽업 vacuum 편차와 hot corner retest가 같은 tray window에서 증가합니다."
            : "컨택터 온도, 픽업 vacuum, 양품 tray 분류가 정상 범위입니다.",
      en:
        status === "alarm"
          ? "Socket A3 contact misses and bin5 escapes are rising on incoming BGA trays."
          : status === "warning"
            ? "Pickup-vacuum variance and hot-corner retest are rising in the same tray window."
            : "Contactor temperature, pickup vacuum, and good-tray sorting are inside range."
    },
    recommendedActions: [
      {
        ko: "컨택터 세척 주기와 socket resistance를 셀 단위로 재확인합니다.",
        en: "Recheck contactor cleaning interval and socket resistance by cell."
      },
      {
        ko: "핫/콜드 온도 코너별 retest bin map을 분리해 확인합니다.",
        en: "Split retest bin maps by hot and cold temperature corners."
      }
    ]
  };
}

function logsForEquipment(
  kind: TestEquipmentKind,
  status: EquipmentStatus
): Equipment["logs"] {
  if (kind === "prober") {
    return [
      {
        time: "14:25",
        severity: status,
        text: {
          ko: status === "nominal" ? "웨이퍼맵 BIN1 정상" : "에지 다이 재접촉률 상승",
          en: status === "nominal" ? "Wafer map BIN1 in range" : "Edge-die retouch rate rising"
        }
      },
      {
        time: "14:08",
        severity: "nominal",
        text: { ko: "Auto Z 보정 완료", en: "Auto Z calibration complete" }
      }
    ];
  }

  if (kind === "ate") {
    return [
      {
        time: "14:18",
        severity: status,
        text: {
          ko: status === "nominal" ? "핀 스케일 계측 안정" : "site 6 retry 증가",
          en: status === "nominal" ? "Pin-scale instruments stable" : "Site 6 retry rising"
        }
      },
      {
        time: "14:03",
        severity: "nominal",
        text: { ko: "DUT 보드 온도 정상", en: "DUT board temperature in range" }
      }
    ];
  }

  return [
    {
      time: "14:31",
      severity: status,
      text: {
        ko:
          status === "alarm"
            ? "socket A3 접촉 저항 고경보"
            : status === "warning"
              ? "hot corner retest +11%"
              : "양품 tray 분류 정상",
        en:
          status === "alarm"
            ? "Socket A3 contact resistance high"
            : status === "warning"
              ? "Hot-corner retest +11%"
              : "Good-tray sorting normal"
      }
    },
    {
      time: "14:10",
      severity: status === "nominal" ? "nominal" : "warning",
      text: { ko: "트레이 픽업 vacuum 추적", en: "Tray pickup vacuum tracked" }
    }
  ];
}

function buildTestEquipment(
  kind: TestEquipmentKind,
  cellIndex: number,
  slot: (typeof testCellSlots)[number]
): Equipment {
  const row = testEquipmentRows[kind];
  const status = statusForCell(kind, cellIndex);
  const cellNumber = padCell(cellIndex);
  const label = `${row.prefix}-${cellNumber}`;
  const riskScore = riskScoreForStatus(status, cellIndex);
  const trend = status === "alarm" ? 14 : status === "warning" ? 5 + (cellIndex % 5) : -4 + (cellIndex % 3);
  const hotspotLeft = `${12 + slot.column * 17.6}%`;
  const hotspotTopBase = slot.bay === 0 ? 26 : 57;
  const hotspotTopOffset = kind === "prober" ? -5 : kind === "ate" ? 4 : 13;

  return {
    id: label,
    label,
    type: row.type,
    area: row.area,
    status,
    statusText: statusText(status),
    uptime: `${String(3 + ((cellIndex * 3) % 19)).padStart(2, "0")}d ${String(
      2 + ((cellIndex * 5) % 20)
    ).padStart(2, "0")}h ${String(8 + ((cellIndex * 7) % 48)).padStart(2, "0")}m`,
    temperatureC:
      row.baseTemperature +
      cellIndex * 0.35 +
      (status === "alarm" ? 16.2 : status === "warning" ? 4.3 : 0),
    throughput: row.baseThroughput + cellIndex * 38 - (status === "alarm" ? 210 : 0),
    riskScore,
    trend,
    hotspot: {
      left: hotspotLeft,
      top: `${hotspotTopBase + hotspotTopOffset}%`
    },
    position3d: [slot.x, 0.42, slot.z + row.zOffset],
    analysis: analysisForEquipment(kind, status, label),
    logs: logsForEquipment(kind, status)
  };
}

export const equipmentTelemetry: Equipment[] = testCellSlots.flatMap((slot, cellIndex) => [
  buildTestEquipment("prober", cellIndex, slot),
  buildTestEquipment("ate", cellIndex, slot),
  buildTestEquipment("handler", cellIndex, slot)
]);

export const mcpContextSources = [
  "ATE logs (STDF / WAT)",
  "Wafer map (BIN / retest)",
  "Handler GEM / SECS events",
  "Socket PM + CMMS",
  "Quality SPC / Yield learning"
];

export type PreviewShowcaseId =
  | "semiconductor-design-explorer"
  | "agentic-workflow-control-room";

export type PreviewShowcase = {
  id: PreviewShowcaseId;
  title: LocalizedText;
  subtitle: LocalizedText;
  description: LocalizedText;
  route: string;
  status: LocalizedText;
  features: {
    title: LocalizedText;
    body: LocalizedText;
  }[];
  buildNotes: LocalizedText[];
  metrics: {
    label: LocalizedText;
    value: string;
  }[];
};

export const previewShowcases: Record<PreviewShowcaseId, PreviewShowcase> = {
  "semiconductor-design-explorer": {
    id: "semiconductor-design-explorer",
    title: {
      ko: "3D Semiconductor Design Explorer",
      en: "3D Semiconductor Design Explorer"
    },
    subtitle: {
      ko: "AI 가속기 패키지, 칩렛, HBM, 인터포저와 결함을 한 화면에서 탐색",
      en: "Inspect AI accelerator package, chiplets, HBM, interposer, and defects in one surface"
    },
    description: {
      ko: "패키지 검토자가 CoWoS-class 구조를 사실적인 3D 렌더로 보고 Copilot에게 열, 범프, 인터포저, 휨 위험의 우선순위를 묻는 인터랙티브 탐색기입니다.",
      en: "An interactive explorer for package review teams inspecting a CoWoS-class structure with photoreal 3D rendering and Copilot-assisted thermal, bump, interposer, and warpage triage."
    },
    route: "/showcase/semiconductor-design-explorer",
    status: { ko: "인터랙티브", en: "Interactive" },
    features: [
      {
        title: { ko: "패키지 렌더", en: "Package render" },
        body: {
          ko: "몰드, 리드, 기판, HBM과 칩렛을 제품 사진처럼 입체화합니다.",
          en: "Render mold, lid, substrate, HBM, and chiplets as a studio-grade 3D package."
        }
      },
      {
        title: { ko: "컷어웨이 토글", en: "Cutaway toggles" },
        body: {
          ko: "인터포저, 범프, BGA, 열 경로를 독립적으로 켭니다.",
          en: "Toggle interposer, bumps, BGA, and thermal paths independently."
        }
      },
      {
        title: { ko: "결함 마커", en: "Defect markers" },
        body: {
          ko: "열, 범프, 휨 위험을 AI 패키지 리뷰 큐로 보냅니다.",
          en: "Promote thermal, bump, and warpage risks into an AI package review queue."
        }
      }
    ],
    buildNotes: [
      {
        ko: "Copilot 프롬프트 스토리보드: 3D 화면 구현 전에 패키지 컷어웨이, 결함 질문, 검토 결정을 정리했습니다.",
        en: "Copilot prompt storyboard: framed package cutaway controls, defect questions, and review decisions before building the 3D surface."
      },
      {
        ko: "MCP 컨텍스트 맵: 인터포저, 범프 맵, 패키지 이슈, 조립 가이드를 Copilot에 전달할 컨텍스트로 묶었습니다.",
        en: "MCP context map: tied interposer, bump maps, package issues, and assembly guidelines to the Copilot context."
      },
      {
        ko: "에이전트 리뷰 체크리스트: 레이아웃, 접근성, 성능 검토의 인계 기준을 고정했습니다.",
        en: "agent review checklist: fixed the handoff criteria for layout, accessibility, and performance review."
      }
    ],
    metrics: [
      { label: { ko: "HBM", en: "HBM" }, value: "4" },
      { label: { ko: "범프", en: "Bumps" }, value: "312" },
      { label: { ko: "검토 큐", en: "Review queue" }, value: "4" }
    ]
  },
  "agentic-workflow-control-room": {
    id: "agentic-workflow-control-room",
    title: {
      ko: "Agentic Workflow Control Room",
      en: "Agentic Workflow Control Room"
    },
    subtitle: {
      ko: "조사, 구현, 리뷰, 테스트 에이전트를 승인 게이트와 함께 관제",
      en: "Orchestrate research, implementation, review, and test agents with human checkpoints"
    },
    description: {
      ko: "복수 에이전트의 trace, 도구 호출, 승인 지점, 테스트 신호를 운영자가 한 화면에서 확인하는 인터랙티브 관제 화면입니다.",
      en: "An interactive control surface for monitoring multi-agent traces, tool calls, approval points, and test signals in one operating room."
    },
    route: "/showcase/agentic-workflow-control-room",
    status: { ko: "인터랙티브", en: "Interactive" },
    features: [
      {
        title: { ko: "조사 에이전트", en: "Research agent" },
        body: {
          ko: "공식 문서와 저장소 컨텍스트를 수집해 근거를 고정합니다.",
          en: "Collects official docs and repository context before work starts."
        }
      },
      {
        title: { ko: "승인 게이트", en: "Approval gates" },
        body: {
          ko: "파일 수정, 명령 실행, 배포 직전의 위험한 단계를 멈춥니다.",
          en: "Pauses risky edits, commands, and deployment-adjacent steps."
        }
      },
      {
        title: { ko: "트레이스 리플레이", en: "Trace replay" },
        body: {
          ko: "계획, 실행, 관찰, 수정 루프를 시간축에서 재생합니다.",
          en: "Replays plan, act, observe, and revise loops across a timeline."
        }
      }
    ],
    buildNotes: [
      {
        ko: "서브에이전트 디스패치 계획: 조사, 구현, 리뷰, 테스트 루프를 경계가 명확한 작업으로 나눴습니다.",
        en: "subagent dispatch plan: split research, implementation, review, and test loops into bounded tasks."
      },
      {
        ko: "승인 정책 하네스: 파일 수정, 명령 실행, 배포 직전 단계에서 운영자 승인이 필요한 시점을 모델링했습니다.",
        en: "approval policy harness: modeled when operators must approve edits, commands, and deployment-adjacent steps."
      },
      {
        ko: "루프 평가 루브릭: 계획, 실행, 관찰, 수정 단계를 동일한 기준으로 점검했습니다.",
        en: "loop evaluation rubric: checked plan, act, observe, and revise steps against one operating standard."
      }
    ],
    metrics: [
      { label: { ko: "에이전트", en: "Agents" }, value: "4" },
      { label: { ko: "게이트", en: "Gates" }, value: "9" },
      { label: { ko: "평균 루프", en: "Avg loop" }, value: "42s" }
    ]
  }
};
