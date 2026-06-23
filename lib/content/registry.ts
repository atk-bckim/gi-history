import type {
  GlossaryTerm,
  Lesson,
  ResourceSection,
  SourceRef
} from "@/lib/content/types";

export const sourceRefs: SourceRef[] = [
  {
    id: "github-copilot-overview",
    title: "What is GitHub Copilot?",
    url: "https://docs.github.com/en/copilot/get-started/what-is-github-copilot",
    publisher: "GitHub Docs"
  },
  {
    id: "github-copilot-plans",
    title: "GitHub Copilot plans",
    url: "https://docs.github.com/en/copilot/get-started/plans",
    publisher: "GitHub Docs"
  },
  {
    id: "vscode-copilot-chat",
    title: "Use chat in VS Code",
    url: "https://code.visualstudio.com/docs/chat/copilot-chat",
    publisher: "Visual Studio Code Docs"
  },
  {
    id: "vscode-prompt-files",
    title: "Use prompt files in VS Code",
    url: "https://code.visualstudio.com/docs/agent-customization/prompt-files",
    publisher: "Visual Studio Code Docs"
  },
  {
    id: "vscode-agent-skills",
    title: "Use Agent Skills in VS Code",
    url: "https://code.visualstudio.com/docs/agent-customization/agent-skills",
    publisher: "Visual Studio Code Docs"
  },
  {
    id: "github-copilot-cli",
    title: "About GitHub Copilot CLI",
    url: "https://docs.github.com/copilot/concepts/agents/about-copilot-cli",
    publisher: "GitHub Docs"
  },
  {
    id: "github-copilot-cloud-agent",
    title: "About Copilot cloud agent",
    url: "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent",
    publisher: "GitHub Docs"
  },
  {
    id: "github-copilot-mcp",
    title: "Extending Copilot with MCP",
    url: "https://docs.github.com/en/copilot/concepts/context/mcp",
    publisher: "GitHub Docs"
  },
  {
    id: "github-copilot-code-review",
    title: "Using GitHub Copilot code review",
    url: "https://docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review",
    publisher: "GitHub Docs"
  },
  {
    id: "github-content-exclusion-concept",
    title: "Content exclusion for GitHub Copilot",
    url: "https://docs.github.com/en/copilot/concepts/context/content-exclusion",
    publisher: "GitHub Docs"
  },
  {
    id: "github-copilot-policies-org",
    title: "Managing policies and features for GitHub Copilot in your organization",
    url: "https://docs.github.com/copilot/managing-github-copilot-in-your-organization/managing-policies-and-features-for-copilot-in-your-organization",
    publisher: "GitHub Docs"
  },
  {
    id: "microsoft-365-copilot",
    title: "Microsoft 365 Copilot overview",
    url: "https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-overview",
    publisher: "Microsoft Learn"
  },
  {
    id: "openai-harness-engineering",
    title: "Harness engineering",
    url: "https://openai.com/index/harness-engineering/",
    publisher: "OpenAI"
  },
  {
    id: "mcp-intro",
    title: "Model Context Protocol introduction",
    url: "https://modelcontextprotocol.io/docs/getting-started/intro",
    publisher: "Model Context Protocol"
  }
];

