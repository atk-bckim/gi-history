---
작성일: 2026-06-23
최종수정: 2026-06-23
버전: v1.0
---

# AI Copilot Web Guide 최종 완성 로드맵

## 목차

| 섹션 | 줄 번호 |
|---|---|
| [개요](#개요) | L24 |
| [현재 기준선](#현재-기준선) | L32 |
| [완성 정의](#완성-정의) | L51 |
| [최종 완성 단계](#최종-완성-단계) | L66 |
| [서브에이전트 운영 계획](#서브에이전트-운영-계획) | L107 |
| [품질 게이트](#품질-게이트) | L123 |
| [출시 전 재검증 항목](#출시-전-재검증-항목) | L138 |
| [연관문서](#연관문서) | L154 |

---

## 개요

이 문서는 지금까지 논의한 AI Copilot Web Guide의 제품 방향, 디자인 방향, 콘텐츠 범위, 인터랙티브 학습, AI 웹디자인 예제, 한/영 전환 요구사항을 최종 완성 단계로 재정리한다.

현재 앱은 개발자 중심 MVP 기준을 충족하는 정적 교육 사이트다. 다음 단계의 목표는 “보기 좋은 데모”가 아니라, GitHub Copilot과 agentic AI를 실제 업무에 적용할 수 있도록 콘텐츠 깊이, 접근성, 검증, 운영 체계를 완성하는 것이다.

---

## 현재 기준선

| 영역 | 현재 상태 | 다음 판단 |
|---|---|---|
| 앱 구조 | Next.js App Router, TypeScript, Tailwind, MDX, Framer Motion, React Three Fiber 기반 | 현재 스택 유지 |
| 언어 구조 | `/ko`, `/en` locale 라우팅, 같은 slug 유지 전환, cookie/localStorage 선호 언어 저장, canonical/hreflang metadata | 배포 도메인 확정 시 metadataBase 교체 |
| 교육 콘텐츠 | 7개 핵심 모듈, 14개 한/영 MDX lesson, 문서별 sourceRefs와 조사 기준일. VS Code, CLI, cloud agent, review/security/admin, Microsoft Copilot, Agentic AI는 운영 산출물까지 확장 | end-to-end 통합 run 추가 |
| GitHub Copilot | overview, VS Code, CLI, cloud/coding agent, review/security/admin | 출시 전 공식 문서 재검증 필수 |
| Microsoft Copilot | Microsoft 365 Copilot, Graph grounding, enterprise data protection, governance, connector 결정, Purview evidence, agent knowledge-source review | Copilot Studio 실무 예제 확장 |
| Agentic AI | prompt, context, RAG, MCP, agents, skills, harness, loop engineering, deep interview, brainstorming funnel, subagent delegation brief | emerging practice 표현 유지 |
| 인터랙티브 실습 | Prompt Builder, Context Stack, Workflow Simulator end-to-end runbook, Agent Loop, Quiz | 키보드/a11y와 실습 시나리오 강화 |
| AI 웹디자인 쇼케이스 | 3D Digital Twin, 3D Semiconductor Explorer, Agentic Workflow Control Room | Build Breakdown과 접근성 보강 |
| 검색/자료 | 29개 용어, 자료실 정적 검색, 공식 출처 색인 | 검색 UX와 태그 필터 확장 후보 |
| 검증 | unit 45개, e2e 49개, lint/typecheck/build 통과. keyboard/a11y 핵심 흐름과 VS Code/review/Agentic/Microsoft/paths 모바일 overflow, SEO route 회귀 포함 | 시각 회귀 기준 강화 |

MVP는 외부 AI API, GitHub OAuth, 로그인, DB 저장, 실제 산업 데이터 연동을 의도적으로 제외한다. 교육 흐름은 정적 예시와 deterministic scoring으로 검증 가능하게 유지한다.

---

## 완성 정의

최종 완성은 모든 아이디어를 넣는 것이 아니라, 교육 사이트로서 신뢰성과 반복 사용성을 갖춘 상태를 뜻한다.

| 기준 | 완료 조건 |
|---|---|
| 교육 깊이 | Copilot surface별 차이, 계정/정책/보안, 컨텍스트 설계, MCP, agent loop를 사례로 설명한다. |
| 학습 경험 | 사용자가 문서 읽기, 슬라이드형 개념 이해, 실습, 퀴즈, 쇼케이스를 한 흐름으로 경험한다. |
| 디자인 완성도 | 문서형 안정감과 인터랙티브 데모의 몰입감을 모두 갖추되, 과한 장식 대신 학습 목적에 맞춘다. |
| 한/영 품질 | 한국어 설명과 영어 원문 용어가 함께 작동하고, locale 전환이 주요 페이지에서 끊기지 않는다. |
| 신뢰성 | 빠르게 바뀌는 기능에는 조사 기준일과 공식 출처를 표시하고, 출시 전 재검증한다. |
| 운영 가능성 | 검증 명령, 체크리스트, 문서 인덱스, 알려진 제한사항이 남아 후속 유지보수가 가능하다. |

---

## 최종 완성 단계

### 1단계: MVP 안정화

| 작업 | 산출물 | 우선순위 |
|---|---|---|
| 접근성 점검 | header, locale toggle, lab, quiz, showcase keyboard flow 기본 검증 완료. screen-reader 상세 audit 확장 | 높음 |
| 문서 목차 개선 | active section과 reading progress 완료. 모바일 목차 UX 추가 개선 | 높음 |
| 시각 QA 확대 | 홈, Copilot overview, labs, resources, 3D showcase desktop/mobile 스크린샷 | 높음 |
| route 회귀 방지 | 모든 `/ko`/`/en` 핵심 route smoke와 locale preference 테스트 유지 | 높음 |

### 2단계: 콘텐츠 깊이 확장

| 작업 | 산출물 | 우선순위 |
|---|---|---|
| GitHub Copilot worked run | VS Code context pack와 agent-mode dry run, CLI no-write investigation, tool approval, cloud-agent issue brief, PR review contract, rollback 예시 완료. end-to-end 통합 run 확장 | 높음 |
| Copilot 정책 매트릭스 | Review/security/admin lesson에 정책 매트릭스, security triage runbook, automatic review rollout, exception register 추가 완료. 개인/Business/Enterprise 비교 확장 | 높음 |
| MCP/skills/harness/loop 심화 | tool approval, sandboxing, evaluation harness, Ralph Wiggum Loop 주의점 | 중간 |
| Microsoft Copilot 사례 | Graph grounding, Purview, Copilot Studio agent, Teams recap, connector 결정 등록부, rollout playbook 예시 완료 | 중간 |
| Deep interview/brainstorming skill | 요구사항 수집, 딥 인터뷰 스크립트, 브레인스토밍 퍼널, 서브에이전트 위임 브리프, 하네스 스코어카드 완료 | 중간 |

### 3단계: 쇼케이스 완성도 고정

| 작업 | 산출물 | 우선순위 |
|---|---|---|
| Digital Twin 설명 강화 | 센서, 알람, KPI, agent monitoring과 연결한 Build Breakdown | 높음 |
| Semiconductor Explorer 설명 강화 | wafer/layer/routing/defect context를 Copilot 검토 흐름과 연결 | 중간 |
| Agent Control Room 설명 강화 | subagent-driven development, approval gate, loop engineering trace 설명 | 높음 |
| 대체 경험 | 3D 비지원/모바일/reduced-motion 환경의 텍스트와 조작 fallback | 높음 |

### 4단계: 출시 준비와 운영화

| 작업 | 산출물 | 우선순위 |
|---|---|---|
| 공식 문서 재검증 | GitHub, VS Code, Microsoft Learn, MCP 주요 링크 기준일 갱신 | 높음 |
| 배포 준비 | production metadata, SEO, Open Graph, robots, sitemap, security headers 완료. 실제 배포 도메인 확정 시 URL 교체 | 중간 |
| 제한사항 문서화 | 외부 AI API 미사용, 실데이터 미연동, 로그인 없음, DB 진도 동기화 없음 명시 완료 | 높음 |
| 릴리스 체크리스트 | 출시 게이트, 검증 명령, 알려진 제한사항, 롤백 기준, 후속 단계 문서 완료 | 높음 |

---

## 서브에이전트 운영 계획

최종 완성까지는 병렬 조사와 검증이 효과적이다. 단, 서로 같은 파일을 동시에 수정하지 않도록 역할과 산출물을 분리한다.

| 역할 | 담당 범위 | 산출물 |
|---|---|---|
| 콘텐츠 리서처 | GitHub Copilot, VS Code, CLI, cloud agent, Microsoft Copilot 공식 문서 재확인 | sourceRefs 갱신 후보와 변경 리스크 |
| 교육 설계자 | prompt, context, MCP, agent skills, harness, loop curriculum 순서 정리 | lesson outline과 실습 시나리오 |
| UX/인터랙션 디자이너 | 문서형/슬라이드형 조합, lab feedback, 쇼케이스 fallback | 화면별 개선안 |
| QA 엔지니어 | e2e, responsive, accessibility, locale preference 검증 | 실패 재현과 테스트 보강 |
| 구현 에이전트 | 합의된 작은 단위 수정 | 코드 변경과 검증 로그 |

메인 에이전트는 최종 통합자 역할을 맡는다. 서브에이전트는 조사, 테스트, 독립 컴포넌트 보강처럼 충돌 가능성이 낮은 작업에 배치하고, 공통 registry나 layout 변경은 메인에서 통합한다.

---

## 품질 게이트

각 단계 완료 전 아래 기준을 통과해야 다음 단계로 넘어간다.

| 게이트 | 기준 |
|---|---|
| 콘텐츠 게이트 | 모든 source-sensitive lesson에 조사 기준일과 sourceRefs가 있다. |
| 언어 게이트 | 핵심 route가 `/ko`와 `/en`에서 모두 렌더링되고, 토글 후 같은 slug를 유지한다. |
| 상호작용 게이트 | Prompt Builder, Context Stack, Workflow Simulator, Agent Loop, Quiz가 빈 상태, 선택 상태, 완료 상태를 처리하고, Copilot Workflow Simulator가 실제 실습 산출물과 검증 증거를 보여준다. |
| 쇼케이스 게이트 | 3D/그래프 장면이 desktop에서 nonblank이고 mobile fallback 또는 responsive layout이 동작한다. |
| 접근성 게이트 | 주요 버튼, 토글, quiz, lab controls가 키보드로 조작 가능하고 색상만으로 상태를 전달하지 않는다. |
| 빌드 게이트 | `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:e2e`가 통과한다. |

---

## 출시 전 재검증 항목

출시 직전에는 빠르게 변하는 항목을 공식 문서 기준으로 다시 확인한다.

| 항목 | 확인할 내용 |
|---|---|
| GitHub Copilot plans | Free, Pro, Pro+, Business, Enterprise 구분과 기능 차이 |
| VS Code Copilot | Chat, inline chat, edit/agent mode, workspace trust, content exclusion |
| Copilot CLI | plan/apply 흐름, tool approval, MCP 연결, 제한사항 |
| GitHub cloud/coding agent | issue assignment, `/task`, Actions 환경, PR 생성 흐름 |
| PR/code review | review surface, security/code scanning 연동, enterprise 정책 |
| Microsoft Copilot | Microsoft 365 Copilot Chat, Graph grounding, EDP, Purview, Copilot Studio |
| MCP | spec 버전, server/tool/resource/prompt 개념, 인증과 권한 모델 |

---

## 연관문서

| 문서 | 경로 | 설명 |
|---|---|---|
| AI Copilot Web Guide 종합 기획서 | `./ai-copilot-web-guide-spec.md` | 제품 방향과 요구사항 |
| AI Copilot Web Guide 구현 계획 | `../superpowers/plans/2026-06-22-ai-copilot-web-guide.md` | 작업 단위 구현 체크리스트 |
| AI Copilot Web Guide 릴리스 체크리스트 | `./release-checklist.md` | 출시 게이트와 알려진 제한사항 |
