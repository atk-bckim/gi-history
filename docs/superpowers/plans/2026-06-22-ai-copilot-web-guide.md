# AI Copilot Web Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual Korean/English AI education web guide centered on GitHub Copilot, with interactive learning labs and three high-impact AI web design showcases.

**Architecture:** Use a static-first Next.js App Router application with locale-prefixed routes, MDX-based content, typed content metadata, reusable learning components, and client-only interactive labs. Keep user progress in `localStorage`; defer external AI APIs, authentication, database persistence, and real industrial data integration until after MVP.

**Tech Stack:** Next.js, TypeScript, MDX, Tailwind CSS, Framer Motion, React Three Fiber/Three.js, lucide-react, Vitest, Playwright.

---

## Current Status - 2026-06-23

Tracking note: this table and the Remaining Completion Plan are the authoritative current status. The detailed checkbox tasks below are retained as the original implementation checklist for traceability and should not be read as the live completion source of truth.

| Area | Status | Notes |
|---|---|---|
| Scaffold and stack | Done | Next.js 16, React 19, TypeScript, Tailwind, Vitest, Playwright, React Three Fiber |
| Locale routing | Done | `/ko` and `/en` route trees, locale toggle preserves slug and stores last locale in cookie/localStorage |
| Content system | Done for MVP | Typed registry plus 14 bilingual MDX lesson files loaded into lesson pages, with sourceRefs preserved from MDX frontmatter |
| GitHub Copilot track | Done for MVP | Overview, VS Code surface matrix/context pack/dry run, CLI approval matrix, cloud/coding agent issue brief, PR review contract, rollback, code review/security/admin policy matrix |
| Microsoft Copilot track | Done for MVP | Governance-focused Microsoft 365 Copilot lesson with rollout playbook, meeting recap prompt, connector decision register, Purview evidence checklist, and agent knowledge-source review |
| Agentic AI track | Done for MVP | Prompt, context, MCP, agents, skills, harness engineering, loop engineering, deep interview script, brainstorming funnel, subagent delegation brief, and Ralph Wiggum Loop safeguards |
| Interactive labs | Done for MVP | Prompt Builder, Context Stack, Workflow Simulator end-to-end Copilot runbook, Agent Loop Visualizer, Quiz with selected-state feedback and scoring |
| AI web showcase | Done for MVP | 3D Digital Twin, Semiconductor Design Explorer, and Agentic Workflow Control Room are interactive showcase pages with AI/Copilot workflow build notes |
| Lesson navigation | Done for MVP | MDX heading anchors plus right-side table of contents, active section, and reading progress for long lessons |
| Glossary and resources | Done for MVP | 29 learner-focused terms plus official docs, workflow checklists, prompt templates, governance/security, practice scenarios, and static bilingual search |
| E2E automation | Done for MVP | Playwright covers key routes, MDX rendering, labs, locale preference, resources/search, responsive checks, keyboard/a11y flows, digital twin, and advanced showcase pages |
| Validation | Passing | Unit 45 tests, e2e 49 tests, `npm run lint`, `npm run typecheck`, `npm run build` |

## Remaining Completion Plan

1. **MVP hardening**
   - Preserve Playwright coverage for glossary, resources, and route-level locale switching as routes evolve.
   - Extend keyboard/a11y checks beyond the current header, locale toggle, lab controls, quiz answers, lesson ToC, and showcase controls.
   - Continue polishing the lesson table of contents now that active section and reading progress indicators are implemented.

2. **Content depth**
   - Extend the completed VS Code context pack/dry run, CLI no-write investigation, cloud-agent issue brief, PR review contract, rollback, and review triage examples into one end-to-end worked run.
   - Expand the completed review policy matrix, security triage runbook, automatic review rollout, and exception register with Copilot Business/Enterprise comparisons.
   - Recheck official docs for GitHub Copilot CLI, cloud agent, MCP, agent skills, code review, Microsoft Copilot licensing, connectors, Purview, and Copilot Studio immediately before launch.
   - Keep every source-sensitive page marked with investigation date.
   - Expand deep-interview, brainstorming, subagent-driven development, harness engineering, and loop engineering examples.

