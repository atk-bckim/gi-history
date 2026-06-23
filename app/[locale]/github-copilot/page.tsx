import { notFound } from "next/navigation";
import { MarkdownArticle } from "@/components/content/markdown-article";
import { LearningShell } from "@/components/layout/learning-shell";
import { TopicPage } from "@/components/layout/topic-page";
import { lessons } from "@/lib/content/registry";
import { getMdxDocument } from "@/lib/content/mdx-docs";
import { getLessonBySlug } from "@/lib/content/selectors";
import type { Locale } from "@/lib/i18n/config";

export default async function GitHubCopilotPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const overviewLesson = getLessonBySlug("/github-copilot");
  const document = getMdxDocument(locale, "/github-copilot");
  const githubLessons = lessons.filter((lesson) =>
    lesson.slug.startsWith("/github-copilot/") &&
    lesson.slug !== "/github-copilot"
  );

  if (!overviewLesson || !document) notFound();

  return (
    <>
      <LearningShell
        locale={locale}
        lesson={overviewLesson}
        toc={document.headings}
        sourceRefs={document.sourceRefs}
      >
        <MarkdownArticle html={document.html} />
      </LearningShell>
      <TopicPage
        surface="section"
        locale={locale}
        title={locale === "ko" ? "다음 GitHub Copilot 강의" : "Next GitHub Copilot lessons"}
        description={
          locale === "ko"
            ? "개요를 읽은 뒤 VS Code, CLI, cloud agent, review/security 트랙으로 이어서 학습합니다."
            : "After the overview, continue into VS Code, CLI, cloud agent, and review/security tracks."
        }
        lessonsForTopic={githubLessons}
      />
    </>
  );
}