export const lessons: Lesson[] = [
  {
    id: "github-copilot-overview",
    slug: "/github-copilot",
    title: {
      ko: "GitHub Copilot 전체 지도와 학습 순서",
      en: "GitHub Copilot overview and learning path"
    },
    summary: {
      ko: "Copilot 표면, 플랜, 실행 위치, 보안 정책, 학습 순서를 한 장의 운영 지도로 정리한다.",
      en: "Map Copilot surfaces, plans, runtimes, security policy, and learning order into one operating guide."
    },
    level: "intro",
    durationMinutes: 30,
    tools: ["GitHub Copilot", "VS Code", "GitHub.com"],
    outcomes: [
      {
        ko: "작업 유형에 따라 inline suggestion, Chat, agent mode, CLI, cloud agent, code review 중 무엇을 쓸지 고를 수 있다.",
        en: "Choose between inline suggestions, Chat, agent mode, CLI, cloud agent, and code review based on task type."
      },
      {
        ko: "Copilot Individual, Business, Enterprise의 교육/운영 차이를 설명할 수 있다.",
        en: "Explain the training and operating differences between Copilot Individual, Business, and Enterprise."
      }
    ],
    sourceRefIds: [
      "github-copilot-overview",
      "github-copilot-plans",
      "vscode-copilot-chat",
      "github-copilot-cli",
      "github-copilot-cloud-agent",
      "github-copilot-mcp",
      "github-copilot-code-review"
    ],
    updatedAt: "2026-06-22"
  },
  {
    id: "github-copilot-vscode",
    slug: "/github-copilot/vscode",
    title: {
      ko: "VS Code Copilot 기본기와 컨텍스트 지정",
      en: "VS Code Copilot fundamentals and context targeting"
    },
    summary: {
      ko: "인라인 제안, Copilot Chat, agent mode를 한 작업 흐름 안에서 비교하고 파일, 선택 영역, 코드베이스 컨텍스트를 명시하는 방법을 익힌다.",
      en: "Compare inline suggestions, Copilot Chat, and agent mode in one workflow while practicing file, selection, and codebase context targeting."
    },
    level: "intro",
    durationMinutes: 35,
    tools: ["VS Code", "GitHub Copilot"],
    outcomes: [
      {
        ko: "같은 개발 과제를 인라인 제안, Chat, agent mode로 나누어 수행할 수 있다.",
        en: "Run the same development task through inline suggestions, Chat, and agent mode."
      },
      {
        ko: "응답 품질을 높이기 위해 필요한 코드와 문서를 컨텍스트로 지정할 수 있다.",
        en: "Target the code and documents needed to improve answer quality."
      }
    ],
    sourceRefIds: ["github-copilot-overview", "vscode-copilot-chat"],
    updatedAt: "2026-06-22"
  },
  {
    id: "github-copilot-cli",
    slug: "/github-copilot/cli",
    title: {
      ko: "Copilot CLI와 승인 기반 개발 루프",
      en: "Copilot CLI and approval-based development loops"
    },
    summary: {
      ko: "터미널에서 Copilot CLI를 사용해 계획, 명령 제안, 도구 승인, 리뷰 흐름을 안전하게 운영하는 방법을 학습한다.",
      en: "Learn how to use Copilot CLI for planning, command suggestions, tool approval, and review workflows from the terminal."
    },
    level: "intermediate",
    durationMinutes: 45,
    tools: ["GitHub Copilot CLI", "Terminal", "MCP"],
    outcomes: [
      {
        ko: "CLI에서 계획 모드와 승인 게이트가 왜 필요한지 설명할 수 있다.",
        en: "Explain why plan mode and approval gates matter in a CLI workflow."
      },
      {
        ko: "MCP 서버를 추가하기 전에 권한과 실패 모드를 점검할 수 있다.",
        en: "Check permissions and failure modes before adding an MCP server."
      }
    ],
    sourceRefIds: ["github-copilot-cli", "github-copilot-mcp"],
    updatedAt: "2026-06-22"
  },
  {
    id: "github-copilot-agents",
    slug: "/github-copilot/agents",
    title: {
      ko: "Cloud/Coding Agent와 IDE Agent Mode",
      en: "Cloud/Coding Agent and IDE Agent Mode"
    },
    summary: {
      ko: "GitHub Copilot cloud agent, coding agent, VS Code agent mode, custom agents, prompt files, skills의 차이를 실행 환경과 승인 방식 중심으로 비교한다.",
      en: "Compare GitHub Copilot cloud agent, coding agent, VS Code agent mode, custom agents, prompt files, and skills by runtime and approval model."
    },
    level: "intermediate",
    durationMinutes: 45,
    tools: ["GitHub Copilot", "VS Code Agent Mode", "Cloud Agent"],
    outcomes: [
      {
        ko: "IDE agent mode와 GitHub cloud/coding agent의 실행 위치와 산출물을 구분할 수 있다.",
        en: "Distinguish IDE agent mode from GitHub cloud/coding agent by runtime and output."
      },
      {
        ko: "custom instructions, prompt files, custom agents, skills, MCP를 역할별로 배치할 수 있다.",
        en: "Place custom instructions, prompt files, custom agents, skills, and MCP in the right roles."
      }
    ],
    sourceRefIds: [
      "github-copilot-cloud-agent",
      "vscode-prompt-files",
      "vscode-agent-skills",
      "github-copilot-mcp"
    ],
    updatedAt: "2026-06-22"
  },
  {
    id: "github-copilot-review-security",
    slug: "/github-copilot/review",
    title: {
      ko: "Copilot 코드 리뷰, 보안, 관리자 정책",
      en: "Copilot code review, security, and admin policy"
    },
    summary: {
      ko: "Copilot code review를 인간 리뷰 보조로 쓰고, content exclusion, public code matching, 조직 정책을 검증 루프에 연결하는 기준을 정리한다.",
      en: "Use Copilot code review as human-review support, then connect content exclusion, public code matching, and organization policy into a verification loop."
    },
    level: "intermediate",
    durationMinutes: 40,
    tools: ["Copilot Code Review", "GitHub Policies", "Security Review"],
    outcomes: [
      {
        ko: "AI 리뷰를 사람 리뷰 앞의 pre-review 또는 보조 리뷰로 배치할 수 있다.",
        en: "Position AI review as pre-review or supporting review before human approval."
      },
      {
        ko: "content exclusion, public code matching, 자동 리뷰 정책의 운영 기준을 설명할 수 있다.",
        en: "Explain operational standards for content exclusion, public code matching, and automatic review policies."
      }
    ],
    sourceRefIds: [
      "github-copilot-code-review",
      "github-content-exclusion-concept",
      "github-copilot-policies-org"
    ],
    updatedAt: "2026-06-22"
  },
  {
    id: "agentic-ai-evolution",
    slug: "/agentic-ai",
    title: {
      ko: "프롬프트에서 하네스와 루프 엔지니어링까지",
      en: "From prompts to harness and loop engineering"
    },
    summary: {
      ko: "ChatGPT 이후 AI 활용이 프롬프트 작성에서 컨텍스트, 도구, 에이전트, 평가, 반복 루프 설계로 확장된 흐름을 정리한다.",
      en: "Trace how AI practice evolved from prompt writing to context, tools, agents, evaluation, and repeatable loop design."
    },
    level: "advanced",
    durationMinutes: 50,
    tools: ["MCP", "Agents", "Evals"],
    outcomes: [
      {
        ko: "프롬프트 엔지니어링과 컨텍스트 엔지니어링의 차이를 설명할 수 있다.",
        en: "Explain the difference between prompt engineering and context engineering."
      },
      {
        ko: "하네스 엔지니어링과 루프 엔지니어링을 실무 운영 관점으로 해석할 수 있다.",
        en: "Interpret harness engineering and loop engineering as operational design practices."
      }
    ],
    sourceRefIds: ["openai-harness-engineering", "mcp-intro"],
    updatedAt: "2026-06-22"
  },
  {
    id: "microsoft-copilot-work",
    slug: "/microsoft-copilot",
    title: {
      ko: "Microsoft Copilot 업무 활용과 거버넌스",
      en: "Microsoft Copilot for work and governance"
    },
    summary: {
      ko: "개인 Copilot, Microsoft 365 Copilot Chat, Microsoft 365 Copilot, Copilot Studio의 차이와 업무 데이터 보호 관점을 정리한다.",
      en: "Clarify the differences between personal Copilot, Microsoft 365 Copilot Chat, Microsoft 365 Copilot, and Copilot Studio from a work-data governance perspective."
    },
    level: "intermediate",
    durationMinutes: 35,
    tools: ["Microsoft 365 Copilot", "Copilot Studio"],
    outcomes: [
      {
        ko: "개인 계정과 업무/학교 계정의 데이터 보호 차이를 설명할 수 있다.",
        en: "Explain how personal and work or school account data protections differ."
      }
    ],
    sourceRefIds: ["microsoft-365-copilot"],
    updatedAt: "2026-06-22"
  }
];