3. **Showcase polish**
   - Add keyboard and screen-reader fallbacks for 3D and graph-heavy controls.
   - Continue expanding Build Breakdown sections now that preview showcases include Copilot storyboard, MCP context map, agent review checklist, dispatch plan, approval harness, and loop evaluation notes.
   - Keep screenshot-based visual checks for desktop and mobile before launch.

4. **Productization**
   - Production metadata, Open Graph, robots, sitemap, and baseline security headers are implemented. Decide deployment target and analytics before public release.
   - Resolve dependency audit findings or document accepted risk before public release.
   - Release checklist with known limitations, validation commands, rollback criteria, and next-phase candidates is implemented.

---

## File Structure

| Path | Responsibility |
|---|---|
| `app/[locale]/` | Locale-prefixed pages and layouts |
| `components/layout/` | Header, locale toggle, curriculum rail, table of contents, page shell |
| `components/learning/` | Prompt Builder, Context Stack, Workflow Simulator, quiz, progress components |
| `components/showcase/` | 3D Digital Twin, Semiconductor Explorer, Agentic Workflow Control Room, and showcase UI |
| `content/ko/` | Korean MDX lessons, labs, glossary, resources |
| `content/en/` | English MDX lessons, labs, glossary, resources |
| `lib/content/` | Content loading, locale validation, navigation tree |
| `lib/i18n/` | Locale config, route helpers, dictionary helpers |
| `lib/progress/` | `localStorage` progress persistence |
| `tests/` | Unit, content integrity, route, accessibility, and visual smoke tests |

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `next.config.mjs`
- Create: `tsconfig.json`
- Create: `app/globals.css`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`

- [ ] Initialize a Next.js TypeScript app in `/Users/byeong-cheolkim/dev/AI_History`.
- [ ] Install runtime dependencies: `next`, `react`, `react-dom`, `@mdx-js/react`, `framer-motion`, `three`, `@react-three/fiber`, `@react-three/drei`, `lucide-react`.
- [ ] Install dev dependencies: `typescript`, `tailwindcss`, `postcss`, `autoprefixer`, `vitest`, `@testing-library/react`, `@playwright/test`, `eslint`, `prettier`.
- [ ] Configure Tailwind content paths for `app`, `components`, `content`, and `lib`.
- [ ] Run `npm run lint`, `npm run typecheck`, and `npm run test` scripts after adding them.

### Task 2: Locale Routing And Shell

**Files:**
- Create: `lib/i18n/config.ts`
- Create: `lib/i18n/routes.ts`
- Create: `app/[locale]/layout.tsx`
- Create: `app/[locale]/page.tsx`
- Create: `components/layout/site-header.tsx`
- Create: `components/layout/locale-toggle.tsx`
- Create: `tests/i18n-routes.test.ts`

- [ ] Define supported locales as `ko` and `en`; default locale is `ko`.
- [ ] Redirect `/` to `/ko`.
- [ ] Implement a locale toggle that keeps the same slug when switching languages.
- [ ] Persist the last selected locale in `localStorage` or cookie.
- [ ] Add tests that verify every main route has both Korean and English equivalents.

### Task 3: Content System

**Files:**
- Create: `lib/content/types.ts`
- Create: `lib/content/registry.ts`
- Create: `lib/content/get-content.ts`
- Create: `content/ko/github-copilot/vscode.mdx`
- Create: `content/en/github-copilot/vscode.mdx`
- Create: `content/ko/glossary/index.json`
- Create: `content/en/glossary/index.json`
- Create: `tests/content-integrity.test.ts`

- [ ] Define typed content models for `Lesson`, `Lab`, `Quiz`, `GlossaryTerm`, `TimelineEvent`, and `SourceRef`.
- [ ] Add Korean and English content directories with matching slugs.
- [ ] Add integrity tests for missing locale pairs, duplicate slugs, missing source refs, and invalid related lesson IDs.
- [ ] Require source-sensitive lessons to include `updatedAt` and `sourceRefs`.

### Task 4: Learning Layouts

**Files:**
- Create: `components/layout/learning-shell.tsx`
- Create: `components/layout/curriculum-rail.tsx`
- Create: `components/layout/table-of-contents.tsx`
- Create: `components/layout/next-lesson-bar.tsx`
- Create: `app/[locale]/github-copilot/page.tsx`
- Create: `app/[locale]/github-copilot/vscode/page.tsx`

- [ ] Build the desktop learning layout with left curriculum rail, central content, and right table of contents.
- [ ] Build tablet/mobile fallbacks with collapsible curriculum and compact table of contents.
- [ ] Add persistent next lesson action at the bottom of lesson pages.
- [ ] Verify Korean and English text do not overflow in navigation and action buttons.

### Task 5: Homepage Learning Dashboard

**Files:**
- Modify: `app/[locale]/page.tsx`
- Create: `components/home/learning-dashboard.tsx`
- Create: `components/home/skill-diagnostic-preview.tsx`
- Create: `components/home/concept-map-preview.tsx`
- Create: `components/home/showcase-preview.tsx`

- [ ] Build the first screen as a learning control center, not a marketing landing page.
- [ ] Include recommended paths, current skill checklist, GitHub Copilot focus area, agentic AI concept map, and AI Web Design Lab preview.
- [ ] Use restrained motion for entrance and path progress, with reduced-motion support.

### Task 6: Interactive Learning Labs

**Files:**
- Create: `components/learning/prompt-builder.tsx`
- Create: `components/learning/context-stack.tsx`
- Create: `components/learning/copilot-workflow-simulator.tsx`
- Create: `components/learning/agent-loop-visualizer.tsx`
- Create: `components/learning/quiz-engine.tsx`
- Create: `app/[locale]/labs/page.tsx`
- Create: `tests/learning-components.test.tsx`

- [ ] Implement Prompt Builder with deterministic scoring for goal, context, constraints, output format, and verification criteria.
- [ ] Implement Context Stack showing files, selection, issue, docs, and MCP tool layers.
- [ ] Implement Copilot Workflow Simulator for requirement, code, test, review, and security steps.
- [x] Extend Copilot Workflow Simulator into an end-to-end checkout incident runbook with issue brief, context pack, dry run, no-write investigation, approval gate, verification evidence, and PR review contract.
- [ ] Implement Agent Loop Visualizer for plan, act, observe, evaluate, and revise.
- [ ] Implement quiz feedback that does not rely on color alone.

### Task 7: Agentic AI And Timeline Pages

**Files:**
- Create: `app/[locale]/agentic-ai/page.tsx`
- Create: `components/agentic-ai/evolution-timeline.tsx`
- Create: `components/agentic-ai/concept-stages.tsx`
- Create: `content/ko/agentic-ai/index.mdx`
- Create: `content/en/agentic-ai/index.mdx`

- [ ] Build the narrative from prompt engineering to context engineering, RAG, MCP, agents, skills, harness engineering, and loop engineering.
- [ ] Add a year-by-year section for 2022 through 2026.
- [ ] Present loop engineering and Ralph Wiggum Loop as emerging practices, not settled standards.
- [ ] Include source links and investigation date on the page.

### Task 8: AI Web Design Showcase

**Files:**
- Create: `app/[locale]/showcase/page.tsx`
- Create: `app/[locale]/showcase/digital-twin/page.tsx`
- Create: `app/[locale]/showcase/semiconductor/page.tsx`
- Create: `app/[locale]/showcase/semiconductor-design-explorer/page.tsx`
- Create: `app/[locale]/showcase/agent-control-room/page.tsx`
- Create: `app/[locale]/showcase/agentic-workflow-control-room/page.tsx`
- Create: `components/showcase/digital-twin-scene.tsx`
- Create: `components/showcase/showcase-breakdown.tsx`
- Create: `tests/showcase-smoke.spec.ts`

- [ ] Build 3D Digital Twin as the MVP flagship showcase.
- [ ] Use mock telemetry for sensors, alarms, equipment KPI, time slider, and AI analysis panel.
- [ ] Add mobile fallback and reduced-motion behavior.
- [ ] Add interactive pages for 3D Semiconductor Design Explorer and Agentic Workflow Control Room.
- [ ] Structure every showcase as `Experience`, `How AI Helped`, and `Build Breakdown`.

### Task 9: Microsoft Copilot And Governance Track

**Files:**
- Create: `app/[locale]/microsoft-copilot/page.tsx`
- Create: `content/ko/microsoft-copilot/index.mdx`
- Create: `content/en/microsoft-copilot/index.mdx`
- Create: `components/copilot/comparison-table.tsx`

- [ ] Explain Microsoft Copilot, Microsoft 365 Copilot Chat, Microsoft 365 Copilot, and Copilot Studio separately.
- [ ] Distinguish personal Microsoft account, work/school account, Entra ID, Microsoft Graph grounding, and enterprise data protection.
- [ ] Compare Microsoft Copilot with GitHub Copilot by audience, data context, admin surface, and common workflows.

### Task 10: Glossary, Resources, And Search

**Files:**
- Create: `app/[locale]/glossary/page.tsx`
- Create: `app/[locale]/resources/page.tsx`
- Create: `components/glossary/glossary-list.tsx`
- Create: `components/search/static-search.tsx`
- Create: `lib/search/build-index.ts`
- Create: `tests/search.test.ts`

- [ ] Build bilingual glossary entries with Korean term, English term, short definition, and related concepts.
- [ ] Add resource pages for official docs, prompt templates, Copilot checklists, and AI safety checklists.
- [ ] Implement client-side search that matches Korean and English keywords.

### Task 11: Quality Gate

**Files:**
- Create: `tests/routes.spec.ts`
- Create: `tests/accessibility.spec.ts`
- Create: `tests/responsive-visual.spec.ts`
- Modify: `package.json`

- [ ] Add Playwright smoke tests for all MVP routes.
- [ ] Add desktop, tablet, and mobile screenshot checks for homepage, lesson, labs, and digital twin showcase.
- [ ] Verify keyboard navigation for header, locale toggle, curriculum, quiz, and lab controls.
- [ ] Verify no text overlap in Korean or English at common viewport sizes.
- [ ] Run full validation: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e`, `npm run build`.

