import { MarkdownArticle } from "@/components/content/markdown-article";
import { getMdxDocument } from "@/lib/content/mdx-docs";
import type { Locale } from "@/lib/i18n/config";

export function LessonDocument({
  locale,
  slug
}: {
  locale: Locale;
  slug: string;
}) {
  const document = getMdxDocument(locale, slug);

  if (!document) {
    return null;
  }

  return <MarkdownArticle html={document.html} />;
}