export const glossaryTerms: GlossaryTerm[] = [
  {
    id: "prompt-engineering",
    term: { ko: "프롬프트 엔지니어링", en: "Prompt engineering" },
    definition: {
      ko: "모델에게 목표, 맥락, 제약, 예시, 출력 형식을 명확히 전달하는 요청 설계 기술이다.",
      en: "The practice of structuring goals, context, constraints, examples, and output format for a model request."
    },
    learnerNotes: {
      ko: "단일 요청의 품질을 높이는 데 강하다. 좋은 프롬프트는 역할, 성공 기준, 금지 사항, 출력 스키마를 포함하지만, 누락된 파일이나 최신 상태를 자동으로 보완하지는 않는다.",
      en: "Useful for improving one request at a time. A strong prompt names the role, success criteria, constraints, and output schema, but it does not automatically supply missing files or current state."
    },
    related: ["context-engineering"],
    keywords: ["prompt", "프롬프트", "instruction", "지시문"]
  },
  {
    id: "context-engineering",
    term: { ko: "컨텍스트 엔지니어링", en: "Context engineering" },
    definition: {
      ko: "AI가 작업할 때 필요한 파일, 지식, 도구, 상태, 메모리를 선별하고 구성하는 설계 방식이다.",
      en: "The design practice of selecting and arranging files, knowledge, tools, state, and memory for an AI task."
    },
    learnerNotes: {
      ko: "프롬프트가 질문 문장이라면 컨텍스트 엔지니어링은 작업대 준비에 가깝다. 어떤 파일을 읽힐지, 어떤 문서를 근거로 삼을지, 어떤 도구를 허용할지 정한다.",
      en: "If prompting is the request text, context engineering is preparing the workbench. It decides which files are visible, which documents ground the answer, and which tools are allowed."
    },
    related: ["mcp", "rag"],
    keywords: ["context", "컨텍스트", "grounding", "맥락"]
  },
  {
    id: "mcp",
    term: { ko: "모델 컨텍스트 프로토콜", en: "Model Context Protocol" },
    definition: {
      ko: "AI 앱이 외부 도구, 데이터, 워크플로에 연결되도록 돕는 개방형 프로토콜이다.",
      en: "An open protocol that lets AI applications connect to external tools, data, and workflows."
    },
    learnerNotes: {
      ko: "MCP는 모델 자체가 아니라 연결 규격이다. 파일 시스템, 이슈 트래커, 브라우저, 사내 API 같은 외부 능력을 표준화된 방식으로 노출할 때 사용한다.",
      en: "MCP is a connection protocol, not a model. It exposes external capabilities such as file systems, issue trackers, browsers, and internal APIs through a common interface."
    },
    related: ["tool-use", "context-engineering"],
    keywords: ["mcp", "tool", "도구", "connector"]
  },
  {
    id: "rag",
    term: { ko: "검색 증강 생성", en: "Retrieval-augmented generation" },
    definition: {
      ko: "모델 응답 전에 관련 문서나 데이터를 검색해 근거 컨텍스트로 넣는 생성 방식이다.",
      en: "A generation pattern that retrieves relevant documents or data and supplies them as grounding context before the model answers."
    },
    learnerNotes: {
      ko: "RAG는 사내 지식, 정책, 긴 문서처럼 모델 파라미터에 없는 정보를 다룰 때 유용하다. 핵심 품질 변수는 검색 범위, 청킹, 랭킹, 출처 표시다.",
      en: "RAG is useful for internal knowledge, policy, and long documents that are not reliably in model parameters. Quality depends on corpus scope, chunking, ranking, and citation."
    },
    related: ["context-engineering", "evals"],
    keywords: ["rag", "검색", "retrieval", "grounding", "citation"]
  },
  {
    id: "agent",
    term: { ko: "에이전트", en: "Agent" },
    definition: {
      ko: "목표를 위해 계획하고 도구를 호출하며 관찰과 수정 단계를 반복하는 AI 작업 단위다.",
      en: "An AI work unit that plans toward a goal, calls tools, observes results, and revises its actions."
    },
    learnerNotes: {
      ko: "에이전트는 긴 작업을 여러 단계로 나누고 결과를 관찰해 다음 행동을 고른다. 그래서 권한, 예산, 중단 조건, 검증 기준이 프롬프트보다 더 중요해진다.",
      en: "An agent decomposes longer work, observes outcomes, and chooses next actions. Permissions, budget, stopping rules, and verification criteria therefore matter more than the initial prompt alone."
    },
    related: ["loop-engineering", "agent-skill"],
    keywords: ["agent", "에이전트", "planner", "tool use"]
  },
  {
    id: "agent-skill",
    term: { ko: "에이전트 스킬", en: "Agent skill" },
    definition: {
      ko: "반복 가능한 절차, 참고자료, 스크립트를 묶어 에이전트가 특정 업무를 더 잘 수행하게 하는 패키지다.",
      en: "A package of repeatable procedures, references, and scripts that helps an agent perform a specific job."
    },
    learnerNotes: {
      ko: "스킬은 매번 긴 지시를 복사하는 대신 검증된 절차를 재사용하게 한다. 좋은 스킬은 적용 조건, 단계, 참고 파일, 실패 시 대안을 명확히 적는다.",
      en: "A skill replaces repeated long instructions with a reusable procedure. A good skill states when to use it, the steps, reference files, and fallback behavior."
    },
    related: ["agent", "subagent"],
    keywords: ["skill", "스킬", "procedure", "workflow"]
  },
  {
    id: "harness-engineering",
    term: { ko: "하네스 엔지니어링", en: "Harness engineering" },
    definition: {
      ko: "에이전트가 안전하고 반복 가능하게 일하도록 작업 환경, 권한, 테스트, 평가, 관측성을 설계하는 분야다.",
      en: "Designing the work environment, permissions, tests, evaluations, and observability that make agents reliable."
    },
    learnerNotes: {
      ko: "하네스는 에이전트 주변의 실행 장치다. 샌드박스, 승인 게이트, 로그, 테스트 명령, 평가 데이터가 갖춰져야 같은 작업을 다시 맡겨도 결과를 비교할 수 있다.",
      en: "A harness is the execution rig around an agent. Sandboxes, approval gates, logs, test commands, and evaluation data make repeated runs comparable."
    },
    related: ["evals", "loop-engineering"],
    keywords: ["harness", "하네스", "eval", "평가"]
  },
  {
    id: "loop-engineering",
    term: { ko: "루프 엔지니어링", en: "Loop engineering" },
    definition: {
      ko: "AI가 트리거, 상태, 예산, 중단 조건에 따라 반복 실행되도록 운영 루프를 설계하는 신흥 실무다.",
      en: "An emerging practice for designing recurring AI work loops with triggers, state, budget, and stop conditions."
    },
    learnerNotes: {
      ko: "루프 엔지니어링은 한 번의 답변보다 반복 운영에 초점을 둔다. 모니터링, 재시도, 사람 승인, 회고 데이터를 어디에 넣을지 설계한다.",
      en: "Loop engineering focuses on repeated operation rather than one answer. It designs where monitoring, retries, human approval, and retrospective data enter the cycle."
    },
    related: ["agent", "harness-engineering"],
    keywords: ["loop", "루프", "automation", "trigger"]
  },
  {
    id: "subagent",
    term: { ko: "서브에이전트", en: "Subagent" },
    definition: {
      ko: "조사, 구현, 리뷰처럼 좁은 역할과 컨텍스트를 가진 보조 에이전트다.",
      en: "A helper agent with a narrow role and context, such as research, implementation, or review."
    },
    learnerNotes: {
      ko: "서브에이전트는 병렬 조사나 독립 리뷰처럼 분리 가능한 일에 적합하다. 공유 파일을 동시에 고치는 작업에는 충돌 관리가 필요하다.",
      en: "Subagents fit separable work such as parallel research or independent review. Work that edits shared files still needs conflict management."
    },
    related: ["agent", "agent-skill"],
    keywords: ["subagent", "서브에이전트", "parallel", "병렬"]
  },
  {
    id: "rlhf-feedback-loop",
    term: { ko: "RLHF식 피드백 루프", en: "RLHF-style feedback loop" },
    definition: {
      ko: "사람의 선호, 평가, 수정 신호를 반복적으로 수집해 모델 또는 작업 정책을 개선하는 피드백 구조다.",
      en: "A feedback structure that repeatedly collects human preferences, ratings, or corrections to improve a model or operating policy."
    },
    learnerNotes: {
      ko: "Ralph 같은 내부 피드백 시스템을 떠올리면 쉽다. 실무에서는 모델 학습까지 가지 않더라도 리뷰 코멘트, 실패 사례, 선호 규칙을 다음 프롬프트와 하네스에 반영한다.",
      en: "Think of systems like Ralph-style internal feedback. In practice, even without retraining a model, review comments, failure cases, and preference rules can feed the next prompt and harness."
    },
    related: ["evals", "loop-engineering"],
    keywords: ["rlhf", "feedback", "피드백", "preference", "Ralph"]
  },
  {
    id: "evals",
    term: { ko: "평가", en: "Evals" },
    definition: {
      ko: "AI 출력이 요구사항을 만족하는지 사례, 기준, 채점 방식으로 반복 검증하는 체계다.",
      en: "A repeatable system of cases, criteria, and scoring methods for checking whether AI outputs satisfy requirements."
    },
    learnerNotes: {
      ko: "좋은 평가는 단순 점수보다 실패를 설명한다. 회귀 테스트, 정답 예시, 루브릭, 사람 리뷰를 조합해 변경 전후 품질을 비교한다.",
      en: "Good evals explain failures, not just scores. Regression tests, reference answers, rubrics, and human review combine to compare quality before and after changes."
    },
    related: ["harness-engineering", "rlhf-feedback-loop"],
    keywords: ["eval", "evaluation", "평가", "rubric", "regression"]
  },
  {
    id: "tool-use",
    term: { ko: "도구 사용", en: "Tool use" },
    definition: {
      ko: "모델이나 에이전트가 검색, 파일 편집, 명령 실행, API 호출 같은 외부 기능을 선택해 사용하는 능력이다.",
      en: "The ability for a model or agent to select and call external capabilities such as search, file editing, command execution, or APIs."
    },
    learnerNotes: {
      ko: "도구 사용은 답변 생성과 실제 행동 사이의 경계다. 권한, 입력 스키마, 오류 처리, 승인 정책을 명확히 해야 사고를 줄일 수 있다.",
      en: "Tool use is the boundary between generating text and taking action. Clear permissions, input schemas, error handling, and approval policy reduce operational risk."
    },
    related: ["mcp", "agent"],
    keywords: ["tool", "도구", "function calling", "api", "approval"]
  },
  {
    id: "custom-instructions",
    term: { ko: "사용자 지정 지침", en: "Custom instructions" },
    definition: {
      ko: "모델이나 도구가 반복해서 따라야 하는 선호, 제약, 작업 방식을 미리 적어 두는 지속 지침이다.",
      en: "Persistent guidance that records preferences, constraints, and working style for a model or tool to follow repeatedly."
    },
    learnerNotes: {
      ko: "프로젝트 코딩 규칙, 답변 언어, 금지 행동처럼 자주 반복되는 기준에 적합하다. 일회성 작업 지시나 긴 근거 자료는 prompt file이나 컨텍스트로 분리하는 편이 낫다.",
      en: "Use them for repeated standards such as project coding rules, response language, and prohibited actions. One-off task instructions or long evidence belong in prompt files or context."
    },
    related: ["prompt-files", "prompt-engineering"],
    keywords: ["custom instructions", "instructions", "지침", "preferences"]
  },
  {
    id: "prompt-files",
    term: { ko: "프롬프트 파일", en: "Prompt files" },
    definition: {
      ko: "반복 작업을 위해 프롬프트, 변수, 절차, 참고 컨텍스트를 파일로 저장해 호출하는 방식이다.",
      en: "A way to store prompts, variables, procedures, and reference context in files for repeated tasks."
    },
    learnerNotes: {
      ko: "prompt file은 팀에서 검토하고 버전 관리할 수 있어 교육과 표준화에 좋다. 작업별 입력값만 바꾸고 동일한 루브릭과 출력 형식을 유지할 수 있다.",
      en: "Prompt files are reviewable and versioned, which makes them useful for training and standardization. Teams can vary task inputs while keeping the same rubric and output format."
    },
    related: ["custom-instructions", "agent-skill"],
    keywords: ["prompt file", "프롬프트 파일", "template", "템플릿"]
  },
  {
    id: "cloud-coding-agent",
    term: { ko: "클라우드/코딩 에이전트", en: "Cloud/coding agent" },
    definition: {
      ko: "원격 환경에서 이슈나 작업 지시를 받아 코드를 조사, 수정, 검증하고 변경 제안을 만드는 개발 에이전트다.",
      en: "A development agent that receives an issue or task in a remote environment, investigates code, edits, verifies, and proposes changes."
    },
    learnerNotes: {
      ko: "IDE agent mode와 달리 실행 위치와 권한 경계가 원격 인프라에 있다. 작은 이슈, 명확한 테스트, 제한된 권한, 리뷰 가능한 PR 단위 작업에 잘 맞는다.",
      en: "Unlike IDE agent mode, runtime and permission boundaries live in remote infrastructure. It fits small issues, clear tests, limited permissions, and reviewable PR-sized work."
    },
    related: ["agent", "harness-engineering"],
    keywords: ["cloud agent", "coding agent", "코딩 에이전트", "remote", "pull request"]
  },
  {
    id: "inline-chat",
    term: { ko: "인라인 채팅", en: "Inline chat" },
    definition: {
      ko: "편집기 안의 선택 영역이나 현재 파일 맥락에서 짧은 질문, 설명, 수정을 요청하는 Copilot 대화 표면이다.",
      en: "A Copilot chat surface for asking short questions, explanations, or edits against the current file or selection."
    },
    learnerNotes: {
      ko: "범위가 좁을수록 효과적이다. 여러 파일 변경, 테스트 실행, 장기 계획은 Chat view나 agent mode가 더 적합하다.",
      en: "It works best with narrow scope. Multi-file edits, test loops, and longer planning fit Chat view or agent mode better."
    },
    related: ["prompt-engineering", "context-engineering"],
    keywords: ["inline chat", "인라인 채팅", "selection", "selected code"]
  },
  {
    id: "edit-mode",
    term: { ko: "에디트 모드", en: "Edit mode" },
    definition: {
      ko: "Copilot이 제안한 코드 변경을 diff로 검토하며 여러 파일에 적용할 수 있는 편집 중심 모드다.",
      en: "An edit-focused mode where Copilot proposes changes that can be reviewed as diffs across one or more files."
    },
    learnerNotes: {
      ko: "diff를 읽는 습관이 핵심이다. 적용 전후 테스트와 타입체크를 실행하고, 의도하지 않은 파일 변경을 제거한다.",
      en: "The core habit is reading the diff. Run tests and typecheck before accepting changes, and remove unintended file edits."
    },
    related: ["agent-mode", "tool-approval"],
    keywords: ["edit mode", "diff", "에디트", "multi-file edit"]
  },
  {
    id: "agent-mode",
    term: { ko: "에이전트 모드", en: "Agent mode" },
    definition: {
      ko: "Copilot이 계획, 파일 편집, 도구 호출, 명령 실행, 관찰, 재시도를 포함한 다단계 작업을 수행하는 모드다.",
      en: "A mode where Copilot can perform multi-step work involving planning, file edits, tool calls, command execution, observation, and retries."
    },
    learnerNotes: {
      ko: "agent mode는 편리하지만 권한 경계가 중요하다. 허용 파일, 금지 명령, 검증 명령, 중단 조건을 프롬프트에 써야 한다.",
      en: "Agent mode is powerful, so boundaries matter. State allowed files, forbidden commands, verification commands, and stop conditions."
    },
    related: ["agent", "tool-approval", "harness-engineering"],
    keywords: ["agent mode", "에이전트 모드", "autonomous", "tools"]
  },
  {
    id: "workspace-trust",
    term: { ko: "워크스페이스 신뢰", en: "Workspace trust" },
    definition: {
      ko: "편집기가 현재 프로젝트를 신뢰할 수 있는 작업 공간으로 볼지 결정하고 기능과 실행 권한을 제한하는 안전 장치다.",
      en: "A safety control that determines whether the editor treats the current project as trusted and limits features or execution accordingly."
    },
    learnerNotes: {
      ko: "낯선 저장소나 zip 파일을 열 때 특히 중요하다. AI 도구도 워크스페이스 신뢰, 터미널 권한, MCP 신뢰와 함께 봐야 한다.",
      en: "It matters most for unfamiliar repositories or archives. AI tools should be considered together with workspace trust, terminal permissions, and MCP trust."
    },
    related: ["terminal-sandboxing", "tool-approval"],
    keywords: ["workspace trust", "워크스페이스 신뢰", "trusted workspace", "safety"]
  },
  {
    id: "terminal-sandboxing",
    term: { ko: "터미널 샌드박싱", en: "Terminal sandboxing" },
    definition: {
      ko: "AI나 도구가 터미널 명령을 실행할 때 파일, 네트워크, 프로세스 접근을 제한하는 실행 경계다.",
      en: "An execution boundary that limits file, network, and process access when an AI tool runs terminal commands."
    },
    learnerNotes: {
      ko: "명령 실행은 답변 생성과 다르다. 테스트 명령과 파괴적 명령을 구분하고, 승인 전 출력될 수 있는 비밀값을 점검한다.",
      en: "Command execution is different from text generation. Separate test commands from destructive commands and inspect secrets that could appear in output."
    },
    related: ["tool-approval", "harness-engineering"],
    keywords: ["terminal sandbox", "sandboxing", "터미널", "command approval"]
  },
  {
    id: "content-exclusion",
    term: { ko: "콘텐츠 제외", en: "Content exclusion" },
    definition: {
      ko: "조직이나 저장소에서 특정 파일 또는 경로가 Copilot 일부 기능의 컨텍스트로 사용되지 않도록 제외하는 정책이다.",
      en: "A policy that excludes selected files or paths from being used as context by some Copilot features."
    },
    learnerNotes: {
      ko: "완전한 DLP가 아니라 표면별 제한이 있는 정책으로 이해해야 한다. 민감 정보는 저장소 관리와 권한 정책이 먼저다.",
      en: "Treat it as a scoped policy with surface-specific limits, not complete DLP. Repository hygiene and access control still come first."
    },
    related: ["public-code-matching", "custom-instructions"],
    keywords: ["content exclusion", "콘텐츠 제외", "excluded files", "policy"]
  },
  {
    id: "public-code-matching",
    term: { ko: "공개 코드 매칭", en: "Public code matching" },
    definition: {
      ko: "Copilot 제안이 공개 코드와 일치하거나 유사할 때 제안 허용 방식과 표시 방식을 제어하는 정책 영역이다.",
      en: "A policy area for controlling how Copilot handles suggestions that match or resemble public code."
    },
    learnerNotes: {
      ko: "라이선스와 코드 출처에 민감한 조직에서는 반드시 교육해야 한다. 정책 결정은 법무, 보안, 개발 리더가 함께 정한다.",
      en: "Teams sensitive to licensing and provenance must teach this explicitly. Policy should be agreed by legal, security, and engineering leadership."
    },
    related: ["content-exclusion", "code-scanning"],
    keywords: ["public code matching", "공개 코드", "license", "provenance"]
  },
  {
    id: "enterprise-data-protection",
    term: { ko: "엔터프라이즈 데이터 보호", en: "Enterprise data protection" },
    definition: {
      ko: "업무 또는 학교 계정으로 사용하는 Microsoft Copilot 데이터에 적용되는 상업용 데이터 보호와 계약적 통제다.",
      en: "Commercial data protection and contractual controls applied to Microsoft Copilot experiences used with work or school accounts."
    },
    learnerNotes: {
      ko: "개인 계정 Copilot과 업무 계정 Copilot Chat을 구분하는 핵심 개념이다. 로그인 계정과 데이터 경계를 먼저 확인한다.",
      en: "This is central to distinguishing personal Copilot from work-account Copilot Chat. Check account type and data boundaries first."
    },
    related: ["microsoft-graph", "purview"],
    keywords: ["enterprise data protection", "edp", "엔터프라이즈 데이터 보호", "work account"]
  },
  {
    id: "microsoft-graph",
    term: { ko: "Microsoft Graph", en: "Microsoft Graph" },
    definition: {
      ko: "Microsoft 365의 사용자, 문서, 메일, 일정, 채팅, 조직 관계 같은 업무 데이터를 연결하는 API와 데이터 계층이다.",
      en: "The API and data layer connecting Microsoft 365 work data such as users, documents, mail, calendar, chats, and organizational relationships."
    },
    learnerNotes: {
      ko: "Microsoft 365 Copilot grounding을 설명할 때 핵심이다. Copilot이 모든 데이터를 보는 것이 아니라 사용자의 권한 안에서 후보 컨텍스트가 생긴다.",
      en: "It is key to explaining Microsoft 365 Copilot grounding. Copilot does not see everything; it works within the user's permissions."
    },
    related: ["enterprise-data-protection", "copilot-studio"],
    keywords: ["Microsoft Graph", "graph grounding", "그래프", "tenant data"]
  },
  {
    id: "purview",
    term: { ko: "Microsoft Purview", en: "Microsoft Purview" },
    definition: {
      ko: "Microsoft 365 환경의 민감도 레이블, DLP, 감사, 보존, eDiscovery 같은 데이터 거버넌스 기능 집합이다.",
      en: "A Microsoft data governance suite covering sensitivity labels, DLP, audit, retention, eDiscovery, and related controls."
    },
    learnerNotes: {
      ko: "Copilot 도입 전 권한과 정보 보호 상태를 점검할 때 연결된다. 프롬프트 교육보다 데이터 거버넌스가 먼저인 경우가 많다.",
      en: "It connects to Copilot readiness because permissions and information protection often matter before prompt training."
    },
    related: ["enterprise-data-protection", "microsoft-graph"],
    keywords: ["Purview", "DLP", "sensitivity labels", "eDiscovery", "감사"]
  },
  {
    id: "copilot-studio",
    term: { ko: "Copilot Studio", en: "Copilot Studio" },
    definition: {
      ko: "조직이 업무용 에이전트와 Copilot 확장을 만들고 배포하며 데이터 연결과 승인 흐름을 관리하는 Microsoft 도구다.",
      en: "A Microsoft tool for creating and deploying work agents and Copilot extensions while managing data connections and approvals."
    },
    learnerNotes: {
      ko: "일반 Microsoft 365 Copilot 사용과 다르게 제작자, 관리자, 데이터 소스 책임이 생긴다. agent별 권한과 비용을 검토한다.",
      en: "Unlike ordinary Microsoft 365 Copilot use, it introduces maker, admin, and data-source responsibilities. Review per-agent permissions and cost."
    },
    related: ["custom-agents", "microsoft-graph"],
    keywords: ["Copilot Studio", "agent builder", "declarative agent", "커스텀 에이전트"]
  },
  {
    id: "custom-agents",
    term: { ko: "커스텀 에이전트", en: "Custom agents" },
    definition: {
      ko: "특정 역할, 도구, 지침, 지식 소스를 갖도록 구성한 맞춤형 AI 에이전트다.",
      en: "A tailored AI agent configured with a specific role, tools, instructions, and knowledge sources."
    },
    learnerNotes: {
      ko: "custom instructions보다 역할과 도구 구성이 강하고, skill보다 실행 주체에 가깝다. 팀 표준 역할을 만들 때 적합하다.",
      en: "It is stronger than custom instructions in role/tool setup and closer to the actor than a skill. Use it for standardized team roles."
    },
    related: ["agent", "agent-skill", "copilot-studio"],
    keywords: ["custom agent", "커스텀 에이전트", "role", "instructions"]
  },
  {
    id: "tool-approval",
    term: { ko: "도구 승인", en: "Tool approval" },
    definition: {
      ko: "AI가 파일 수정, 명령 실행, 외부 시스템 호출처럼 영향 있는 행동을 하기 전에 사용자가 허용 여부를 결정하는 게이트다.",
      en: "A gate where the user decides whether an AI may perform impactful actions such as file edits, command execution, or external calls."
    },
    learnerNotes: {
      ko: "승인은 귀찮은 팝업이 아니라 하네스의 일부다. 승인 전 어떤 파일, 명령, 데이터가 영향을 받는지 확인해야 한다.",
      en: "Approval is not a nuisance prompt; it is part of the harness. Before approving, inspect affected files, commands, and data."
    },
    related: ["tool-use", "terminal-sandboxing", "agent-mode"],
    keywords: ["approval", "tool approval", "승인", "permission", "gate"]
  },
  {
    id: "code-scanning",
    term: { ko: "코드 스캐닝", en: "Code scanning" },
    definition: {
      ko: "정적 분석이나 보안 규칙으로 코드의 취약점, 위험 패턴, 품질 문제를 자동 탐지하는 개발 보안 활동이다.",
      en: "A development security practice that uses static analysis or security rules to detect vulnerabilities, risky patterns, and quality issues."
    },
    learnerNotes: {
      ko: "Copilot review와 함께 쓰면 좋지만 대체 관계는 아니다. AI 리뷰, 코드 스캐닝, 사람 리뷰는 서로 다른 실패 모드를 잡는다.",
      en: "It pairs well with Copilot review but does not replace it. AI review, code scanning, and human review catch different failure modes."
    },
    related: ["public-code-matching", "evals"],
    keywords: ["code scanning", "security campaign", "보안 스캔", "static analysis"]
  }
];

