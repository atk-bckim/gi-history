---
작성일: 2026-06-23
최종수정: 2026-06-23
버전: v1.0
---

# AI Copilot Web Guide 릴리스 체크리스트

## 목차

| 섹션 | 줄 번호 |
|---|---|
| [개요](#개요) | L24 |
| [출시 게이트](#출시-게이트) | L30 |
| [검증 명령](#검증-명령) | L47 |
| [알려진 제한사항](#알려진-제한사항) | L63 |
| [공식 문서 재검증](#공식-문서-재검증) | L76 |
| [롤백 기준](#롤백-기준) | L92 |
| [다음 단계 후보](#다음-단계-후보) | L106 |
| [연관문서](#연관문서) | L119 |

---

## 개요

이 문서는 AI Copilot Web Guide MVP를 공개 가능한 정적 교육 사이트로 출시하기 전 확인할 릴리스 기준을 정리한다. 범위는 앱 코드 변경이 아니라 출시 판단, 검증 증거, 알려진 제한사항, 롤백 기준, 후속 후보를 한곳에 모으는 운영 문서다.

---

## 출시 게이트

릴리스 담당자는 아래 출시 게이트를 모두 통과한 뒤 배포 태그 또는 배포 승인으로 넘어간다.

| 게이트 | 통과 기준 | 증거 |
|---|---|---|
| 콘텐츠 정확성 | GitHub Copilot, VS Code Copilot, Copilot CLI, cloud/coding agent, Microsoft Copilot, MCP 관련 빠른 변경 항목을 공식 출처로 재확인했다. | 재검증 날짜와 변경 여부 메모 |
| 정적 MVP 범위 | 외부 AI API, 로그인, DB 기반 진도 동기화, 실제 산업 데이터 연동이 없음을 제품 문서와 릴리스 노트에 명시했다. | 이 문서의 알려진 제한사항 섹션 |
| 한/영 라우팅 | `/ko`와 `/en` 핵심 route가 같은 slug로 렌더링되고 locale 전환이 유지된다. | smoke 또는 e2e 결과 |
| 학습 인터랙션 | Prompt Builder, Context Stack, Workflow Simulator, Agent Loop, Quiz가 빈 상태, 선택 상태, 완료 상태를 처리한다. | unit/e2e 결과 |
| 접근성 | header, locale toggle, lesson 목차, lab controls, quiz, showcase controls를 키보드로 조작할 수 있다. | accessibility/e2e 결과 |
| 쇼케이스 | 3D Digital Twin, Semiconductor Explorer, Agentic Workflow Control Room이 desktop에서 nonblank이고 mobile fallback 또는 responsive layout을 제공한다. | 스크린샷 또는 e2e 결과 |
| 빌드 | lint, typecheck, unit, e2e, production build가 통과한다. | 명령 출력 로그 |
| 문서 링크 | `docs/index.md`와 상세문서 연관문서의 상대 경로가 실제 파일을 가리킨다. | 상대 링크 체크 결과 |

---

## 검증 명령

릴리스 직전 검증 명령은 빠른 문서 게이트와 전체 앱 게이트를 구분해서 실행한다.

| 목적 | 명령 | 완료 기준 |
|---|---|---|
| 릴리스 문서 테스트 | `npm test -- tests/docs-launch.test.ts` | 릴리스 문서가 존재하고 필수 한국어 문구를 포함한다. |
| 문서 상대 링크 체크 | `node --input-type=module -e "<docs relative-link check>"` | `docs/` 내부 Markdown 상대 링크가 모두 존재한다. |
| 전체 unit 테스트 | `npm test` | Vitest 테스트가 통과한다. |
| 정적 분석 | `npm run lint` | ESLint 오류가 없다. |
| 타입 검증 | `npm run typecheck` | TypeScript 오류가 없다. |
| production build | `npm run build` | Next.js production build가 성공한다. |
| 브라우저 회귀 | `npm run test:e2e` | 핵심 route, locale, 접근성, responsive 시나리오가 통과한다. |

---

## 알려진 제한사항

MVP는 정적 교육 사이트로 출시한다. 아래 알려진 제한사항은 버그가 아니라 첫 릴리스의 의도적 범위 제외 항목이다.

| 제한사항 | 현재 동작 | 출시 시 표기 |
|---|---|---|
| 외부 AI API 없음 | Prompt Builder, Workflow Simulator, Quiz는 deterministic 예시와 점수 계산으로 동작한다. | 실제 AI 응답이 아니라 교육용 시뮬레이션임을 명시한다. |
| 로그인 없음 | GitHub OAuth, Microsoft Entra ID, 사용자 계정 생성이 없다. | 개인별 서버 계정 기능이 없음을 명시한다. |
| DB 진도 동기화 없음 | 진행률과 locale 선호는 브라우저 저장소 중심으로 유지되며 서버 DB sync가 없다. | 기기 간 학습 진도 동기화가 없음을 명시한다. |
| 실제 산업 데이터 통합 없음 | 3D Digital Twin과 Semiconductor Explorer는 샘플 상태와 가상 지표를 사용한다. | 운영 현장 데이터나 설계 데이터 연결이 아님을 명시한다. |

---

## 공식 문서 재검증

출시 직전 공식 문서 재검증은 기능명, 플랜명, 권한 모델, 보안 정책처럼 변경 가능성이 높은 항목을 중심으로 수행한다.

| 대상 | 확인 항목 | 결과 기록 |
|---|---|---|
| GitHub Copilot plans | Free, Pro, Pro+, Business, Enterprise 구분과 기능 차이 | 변경 여부와 조사 기준일 |
| VS Code Copilot | Chat, inline chat, edit/agent mode, workspace trust, content exclusion | 변경 여부와 조사 기준일 |
| Copilot CLI | plan/apply 흐름, tool approval, MCP 연결, 제한사항 | 변경 여부와 조사 기준일 |
| GitHub cloud/coding agent | issue assignment, `/task`, Actions 환경, PR 생성 흐름 | 변경 여부와 조사 기준일 |
| PR/code review | review surface, security/code scanning 연동, enterprise 정책 | 변경 여부와 조사 기준일 |
| Microsoft Copilot | Microsoft 365 Copilot Chat, Graph grounding, enterprise data protection, Purview, Copilot Studio | 변경 여부와 조사 기준일 |
| MCP | spec 버전, server/tool/resource/prompt 개념, 인증과 권한 모델 | 변경 여부와 조사 기준일 |

---

## 롤백 기준

배포 후 아래 조건 중 하나라도 발생하면 즉시 이전 안정 버전으로 되돌리고, 문제 범위를 문서화한 뒤 재출시한다.

| 기준 | 판단 방법 | 조치 |
|---|---|---|
| production build 실패 | 배포 환경에서 build 또는 start 단계가 실패한다. | 배포 중단 후 이전 artifact 사용 |
| 핵심 route 404 | `/ko`, `/en`, Copilot, Agentic AI, labs, showcase, resources 중 하나가 접근 불가다. | 이전 배포로 롤백 |
| 학습 인터랙션 중단 | Prompt Builder, Workflow Simulator, Quiz 중 하나가 기본 조작에서 런타임 오류를 낸다. | 이전 배포로 롤백 후 재현 테스트 추가 |
| 잘못된 최신 정보 | 공식 문서 재검증 결과와 다른 플랜, 권한, 보안 설명이 공개 페이지에 남아 있다. | 공개 중단 또는 hotfix 후 재배포 |
| 모바일 레이아웃 붕괴 | 주요 route에서 텍스트 겹침, 가로 스크롤, 조작 불가가 반복된다. | 이전 배포로 롤백 후 responsive 수정 |

---

## 다음 단계 후보

MVP 출시 후 다음 단계 후보는 알려진 제한사항을 해소하는 방향과 교육 품질을 높이는 방향으로 나눈다.

| 후보 | 목적 | 선행 조건 |
|---|---|---|
| 실제 AI 피드백 연결 | Prompt Builder와 Workflow Simulator에 API 기반 피드백을 추가한다. | 비용/보안 정책, abuse 방지, fallback 설계 |
| 계정 기반 진도 저장 | 사용자가 여러 기기에서 학습 진도를 이어간다. | 로그인 방식, DB schema, 개인정보 처리 기준 |
| 산업 데이터 샘플팩 | Digital Twin과 Semiconductor 예제를 더 현실적인 공개 샘플 데이터로 확장한다. | 데이터 라이선스와 익명화 기준 |
| 공식 문서 변경 감시 | Copilot, Microsoft Copilot, MCP 변경을 주기적으로 점검한다. | 재검증 주기와 담당자 지정 |

---

## 연관문서

| 문서 | 경로 | 설명 |
|---|---|---|
| AI Copilot Web Guide 종합 기획서 | `./ai-copilot-web-guide-spec.md` | MVP 범위와 제품 방향 |
| AI Copilot Web Guide 최종 완성 로드맵 | `./final-completion-roadmap.md` | 출시 이후 완성 단계와 품질 게이트 |
