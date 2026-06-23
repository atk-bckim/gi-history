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
    helper: { ko: "1,842 활성", en: "1,842 active" }
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
    throughput: 2610,
    oee: 88.4,
    defectRate: 0.22,
    activeAlarms: 1,
    temperatureDrift: 0.4
  },
  {
    time: "12:30",
    throughput: 2688,
    oee: 88.9,
    defectRate: 0.25,
    activeAlarms: 1,
    temperatureDrift: 0.7
  },
  {
    time: "13:00",
    throughput: 2756,
    oee: 89.3,
    defectRate: 0.31,
    activeAlarms: 2,
    temperatureDrift: 1.2
  },
  {
    time: "13:30",
    throughput: 2811,
    oee: 89.5,
    defectRate: 0.35,
    activeAlarms: 2,
    temperatureDrift: 1.8
  },
  {
    time: "14:30",
    throughput: 2842,
    oee: 89.7,
    defectRate: 0.37,
    activeAlarms: 3,
    temperatureDrift: 2.4
  },
  {
    time: "15:00",
    throughput: 2794,
    oee: 89.1,
    defectRate: 0.41,
    activeAlarms: 3,
    temperatureDrift: 2.1
  }
];

export const equipmentTelemetry: Equipment[] = [
  {
    id: "CVD-04",
    label: "CVD-04",
    type: { ko: "증착 챔버", en: "CVD Chamber" },
    area: { ko: "박막 공정", en: "Thin Films" },
    status: "warning",
    statusText: { ko: "주의", en: "Watch" },
    uptime: "08d 13h 44m",
    temperatureC: 58.1,
    throughput: 690,
    riskScore: 54,
    trend: 6,
    hotspot: { left: "22%", top: "27%" },
    position3d: [-3.4, 0.45, -1.3],
    analysis: {
      title: {
        ko: "배기 압력 변화 감지",
        en: "Exhaust pressure drift detected"
      },
      summary: {
        ko: "압력 편차가 누적되어 다음 PM 전 필터 점검이 필요합니다.",
        en: "Pressure variance is accumulating ahead of the next PM window."
      },
      recommendedActions: [
        {
          ko: "챔버 배기 로그와 필터 압력 추세를 비교합니다.",
          en: "Compare chamber exhaust logs with filter pressure trends."
        },
        {
          ko: "야간 교대 전에 레시피 보정값을 승인합니다.",
          en: "Approve the recipe offset before the night shift."
        }
      ]
    },
    logs: [
      {
        time: "14:20",
        severity: "warning",
        text: { ko: "배기 압력 편차", en: "Exhaust pressure variance" }
      },
      {
        time: "14:02",
        severity: "nominal",
        text: { ko: "증착 속도 안정", en: "Deposition rate stable" }
      }
    ]
  },
  {
    id: "PVD-02",
    label: "PVD-02",
    type: { ko: "PVD 모듈", en: "PVD Module" },
    area: { ko: "금속 배선", en: "Metallization" },
    status: "nominal",
    statusText: { ko: "정상", en: "Normal" },
    uptime: "19d 01h 08m",
    temperatureC: 47.5,
    throughput: 734,
    riskScore: 18,
    trend: -2,
    hotspot: { left: "41%", top: "58%" },
    position3d: [-0.7, 0.45, 1.1],
    analysis: {
      title: {
        ko: "공정 안정권 유지",
        en: "Process holding inside control band"
      },
      summary: {
        ko: "막 두께와 전력 곡선이 최근 90분 동안 정상 범위입니다.",
        en: "Film thickness and power curves are inside range for 90 minutes."
      },
      recommendedActions: [
        {
          ko: "현재 레시피와 교대 기준을 유지합니다.",
          en: "Keep the current recipe and shift thresholds."
        },
        {
          ko: "정상 샘플을 후속 이상 탐지 기준으로 저장합니다.",
          en: "Save the healthy sample as an anomaly baseline."
        }
      ]
    },
    logs: [
      {
        time: "14:16",
        severity: "nominal",
        text: { ko: "플라즈마 전력 안정", en: "Plasma power stable" }
      },
      {
        time: "13:54",
        severity: "nominal",
        text: { ko: "막 두께 정상", en: "Film thickness in range" }
      }
    ]
  },
  {
    id: "ETCH-07",
    label: "ETCH-07",
    type: { ko: "식각 클러스터", en: "Etch Cluster" },
    area: { ko: "식각", en: "Etch" },
    status: "warning",
    statusText: { ko: "주의", en: "Watch" },
    uptime: "05d 22h 17m",
    temperatureC: 62.3,
    throughput: 618,
    riskScore: 61,
    trend: 9,
    hotspot: { left: "51%", top: "20%" },
    position3d: [1.1, 0.45, -1.9],
    analysis: {
      title: {
        ko: "엔드포인트 신호 변동 증가",
        en: "Endpoint signal variance rising"
      },
      summary: {
        ko: "최근 로트에서 광학 엔드포인트 변동성이 증가했습니다.",
        en: "Optical endpoint variance increased across recent lots."
      },
      recommendedActions: [
        {
          ko: "레시피별 엔드포인트 파형을 재검토합니다.",
          en: "Review endpoint traces by recipe."
        },
        {
          ko: "챔버 매칭 상태를 CMP 경보와 함께 확인합니다.",
          en: "Check chamber matching alongside the CMP alarm."
        }
      ]
    },
    logs: [
      {
        time: "14:24",
        severity: "warning",
        text: { ko: "엔드포인트 흔들림", en: "Endpoint jitter warning" }
      },
      {
        time: "14:11",
        severity: "nominal",
        text: { ko: "챔버 매칭 통과", en: "Chamber match passed" }
      }
    ]
  },
  {
    id: "CMP-03",
    label: "CMP-03",
    type: { ko: "CMP 폴리셔", en: "CMP Polisher" },
    area: { ko: "습식 공정", en: "Wet Process" },
    status: "alarm",
    statusText: { ko: "알람", en: "Alarm" },
    uptime: "11d 04h 22m",
    temperatureC: 82.7,
    throughput: 800,
    riskScore: 86,
    trend: 14,
    hotspot: { left: "68%", top: "42%" },
    position3d: [2.9, 0.45, 0.25],
    analysis: {
      title: {
        ko: "슬러리 온도 편차 감지",
        en: "Slurry temperature deviation detected"
      },
      summary: {
        ko: "슬러리 온도와 유량이 결함률 상승과 함께 움직입니다.",
        en: "Slurry temperature and flow are moving with the defect-rate rise."
      },
      recommendedActions: [
        {
          ko: "패드 상태와 컨디셔너 압력을 점검합니다.",
          en: "Inspect pad condition and conditioner pressure."
        },
        {
          ko: "슬러리 농도와 유량 센서를 교차 확인합니다.",
          en: "Cross-check slurry concentration and flow sensors."
        }
      ]
    },
    logs: [
      {
        time: "14:31",
        severity: "alarm",
        text: { ko: "온도 고경보", en: "Temperature high alarm" }
      },
      {
        time: "14:29",
        severity: "warning",
        text: { ko: "슬러리 유량 변동", en: "Slurry flow rate fluctuation" }
      },
      {
        time: "14:22",
        severity: "warning",
        text: { ko: "진동 임계값 경고", en: "Vibration threshold warning" }
      }
    ]
  }
];

export const mcpContextSources = [
  "MES (Manufacturing)",
  "CMMS (Maintenance)",
  "Historian (PI System)",
  "Quality (SPC)"
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
