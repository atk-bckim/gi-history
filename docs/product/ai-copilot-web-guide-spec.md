---
작성일: 2026-06-22
최종수정: 2026-06-23
버전: v1.1
---

# AI Copilot Web Guide 종합 기획서

## 목차

| 섹션 | 줄 번호 |
|---|---|
| [개요](#개요) | L32 |
| [현재 구현 현황](#현재-구현-현황) | L40 |
| [제품 목표](#제품-목표) | L61 |
| [핵심 사용자와 성공 기준](#핵심-사용자와-성공-기준) | L75 |
| [정보 구조](#정보-구조) | L88 |
| [커리큘럼 구성](#커리큘럼-구성) | L110 |
| [디자인 방향](#디자인-방향) | L128 |
| [인터랙티브 학습 경험](#인터랙티브-학습-경험) | L145 |
| [AI 웹디자인 쇼케이스](#ai-웹디자인-쇼케이스) | L161 |
| [한영 언어 전환](#한영-언어-전환) | L177 |
| [기술 아키텍처](#기술-아키텍처) | L195 |
| [콘텐츠 신뢰성과 출처](#콘텐츠-신뢰성과-출처) | L216 |
| [MVP 범위](#mvp-범위) | L251 |
| [리스크와 운영 원칙](#리스크와-운영-원칙) | L268 |
| [최종 완성 로드맵](#최종-완성-로드맵) | L282 |
| [연관문서](#연관문서) | L322 |

---

## 개요

AI Copilot Web Guide는 AI 도구를 단순히 소개하는 문서 사이트가 아니라, 사용자가 GitHub Copilot과 최신 agentic AI 워크플로를 직접 이해하고 연습하는 전문 교육 웹이다. 기본 경험은 문서형 학습이지만, 핵심 개념은 슬라이드형 스토리텔링과 인터랙티브 시뮬레이션으로 설명한다.

첫 릴리스는 개발자 중심 MVP로 만든다. GitHub Copilot, VS Code Copilot, Copilot CLI, GitHub.com cloud/coding agent, PR 리뷰, MCP, agent skills, 보안/거버넌스를 깊게 다루고 Microsoft Copilot과 AI 웹디자인 쇼케이스는 확장 트랙으로 연결한다.

---

## 현재 구현 현황

2026-06-23 기준으로 Next.js 기반 MVP 골격과 핵심 콘텐츠/인터랙션은 구현되어 있다.

| 영역 | 상태 | 비고 |
|---|---|---|
| 한/영 라우팅 | 완료 | `/ko`, `/en` locale prefix, 같은 slug 유지 언어 전환, cookie와 `localStorage` locale 저장 |
| 홈 대시보드 | 완료 | 학습 경로, 추천 학습, 개념 흐름, 실습 준비도 제공 |
| GitHub Copilot 교육 | 완료 | overview, VS Code, CLI, cloud/coding agent, review/security/admin 정책 MDX 문서 연결. VS Code 표면 선택 매트릭스/컨텍스트 팩/agent-mode dry run, CLI 승인 매트릭스, cloud agent 이슈 브리프/PR 리뷰 계약/롤백, review 정책 매트릭스/보안 triage runbook 포함 |
| Microsoft Copilot | 완료 | Microsoft 365 Copilot와 governance 문서 연결. 부서별 rollout playbook, 회의 요약 프롬프트, connector 결정 등록부, Purview 증거 체크리스트, agent knowledge-source 검토 포함 |
| Agentic AI 개념 | 완료 | prompt, context, MCP, agents, skills, harness, loop 흐름 문서화. 딥 인터뷰 스크립트, 브레인스토밍 퍼널, 서브에이전트 위임 브리프, 하네스 준비도 스코어카드, Ralph Wiggum Loop 방지책 포함 |
| 인터랙티브 실습 | 완료 | Prompt Builder, Context Stack, Agent Loop, Quiz의 선택/피드백/완료 상태 구현. Workflow Simulator는 checkout 중복 제출 사고를 issue brief, context pack, agent-mode dry run, no-write investigation, approval gate, verification evidence, PR review contract까지 이어지는 end-to-end runbook으로 확장 |
| AI 웹디자인 쇼케이스 | MVP 완료 | 3D Digital Twin, 3D Semiconductor Design Explorer, Agentic Workflow Control Room을 모두 조작 가능한 쇼케이스로 제공. preview showcase에 Copilot prompt storyboard, MCP context map, agent review checklist, approval policy harness 설명 추가 |
| 문서 탐색성 | 완료 | 긴 lesson의 `##/###` heading 기반 우측 문서 목차, active section, 읽기 진행률, 앵커 이동 지원 |
| 용어집/자료실 | 완료 | 29개 핵심 용어, 공식 문서, 워크플로 체크리스트, 프롬프트 템플릿, 보안 체크리스트, 실습 시나리오, 한/영 정적 검색 |
| 검증 | 완료 | unit 45개, e2e 49개, `npm run lint`, `npm run typecheck`, `npm run build` 통과 |

현재 앱은 정적 교육 사이트로 동작한다. 외부 AI API, GitHub OAuth, DB 기반 진도 저장, 실제 산업 데이터 연동은 아직 포함하지 않는다.

---

## 제품 목표

| 목표 | 설명 |
|---|---|
| AI 도구 실무 교육 | 프롬프트 작성 수준을 넘어 컨텍스트, 도구, 에이전트, 평가, 루프 설계를 가르친다. |
| GitHub Copilot 중심성 | VS Code, CLI, GitHub.com, PR/code review, cloud agent를 하나의 개발 흐름으로 연결한다. |
| 전문 웹디자인 증명 | 교육 사이트 자체가 AI로 구현 가능한 고난도 인터랙티브 웹의 예시가 되게 한다. |
| 한/영 병행 학습 | 한국어로 이해하되 영어 원문 용어와 공식 문서를 함께 익히는 구조를 제공한다. |
| 최신성 유지 | Copilot, MCP, agent 관련 기능은 빠르게 바뀌므로 조사 기준일과 출처를 명시한다. |

제품의 핵심 메시지는 “AI를 잘 쓰는 사람은 프롬프트만 잘 쓰는 사람이 아니라, AI가 일할 수 있는 컨텍스트와 작업 환경을 설계하는 사람”이다.

---

## 핵심 사용자와 성공 기준

| 사용자 | 주요 니즈 | 성공 기준 |
|---|---|---|
| 개발자 | GitHub Copilot을 실제 개발 흐름에 깊게 적용 | VS Code, CLI, PR 리뷰, agent mode 차이를 설명하고 실습할 수 있다. |
| 기술 리더 | 팀의 AI 개발 워크플로 설계 | custom instructions, MCP, review policy, 보안 기준을 팀 단위로 정리할 수 있다. |
| 업무 사용자 | Microsoft Copilot과 AI 기본기 이해 | 업무/개인 계정 차이, Graph 기반 문맥, 프롬프트 구조를 설명할 수 있다. |
| 교육자/컨설턴트 | AI 교육 커리큘럼 구성 | 프롬프트에서 agentic workflow까지 단계별 교육안을 만들 수 있다. |

MVP의 우선순위는 개발자다. 나머지 사용자는 확장 트랙으로 수용하되, 첫 구현에서 개발자 학습 흐름을 약화시키지 않는다.

---

## 정보 구조

| 경로 | 역할 |
|---|---|
| `/ko`, `/en` | 언어별 홈 대시보드 |
| `/[locale]/paths` | 개발자, 기술 리더, 업무 사용자, 교육자별 학습 경로와 산출물/완료 증거 |
| `/[locale]/github-copilot` | GitHub Copilot 메인 허브 |
| `/[locale]/github-copilot/vscode` | VS Code Copilot, Chat, agent mode |
| `/[locale]/github-copilot/cli` | Copilot CLI, plan mode, tool approval, MCP |
| `/[locale]/github-copilot/agents` | cloud/coding agent, custom instructions, prompt files, skills |
| `/[locale]/github-copilot/review` | PR 리뷰, code review, 보안 검토 |
| `/[locale]/microsoft-copilot` | Microsoft Copilot와 Microsoft 365 Copilot 트랙 |
| `/[locale]/agentic-ai` | prompt, context, RAG, MCP, agents, harness, loop engineering |
| `/[locale]/labs` | Prompt Builder, workflow simulator, quiz, 실습실 |
| `/[locale]/showcase` | AI 웹디자인 쇼케이스 갤러리 |
| `/[locale]/glossary` | 한/영 용어집 |
| `/[locale]/resources` | 출처, 체크리스트, 템플릿 |

홈은 마케팅 랜딩이 아니라 학습 대시보드로 설계한다. 사용자는 현재 수준 진단, 추천 경로, 최근 학습 항목, 핵심 개념 맵, 대표 쇼케이스를 첫 화면에서 확인한다.

---

## 커리큘럼 구성

### GitHub Copilot 트랙

GitHub Copilot 트랙은 MVP의 중심이다. 설치와 기본 제안, VS Code Chat, inline chat, agent mode, Copilot CLI, GitHub.com cloud agent, PR/code review, custom instructions, prompt files, MCP, agent skills, 정책과 보안을 순서대로 다룬다.

핵심 구분은 반드시 명확히 한다. IDE agent mode는 로컬 개발환경에서 파일과 명령을 다루는 흐름이고, GitHub cloud/coding agent는 GitHub Actions 기반 원격 환경에서 이슈나 `/task`를 받아 브랜치와 PR을 만드는 흐름이다.

### Microsoft Copilot 트랙

Microsoft Copilot 트랙은 업무 생산성 확장 영역이다. Microsoft Copilot, Microsoft 365 Copilot Chat, Microsoft 365 Copilot, Copilot Studio를 구분하고 개인 계정과 업무/학교 계정, Entra ID, Microsoft Graph grounding, enterprise data protection, Purview와 관리센터 기반 거버넌스를 다룬다.

### Agentic AI 개념 트랙

개념 트랙은 연도별 진화와 실무 설계를 함께 보여준다. 2022년 ChatGPT와 prompt engineering, 2023년 function calling과 evals, 2024년 RAG와 MCP, 2025년 agents와 skills, 2026년 harness engineering과 loop engineering으로 흐름을 정리한다.

---

## 디자인 방향

디자인 thesis는 “차분한 전문 교육 플랫폼 위에 AI 작업대의 밀도와 고난도 인터랙션을 얹은 경험”이다. 문서형 신뢰감과 슬라이드형 몰입감을 조화시키고, 고급 시각 효과는 장식이 아니라 개념 이해를 돕는 도구로 사용한다.

| 요소 | 방향 |
|---|---|
| 레이아웃 | 문서 55%, 슬라이드형 스토리텔링 25%, 인터랙티브 랩 20% |
| 색상 | warm off-white, charcoal, GitHub dark neutral, Microsoft blue accent |
| 타이포그래피 | Pretendard 또는 Noto Sans KR, 코드/프롬프트는 JetBrains Mono |
| 형태 | 과한 카드 그리드 대신 섹션, 패널, 타임라인, 코드 diff, 노드 그래프 사용 |
| 모션 | 스크롤 기반 reveal, sticky storytelling, tool-call trace, hover affordance |
| 금지 | 추상 AI blob, 장식용 그라디언트, 마스코트 중심, generic SaaS 카드 모음 |

문서형 페이지는 왼쪽 커리큘럼 rail, 중앙 본문, 오른쪽 목차/진행률로 구성한다. 개념 페이지는 스크롤에 따라 `Prompt -> Context -> Tools/MCP -> Agent -> Harness -> Loop`가 단계적으로 펼쳐지는 슬라이드형 구성을 사용한다.

---

## 인터랙티브 학습 경험

| 기능 | 설명 | 학습 연결 |
|---|---|---|
| AI 도구 선택 진단 | 역할, 목표, 수준 기반으로 학습 경로 추천 | 입문 방향 설정 |
| Prompt Builder | 목표, 맥락, 제약, 출력형식을 조립하고 품질 피드백 제공 | prompt engineering |
| Context Stack | 파일, 선택 영역, 이슈, 문서, MCP 도구가 쌓이는 과정을 시각화 | context engineering |
| Copilot Workflow Simulator | 요구사항 -> context pack -> dry run -> no-write investigation -> approval -> verification -> PR review 흐름 실습 | GitHub Copilot 실무 |
| Agent Loop Visualizer | plan, act, observe, evaluate, revise 루프 표시 | agentic AI |
| MCP Map | GitHub, Docs, DB, Slack, Browser, Filesystem 연결 구조 표시 | MCP와 tool design |
| Quiz Engine | 개념 확인, 좋은/나쁜 프롬프트 비교, 보안 리스크 식별 | 학습 점검 |

초기 버전은 외부 AI API를 호출하지 않는다. 모든 상호작용은 정적 예시와 deterministic scoring으로 구현하고, 이후 실제 AI 연결은 별도 단계로 확장한다.

---

## AI 웹디자인 쇼케이스

쇼케이스 섹션의 목적은 “AI를 활용하면 이런 난이도의 웹도 만들 수 있다”를 직접 보여주는 것이다. 단순 포트폴리오가 아니라 각 예제를 교육 콘텐츠와 연결한다.

| 예제 | 핵심 경험 | 교육 연결 |
|---|---|---|
| 3D Digital Twin Command Center | 공장/반도체 라인/스마트빌딩의 3D 상태, 센서, 알람, KPI | context engineering, MCP, monitoring agents |
| 3D Semiconductor Design Explorer | wafer, die, layer, routing, defect marker, layer toggle | Copilot 기반 설계 검토, 복잡한 컨텍스트 구성 |
| Agentic Workflow Control Room | 조사, 구현, 리뷰, 테스트 agent의 trace와 승인 게이트 | subagent-driven development, harness, loop engineering |

MVP에서는 3D Digital Twin을 대표 경험으로 유지하되, Semiconductor Explorer와 Agent Control Room도 실제 조작 가능한 고난도 예제 페이지로 제공한다. 세 쇼케이스는 각각 3D 장면, 상태 제어, AI 분석 패널, Build Breakdown을 통해 “AI로 어려운 웹을 어디까지 만들 수 있는가”를 직접 보여준다.

각 쇼케이스 페이지는 `Experience`, `How AI Helped`, `Build Breakdown` 3단 구성으로 설계한다. 먼저 압도적인 인터랙티브 장면을 보여준 뒤, 어떤 프롬프트와 Copilot/MCP/agent workflow로 만들 수 있는지 설명하고, 마지막에 기술 구성과 확장 아이디어를 문서형으로 정리한다.

---

## 한영 언어 전환

언어 전환은 URL 기반 locale 구조로 구현한다. 기본 경로는 `/ko`와 `/en`이며, 모든 주요 페이지는 같은 slug를 공유한다.

| 항목 | 결정 |
|---|---|
| 기본 언어 | 한국어 |
| URL 구조 | `/ko/...`, `/en/...` |
| 토글 위치 | 상단 우측 `KO | EN`, 모바일은 메뉴 내부와 하단 action bar |
| 언어 저장 | cookie와 `localStorage` 병행 |
| 콘텐츠 구조 | `content/ko/...`, `content/en/...` 분리 |
| 용어집 | 영어 원어와 한국어 번역 병기 |
| 검색 | 한국어와 영어 키워드 모두 매칭하는 정적 클라이언트 검색 |

프롬프트 실습은 한국어/영어 탭을 제공한다. 사용자는 같은 요청을 두 언어로 비교하면서 Copilot 응답의 차이와 영어 원문 용어의 중요성을 이해한다.

---

## 기술 아키텍처

| 영역 | 기술 |
|---|---|
| App framework | Next.js App Router |
| Language | TypeScript |
| Content | MDX + typed metadata |
| Styling | Tailwind CSS |
| Motion | Framer Motion |
| 3D | Three.js 또는 React Three Fiber |
| Icons | lucide-react |
| State | React state + `localStorage` |
| Search | 정적 인덱스 기반 클라이언트 검색 |
| Testing | Playwright, Vitest, accessibility checks |

초기 구현은 정적 사이트로 시작한다. 로그인, 서버 DB, 외부 AI API 호출, 사용자 계정 기반 진도 저장은 MVP에서 제외하고, 브라우저 저장소 기반 진행률만 제공한다.

콘텐츠 파일은 locale별 MDX로 분리한다. 공통 메타데이터와 navigation map은 TypeScript 상수로 관리하고, locale과 slug 매칭 오류를 테스트로 검증한다.

---

## 콘텐츠 신뢰성과 출처

Copilot, MCP, agent 기능은 빠르게 변경된다. 모든 기능 설명 페이지에는 조사 기준일을 표시하고 공식 문서 링크를 함께 제공한다.

주요 출처 그룹은 다음과 같다.

| 그룹 | 출처 |
|---|---|
| GitHub Copilot | GitHub Docs, GitHub Blog Changelog, VS Code Docs |
| Microsoft Copilot | Microsoft Learn, Microsoft Support, Microsoft 365 admin docs |
| MCP | Model Context Protocol specification |
| Agentic AI | OpenAI docs/blog, Anthropic engineering/research, 주요 RAG/agent 논문 |
| UX/AI 리서치 | Nielsen Norman Group 등 신뢰 가능한 UX 자료 |

핵심 참고 URL은 다음과 같다.

| 주제 | URL |
|---|---|
| GitHub Copilot 개요 | https://docs.github.com/en/copilot/get-started/what-is-github-copilot |
| VS Code Copilot Chat | https://code.visualstudio.com/docs/chat/copilot-chat |
| GitHub Copilot cloud agent | https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent |
| GitHub Copilot CLI | https://docs.github.com/copilot/concepts/agents/about-copilot-cli |
| GitHub Copilot MCP | https://docs.github.com/en/copilot/concepts/context/mcp |
| MCP specification | https://modelcontextprotocol.io/docs/getting-started/intro |
| Microsoft 365 Copilot | https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-overview |
| Microsoft enterprise data protection | https://learn.microsoft.com/en-us/microsoft-365/copilot/enterprise-data-protection |
| OpenAI prompt engineering | https://developers.openai.com/api/docs/guides/prompt-engineering |
| OpenAI harness engineering | https://openai.com/index/harness-engineering/ |
| Anthropic effective agents | https://www.anthropic.com/research/building-effective-agents |
| Anthropic Model Context Protocol | https://www.anthropic.com/news/model-context-protocol |

문서에는 “작성일 기준”을 명시한다. 배포 전에는 GitHub Copilot CLI, cloud agent, MCP, agent skills, Microsoft Copilot licensing과 데이터 보호 정책을 다시 확인한다.

---

## MVP 범위

| 포함 | 제외 |
|---|---|
| 홈 학습 대시보드 | 사용자 계정/로그인 |
| GitHub Copilot 핵심 과정 7개 | 실제 AI API 호출 |
| Agentic AI 개념 페이지 | 서버 DB 기반 진도 저장 |
| Prompt Builder | 유료 결제 |
| Copilot Workflow Simulator | 실제 GitHub OAuth 연결 |
| 3D Digital Twin, Semiconductor, Agentic Workflow 쇼케이스 | 실제 산업 데이터 연동 |
| 한/영 토글과 locale 라우팅 | 전체 콘텐츠 완전 번역 자동화 |
| 용어집과 리소스 페이지 | 운영자 CMS |

MVP는 “완성된 작은 제품”이어야 한다. 전체 백과사전식 얕은 페이지보다 GitHub Copilot 중심 학습 경험과 세 대표 쇼케이스의 완성도를 우선한다.

---

## 리스크와 운영 원칙

| 리스크 | 대응 |
|---|---|
| Copilot 기능 변화 | 배포 전 공식 문서 재검증, 페이지별 조사 기준일 표기 |
| 3D 성능 저하 | 모바일 fallback, reduced motion, lazy loading 적용 |
| 콘텐츠 범위 과대 | MVP는 GitHub Copilot과 대표 쇼케이스에 집중 |
| 번역 품질 불균형 | 한국어를 기준 콘텐츠로 두고 영어는 원문 용어 중심으로 관리 |
| 교육과 데모의 분리 | 모든 쇼케이스에 How AI Helped와 Build Breakdown 섹션 포함 |

운영 원칙은 명확하다. 정확한 문서형 교육이 기본이고, 고급 인터랙션은 사용자의 이해와 설득을 돕는 경우에만 넣는다.

---

## 최종 완성 로드맵

상세한 단계별 완성 계획은 `docs/product/final-completion-roadmap.md`에 별도 문서로 유지한다. 이 문서에서는 제품 관점의 단계만 요약한다.

### 1단계: MVP 품질 고정

| 작업 | 산출물 |
|---|---|
| 모바일/태블릿 전체 route 재검수 | common viewport별 스크린샷과 수정 목록 |
| 키보드 접근성 확인 | header, locale toggle, lab controls, quiz, showcase controls 검증 |
| 문서 페이지 진행률 강화 | 현재 목차에 읽기 진행률과 active section 표시 추가 완료. 모바일 목차 UX는 계속 점검 |
| e2e 범위 유지/확장 | route, locale preference, glossary/resources, responsive visual, keyboard 접근성 흐름 유지 |

### 2단계: 쇼케이스 완성도 고정

| 작업 | 산출물 |
|---|---|
| 쇼케이스 접근성 보강 | 3D 대체 설명, 키보드 조작 경로, reduced-motion 동작 검증 |
| 쇼케이스 Build Breakdown 확장 | 어떤 Copilot/agent workflow로 만들었는지 단계별 설명 |
| 시각 회귀 기준 수립 | desktop/mobile 스크린샷 기준 이미지와 점검 절차 |

### 3단계: 실제 AI 기능 연결

| 작업 | 산출물 |
|---|---|
| API 기반 Prompt Evaluator | deterministic scoring과 실제 AI 피드백 비교 |
| GitHub 예제 workflow 연결 | 실제 repo/PR을 쓰기 전 mock OAuth 또는 sandbox flow |
| MCP simulator 확장 | 읽기/쓰기 권한, 승인, 로그, 실패 모드 실습 |

### 4단계: 운영형 제품화

| 작업 | 산출물 |
|---|---|
| 사용자 진도 저장 | 계정 또는 브라우저 기반 progress model |
| 팀 교육 모드 | 관리자용 curriculum assignment와 completion report |
| 콘텐츠 업데이트 체계 | Copilot/Microsoft/MCP 공식 문서 변경 주기 점검 |
| 배포 준비 | 성능, 접근성, SEO, Open Graph, sitemap, robots, 보안 헤더, release checklist |

---

## 연관문서

| 문서 | 경로 | 설명 |
|---|---|---|
| AI Copilot Web Guide 구현 계획 | `../superpowers/plans/2026-06-22-ai-copilot-web-guide.md` | 본 기획서를 구현하기 위한 단계별 계획 |
| AI Copilot Web Guide 최종 완성 로드맵 | `./final-completion-roadmap.md` | 현재 상태 이후 남은 단계와 품질 게이트 |
