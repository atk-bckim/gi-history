import { notFound } from "next/navigation";
import { MarkdownArticle } from "@/components/content/markdown-article";
import { LearningShell } from "@/components/layout/learning-shell";
import { getMdxDocument } from "@/lib/content/mdx-docs";
import { getLessonBySlug } from "@/lib/content/selectors";
import type { Locale } from "@/lib/i18n/config";

export default async function MicrosoftCopilotPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const lesson = getLessonBySlug("/microsoft-copilot");
  const document = getMdxDocument(locale, "/microsoft-copilot");

  if (!lesson || !document) notFound();

  return (
    <LearningShell
      locale={locale}
      lesson={lesson}
      toc={document.headings}
      sourceRefs={document.sourceRefs}
    >
      <MarkdownArticle html={document.html} />
    </LearningShell>
  );
}