export const resourceSections: ResourceSection[] = [
  {
    id: "official-docs",
    title: { ko: "공식 문서와 1차 출처", en: "Official docs and primary sources" },
    summary: {
      ko: "기능명, 권한 모델, 최신 제한 사항은 제품 문서에서 확인하고 학습 자료에는 확인 날짜를 남긴다.",
      en: "Use product docs for feature names, permission models, and current limits, then record the date checked in learning notes."
    },
    items: [
      {
        title: { ko: "Copilot 기능 기준선", en: "Copilot capability baseline" },
        description: {
          ko: "VS Code Chat, CLI, cloud agent, code review, MCP 문서를 함께 읽어 어느 화면에서 어떤 에이전트 기능을 쓰는지 구분한다.",
          en: "Read VS Code Chat, CLI, cloud agent, code review, and MCP docs together to separate which agent capability belongs in which surface."
        },
        actions: [
          {
            ko: "새 기능을 설명할 때 제품명, 실행 위치, 승인 방식, 출력물을 한 줄로 요약한다.",
            en: "For each new feature, summarize product name, runtime, approval model, and output in one line."
          }
        ],
        sourceRefIds: [
          "github-copilot-overview",
          "vscode-copilot-chat",
          "github-copilot-cloud-agent",
          "github-copilot-mcp"
        ]
      },
      {
        title: { ko: "MCP와 하네스 기준", en: "MCP and harness references" },
        description: {
          ko: "MCP는 연결 규격, 하네스는 실행 환경 설계라는 차이를 공식 소개와 실무 글을 함께 보며 정리한다.",
          en: "Contrast MCP as a connection protocol with harness engineering as execution-environment design by pairing official protocol docs with practice-oriented material."
        },
        actions: [
          {
            ko: "도구 추가 전 데이터 접근 범위, 쓰기 권한, 로그 위치, 실패 시 복구 방법을 문서화한다.",
            en: "Before adding a tool, document data scope, write permissions, log location, and recovery path."
          }
        ],
        sourceRefIds: ["mcp-intro", "openai-harness-engineering"]
      }
    ]
  },
  {
    id: "copilot-workflow-checklists",
    title: { ko: "Copilot 워크플로 체크리스트", en: "Copilot workflow checklists" },
    summary: {
      ko: "인라인 제안, Chat, agent mode, CLI, cloud agent를 작업 위험도와 검증 가능성에 맞춰 선택한다.",
      en: "Choose inline suggestions, Chat, agent mode, CLI, or cloud agent based on task risk and verifiability."
    },
    items: [
      {
        title: { ko: "IDE 작업 전 점검", en: "Before an IDE session" },
        description: {
          ko: "수정 범위, 관련 파일, 금지 파일, 실행할 테스트, 사람 승인이 필요한 명령을 먼저 적는다.",
          en: "Write down edit scope, relevant files, forbidden files, tests to run, and commands requiring human approval before starting."
        },
        actions: [
          {
            ko: "컨텍스트로 지정할 파일과 제외할 파일을 분리한다.",
            en: "Separate files to include as context from files that must stay out of scope."
          },
          {
            ko: "완료 조건을 테스트 명령 또는 리뷰 기준으로 표현한다.",
            en: "State completion criteria as a test command or review rubric."
          }
        ],
        sourceRefIds: ["vscode-copilot-chat", "vscode-prompt-files"]
      },
      {
        title: { ko: "Cloud/coding agent 작업 전 점검", en: "Before a cloud/coding-agent task" },
        description: {
          ko: "원격 에이전트에는 작고 검증 가능한 이슈를 맡기고, PR에서 사람이 변경 의도와 테스트 결과를 확인한다.",
          en: "Give remote agents small, verifiable issues, then have a human inspect intent and test evidence in the PR."
        },
        actions: [
          {
            ko: "이슈에 성공 기준, 허용 파일, 실행할 검증 명령을 포함한다.",
            en: "Include success criteria, allowed files, and verification commands in the issue."
          }
        ],
        sourceRefIds: ["github-copilot-cloud-agent", "github-copilot-code-review"]
      }
    ]
  },
  {
    id: "prompt-templates",
    title: { ko: "프롬프트 템플릿", en: "Prompt templates" },
    summary: {
      ko: "반복 가능한 요청 구조를 만들어 팀원이 같은 품질 기준으로 질문하고 결과를 비교하게 한다.",
      en: "Use repeatable request structures so teammates ask with the same quality bar and can compare outputs."
    },
    items: [
      {
        title: { ko: "코드 변경 요청", en: "Code-change request" },
        description: {
          ko: "목표, 소유 범위, 관련 파일, 제외 범위, 검증 명령, 응답 형식을 명시하는 기본 템플릿이다.",
          en: "A baseline template that states goal, owned scope, relevant files, excluded scope, verification command, and response format."
        },
        actions: [
          {
            ko: "목표: 무엇을 바꾸는가. 범위: 어떤 파일만 만지는가. 검증: 어떤 명령으로 확인하는가.",
            en: "Goal: what changes. Scope: which files may change. Verification: which command proves it."
          }
        ],
        sourceRefIds: ["vscode-prompt-files"]
      },
      {
        title: { ko: "학습 설명 요청", en: "Learning explanation request" },
        description: {
          ko: "대상 학습자, 선수 지식, 예시 수준, 용어 병기 방식, 확인 질문 수를 지정해 설명 품질을 안정화한다.",
          en: "Stabilize explanation quality by specifying learner profile, prerequisites, example level, bilingual terminology, and number of check questions."
        },
        actions: [
          {
            ko: "새 용어는 한국어 설명 뒤에 영어 원어를 괄호로 붙이고, 관련 용어 3개를 함께 제시한다.",
            en: "Show each new term with the English source term in parentheses and list three related concepts."
          }
        ]
      }
    ]
  },
  {
    id: "governance-security-checklist",
    title: { ko: "거버넌스와 보안 체크리스트", en: "Governance and security checklist" },
    summary: {
      ko: "AI 도구 도입 전 데이터 노출, 정책, 감사 가능성, 사람 승인 지점을 명확히 한다.",
      en: "Before adopting AI tools, clarify data exposure, policy, auditability, and human approval points."
    },
    items: [
      {
        title: { ko: "데이터 경계", en: "Data boundary" },
        description: {
          ko: "개인 계정, 업무 계정, 조직 정책, content exclusion이 어떤 데이터 흐름을 막거나 허용하는지 확인한다.",
          en: "Check how personal accounts, work accounts, organization policy, and content exclusion allow or block data flows."
        },
        actions: [
          {
            ko: "민감 저장소, 고객 데이터, 비밀값, 라이선스 제약 코드의 처리 기준을 별도로 둔다.",
            en: "Set separate handling rules for sensitive repositories, customer data, secrets, and license-constrained code."
          }
        ],
        sourceRefIds: [
          "github-content-exclusion-concept",
          "github-copilot-policies-org",
          "microsoft-365-copilot"
        ]
      },
      {
        title: { ko: "리뷰와 감사", en: "Review and audit" },
        description: {
          ko: "AI가 만든 변경은 자동 리뷰와 사람 리뷰를 분리하고, 최종 승인자는 테스트 근거와 정책 위반 가능성을 확인한다.",
          en: "Separate AI-assisted review from human review, and require the final approver to inspect test evidence and policy risks."
        },
        actions: [
          {
            ko: "PR 설명에 AI 사용 범위, 실행한 검증, 남은 위험을 기록한다.",
            en: "Record AI usage scope, verification performed, and residual risk in the PR description."
          }
        ],
        sourceRefIds: ["github-copilot-code-review"]
      }
    ]
  },
  {
    id: "practice-scenarios",
    title: { ko: "실습 시나리오", en: "Practice scenarios" },
    summary: {
      ko: "개념을 읽는 데서 끝내지 않고 작은 실무 상황으로 프롬프트, 컨텍스트, 도구, 평가를 연결한다.",
      en: "Move beyond reading concepts by connecting prompts, context, tools, and evals in small work-like scenarios."
    },
    items: [
      {
        title: { ko: "문서 기반 답변 개선", en: "Improve a grounded answer" },
        description: {
          ko: "짧은 정책 문서 3개를 주고 RAG식 근거 답변을 만들게 한 뒤, 누락 출처와 과잉 추론을 평가한다.",
          en: "Provide three short policy documents, ask for a grounded answer, then evaluate missing citations and over-inference."
        },
        actions: [
          {
            ko: "좋은 답변, 애매한 답변, 틀린 답변 예시를 만들어 평가 루브릭을 작성한다.",
            en: "Create examples of good, ambiguous, and wrong answers, then write an evaluation rubric."
          }
        ]
      },
      {
        title: { ko: "에이전트 작업 분해", en: "Decompose an agent task" },
        description: {
          ko: "버그 수정 요청을 조사, 구현, 테스트, 리뷰 단계로 나누고 각 단계에 필요한 도구와 중단 조건을 지정한다.",
          en: "Split a bug-fix request into research, implementation, testing, and review, then assign tools and stopping rules to each step."
        },
        actions: [
          {
            ko: "서브에이전트가 맡아도 되는 단계와 사람이 승인해야 하는 단계를 표시한다.",
            en: "Mark which steps can go to a subagent and which require human approval."
          }
        ]
      }
    ]
  }
];