### Task 12: Final Content Review And Launch Prep

**Files:**
- Modify: `content/ko/**`
- Modify: `content/en/**`
- Modify: `docs/product/ai-copilot-web-guide-spec.md`

- [ ] Recheck GitHub Copilot CLI, cloud agent, MCP, agent skills, code review, and Microsoft Copilot licensing docs before launch.
- [ ] Ensure every fast-changing page includes investigation date and source links.
- [ ] Review Korean and English terminology consistency.
- [ ] Confirm MVP exclusions are still excluded: login, external AI API calls, DB persistence, real industrial data integration.
- [x] Produce a final release checklist with known limitations and next-phase candidates.

---

## Acceptance Criteria

- All MVP pages exist under both `/ko` and `/en`.
- GitHub Copilot learning path is deeper than all secondary tracks.
- Users can complete at least one prompt lab, one workflow simulator, one quiz, and one 3D showcase experience without login.
- 3D Digital Twin and advanced showcase pages render nonblank on desktop and have usable fallbacks on mobile.
- Locale switching preserves the current page when a translated equivalent exists.
- Build, lint, typecheck, unit tests, route smoke tests, and responsive visual smoke tests pass.

## Follow-Up Phases

| Phase | Focus |
|---|---|
| Phase 2 | Polish accessibility, Build Breakdown depth, and visual-regression checks for all showcases |
| Phase 3 | Add real AI-assisted feedback through an API-backed prompt evaluator |
| Phase 4 | Add accounts, saved progress, team curriculum, and admin analytics |
| Phase 5 | Add CMS or content pipeline for regular Copilot/Microsoft update reviews |
